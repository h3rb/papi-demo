<?php

 class API {

  static function Credentials( $vars ) {
   if ( isset($vars['login']) && is_array($vars['login']) ) {
    $un = $vars['login']['username'];
    $pw = $vars['login']['password'];
    $result=Auth::Login($un,$pw);
    if ( $result === -123 ) API::Failure("Password is expired.",-123);
    API::Response("success","Logged in.",array("key"=>$result));
   }
   if (!isset($vars['session'])) return API::HeaderCredentials($vars);
   return Session::ByKey($vars['session']);
  }

  static function HeaderCredentials( $vars ) {
   global $headers, $auth_database, $auth, $session_id, $session, $session_token, $is_admin;
   $session_id=-1;
   $session=NULL;
   $is_admin=FALSE;
   $headers = apache_request_headers();
   API::PublicAPI($vars);
   if ( isset($headers['X-Papi-Application-Id']) && $headers['X-Papi-Application-Id']==stringval(MY_APP_ID) ) {
    if ( isset( $headers['X-Papi-Admin-Token'] ) && $headers['X-Papi-Admin-Token']==stringval(MY_ADMIN_TOKEN) ) {
     $is_admin &= TRUE;
    }
    if ( isset( $headers['X-Papi-Session-Token'] ) ) {
     $session_token=$headers['X-Papi-Session-Token'];
     $session=Session::ByToken($session_token);
     $session_id=$session['ID'];
     if ( false_or_null($session) ) {
      API::Failure("Session is Expired or Invalid",102);
     }
     $result=Session::HeaderRefresh();
     if ( $result === NULL ) {
      if ( !$is_admin ) API::Failure("Session is Invalid",103);
     }
     if ( $result === FALSE ) {
      if ( !$is_admin ) API::Failure("Session is Expired",104);
     }
     $m=new User($auth_database);
     $auth=$m->Get($session['r_User']);
     if ( false_or_null($auth) ) {
      if ( !$is_admin ) API::Failure("User is not valid for Session",101);
     }
     $is_admin=(intval($auth['su'])>0)?TRUE:$is_admin;
    }
    return $session;
   } else API::Failure("Failed to include valid application identification header.",100);
  }

  static function Failure( $reason, $errcode=-1 ) {
   http_response_code(400);
   echo json_encode(array("result"=>"failure", "reason"=>$reason, "error"=>$errcode));
   die;
  }

  static function Response( $result, $message, $data=NULL ) {
   http_response_code(200);
   if ( $data === NULL ) $arr=array("result"=>$result, "message"=>$message);
   else
   $arr=array( "result"=>$result, "message"=>$message, "data"=>$data );
   if ( strlen($message) === 0 ) unset($arr['message']);
   echo json_encode($arr);
   die;
  }

  static function Success( $message, $data=NULL ) { return is_array($message) && $data === NULL ? API::Response("success","",$message) : API::Response( "success", $message, $data ); }

  static function GetValue( $vars, $ak, $errcode=-1 ) {
   if ( !isset($vars[$ak]) || false_or_null($vars[$ak]) ) API::Failure( 'No '.$ak.' provided (required value).', $errcode );
   return $vars[$ak];
  }

  static function MapValues( $dataName, $in, $map, $defaults ) {
   $final = array();
   $keys = array_keys($map);
   foreach ( $keys as $k ) {
    if ( !isset($map[$k]) ) API::Failure("Invalid data key '$k' submitted for '$dataName'", -8 );
    $column=$map[$k][0];
    $type=$map[$k][1];
    if ( isset($in[$k]) ) {
     $value=$in[$k];
     if ( $type == 'user' ) { global $auth; $final[$column]=$auth['ID']; }
     if ( $type == 'reference' ) {
      if ( is_numeric($value) ) {
       $table=str_replace($column,"r_");
       $id = intval($value);
       if ( $id === 0 ) $final[$column]=intval($value); // remove reference
       else if ( API::OwnerOf($table,intval($value)) ) $final[$column]=intval($value);
       else API::Failure( "Reference to member of $table not owned by user (or does not exist)", -11);
      } else API::Failure( "Wrong type for value '$k', expected $type", -9 );
     } else if ( $type == 'integer' ) {
      if ( is_numeric($value) ) $final[$column]=intval($value);
      else API::Failure( "Wrong type for value '$k', expected $type", -9 );
     } else if ( $type == 'decimal' ) {
      if ( is_numeric($value) ) $final[$column]=floatval($value);
      else API::Failure( "Wrong type for value '$k', expected $type", -9 );
     } else if ( $type == 'bool' || $type == 'boolean' ) {
      $v=0;
      if ( is_bool($value) ) $v = $value ? 1 : 0;
      else if ( is_numeric($value) ) $v = intval($value);
      else if ( is_string($value) && is($v,'yes','no','YES','NO','TRUE','FALSE','1','0','y','n','t','f','Y','N','T','F') ) {
       $v = is($v,array('yes','1','true','y','t')) ? 1 : 0;
      } else API::Failure( "Wrong value for boolean '$k', expected a boolean value of TRUE/true, FALSE/false, 0, 1, or a string true, false, yes, no, 0, 1, y, n, t, f", -5 );
      if ( $v === 0 ) $final[$column]=0;
      else $final[$column]=1;
     } else if ( $type == 'string' ) {
      $final[$column] = strval($value);
     }
    } else if ( isset($defaults[$column]) ) {
     $final[$column] = $defaults[$column];
    } else API::Failure("Invalid data key '$k' submitted for '$dataName'", -8 );
   }
  }

  // Checks if you are an owner of a particular ID for a table, does a lookup
  static function OwnerOf( $table, $id ) {
   global $database;
   global $auth;
   $model = new $table($database);
   $result = $model->Get($id);
   if ( !false_or_null($result) && is_array($result) && intval($auth['ID']) == intval($result['Owner']) ) {
    return TRUE;
   }
   return FALSE;
  }

  // Checks an array for "Owner" value equal to auth['ID']
  static function UserNotOwner( $tablename, $values ) {
   if ( !isset($values['Owner']) ) API::Failure("Check against Owner value not possible.",-12);
   if ( intval($values['Owner']) != intval($auth['ID']) ) API::Failure("Attempt to set 'owner' value in $tablename to another user ID not allowed in this context.",-13);
   return TRUE;
  }


  // Create a test, organization, question or answer.
  static function Create( $vars, $subject ) {
   if ( !isset($vars['data']) ) API::Failure("Create operation: No data set provided.", -7);
   if ( is($subject,"test") ) Assessment::Make($vars);
   else if ( is($subject,"q") ) AssessmentQuestion::Make($vars);
   else if ( is($subject,"a") ) AssessmentAnswer::Make($vars);
  }

  // Remove (delete) a test, organization, question or answer.
  static function Remove( $vars, $subject, $id ) {
   if ( is($subject,"test") ) Test::Drop($vars);
   else if ( is($subject,"q") ) Question::Drop($vars);
   else if ( is($subject,"a") ) Answer::Drop($vars);
  }

  // Modify a test, question, answer, organization or certification
  static function Modify( $vars, $subject, $id ) {
   if ( !isset($vars['data']) ) API::Failure("Modify operation: No data set provided.", -7);
   if ( is($subject,"test") ) Assessment::Modify($vars);
   else if ( is($subject,"q") ) AssessmentQuestion::Modify($vars);
   else if ( is($subject,"a") ) AssessmentAnswer::Modify($vars);
  }

  // Update a testing session in progress
  static function Update( $vars, $id ) {
  }

  // View the profile of a user (include oneself)
  static function Profile( $vars, $id ) {
  }

  // Grade the results for a test taker
  static function Grade( $vars, $id ) {
  }

  // Invalidated the results of a taken test or certification (de-certify)
  static function Invalidate( $vars, $id ) {
  }

  // Validate (assert) the certification of a test taker
  static function Validate( $vars, $id ) {
  }

 // The following function handles "public" API calls that don't require
 // a valid session.

 static function PublicAPI( $vars ) {
  global $headers,$session_id,$session,$session_token,$database,$auth,$is_admin;
  $j = $vars;
  $action = $j['action'];


 switch ( $action ) {
  case "identify":
    $json=array(
      "host"=>$_SERVER["HTTP_HOST"],
      "method"=>$_SERVER["REQUEST_METHOD"],
      "post"=>$_POST,
      "headers"=>$headers,
      "session_id"=>$session_id,
      "session"=>$session,
      "admin"=>$is_admin
    );
   break;
  case "login":
    if ( !isset($j["username"])
      || !isset($j["password"]) ) API::Failure("Not enough parameters for action 'login'",102,$g);
    $un=$j["username"];
    $pw=$j["password"];
    $result=Auth::Login($un,$pw);
    if ( $session_id === FALSE ) API::Failure("Could not log in, no password set, check for password reset email",102);
    if ( $session_id === NULL ) API::Failure("Invalid username/password.",102);
    $json=array("user"=>$auth['ID'],"token"=>$session_token,"admin"=>$is_admin);
   break;
  case "logout":
    if ( is_null($session) ) API::Failure("Not logged in",-1);
    if ( Auth::Logout($session) ) API::Failure("Logged out.",1);
    else API::Failure("Session had expired.",-1);
   break;
  case "forgot":
    if ( !isset($j["email"]) ) API::Failure("Not enough parameters for action 'forgot'",102);
    $em=$j["email"];
    $user=User::ByEmail($em);
    if ( false_or_null($user) ) API::Failure("No such user with that email address.",102);
    $result=Auth::Forgot($user);
    $json=array("result"=>"success","message"=>"Forgot email sent.","values"=>$result);
   break;
   case "me":
    if ( is_null($session) || is_null($auth) ) API::Failure("Not logged in",-1);
    $json=array( "result"=>array(
     "user"=>RemoveKeys($auth,array("password","forgotKey","forgotExpires")),
    ));
   break;
  case "users":
    if ( is_null($session) ) API::Failure("Not logged in",-1);
    $result=User::GetUsers($auth);
    if ( false_or_null($result) ) API::Failure("Nothing found",0);
   break;
  case "user":
    if ( is_null($session) ) API::Failure("Not logged in",-1);
    if ( isset($j["create"]) ) {
     $filter=array( "firstname", "lastname", "company", "username", "password" );
     $filtered=OnlyKeys($j["create"],$filter);
     $result=User::CreateNew($co,$filtered);
     $json=array("result"=>$result);
    } else if ( isset($j["update"]) ) {
     $filter=array( "firstname", "lastname", "company", "username", "password", "email" );
     $userId=$j["ID"];
     if ( false_or_null(User::UpdateProtected($auth,$userId,$filtered)) ) API::Failure("Could not complete action 'update' on 'user'",102,$g);
     $result="success";
    } else if ( isset($j["get"]) ) {
     $result=User::FindByID($auth,$j["get"]);
     if ( false_or_null($result) ) API::Failure("Nothing found",0);
    } else if ( isset($j["delete"]) ) {
     $result=User::DeleteByID($auth,$j["delete"]);
     if ( false_or_null($result) ) API::Failure("Nothing found",0);
    }
    if ( false_or_null($result) ) API::Failure("Nothing found",0);
    $json=array("result"=>$result);
   break;
  case "datetime":
    $json["result"]=array( "currentTime"=>array("__Type:"=>"Date","iso"=>$TODAY) );
   break;
  default: return FALSE; break;
  }
  API::Success("", $json);
 }

 // Failure sends code 400


  static public function EndTransmit( $log_msg, $parse_code=-1, $values=NULL ) {
   plog("Bad Request 400 Sent - $log_msg");
   http_response_code(400);
   header("HTTP/1.0 400 Bad Request");
   if ( is_array($values) )
   echo json_encode( array(
     "code"=>$parse_code,
     "message"=>$log_msg,
     "values"=>$values
    )
   );
   else echo json_encode( array(
     "code"=>$parse_code,
     "message"=>$log_msg
    )
   );
   die;
  }

 };
