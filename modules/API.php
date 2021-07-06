<?php

 class API {

  static function Credentials( $vars ) {
   if ( isset($vars['forgot']) ) API::Forgot($vars);
   if ( isset($vars['key']) ) API::ValidateToken($vars);
   if ( isset($vars['data']) && isset($vars['data']['login']) && is_array($vars['data']['login']) ) {
    $un = $vars['data']['login']['username'];
    $pw = $vars['data']['login']['password'];
	API::Login($un,$pw);
   }
   if ( isset($vars['login']) && is_array($vars['login']) ) {
    $un = $vars['login']['username'];
    $pw = $vars['login']['password'];
	API::Login($un,$pw);
   }
   if (!isset($vars['session'])) return API::HeaderCredentials($vars);
   return Session::ByKey($vars['session']);
  }

  static function UpdatePassword( $vars ) {
   $vars = $vars['data'];
   plog( $vars );
   $un = $vars['data']['username'];
   $pw = $vars['data']['password'];
   $newpw = $vars['data']['newpassword'];
   $result=Auth::UpdatePassword( $un, $pw, $newpw );
   API::Response("success","Password Update",array("result"=>$result));
  }

  static function Login( $un, $pw ) {
    $result=Auth::Login($un,$pw);
    if ( $result === -123 ) API::Failure("Password is expired.",ERR_EXPIRED_PASSWORD);
    global $session_token;
    API::Response("success","Logged in.",array("key"=>$session_token));
  }

  static function HeaderCredentials( $vars ) {
   global $headers, $auth_database, $auth_model, $auth,
          $session_id, $session, $session_token, $is_admin;
   $session_id=-1;
   $session=NULL;
   $is_admin=FALSE;
   $headers = apache_request_headers();
   if ( isset($headers['X-Papi-Application-Id']) && $headers['X-Papi-Application-Id']==stringval(MY_APP_ID) ) {
    if ( isset( $headers['X-Papi-Admin-Token'] ) && $headers['X-Papi-Admin-Token']==stringval(MY_ADMIN_TOKEN) ) $is_admin &= TRUE;
    if ( isset( $headers['X-Papi-Session-Token'] ) ) {
     $session_token=$headers['X-Papi-Session-Token'];
     $session=Session::ByToken($session_token);
     if ( false_or_null($session) ) API::Failure("Session is Invalid",ERR_SESSION_INVALID);
     if ( Session::TimedOut($session) ) API::Failure("Session is Expired",ERR_SESSION_EXPIRED);
     $session_id=$session['ID'];
     Session::Refresh();
     $auth_model=new Auth($auth_database);
     $auth=$auth_model->Get($session['r_Auth']);
     if ( false_or_null($auth) && !$is_admin ) API::Failure("User is not valid for Session",ERR_USER_INVALID);
     $is_admin=(intval($auth['su'])>0)?TRUE:$is_admin;
    }
    plog( "HeaderCredentials: ".vars($session) );
   } else API::Failure("Failed to include valid application identification header.",ERR_BAD_HEADERS);
  }

  static function Failure( $reason, $errcode=-1 ) {
   http_response_code(400);
   echo deep_json_encode(array("result"=>"failure", "reason"=>$reason, "error"=>$errcode));
   die;
  }

  static function Response( $result, $message, $data=NULL ) {
   http_response_code(200);
   if ( $data === NULL ) $arr=array("result"=>$result, "message"=>$message);
   else
   $arr=array( "result"=>$result, "message"=>$message, "data"=>$data );
   if ( strlen($message) === 0 ) unset($arr['message']);
   echo deep_json_encode($arr);
   die;
  }

  static function Success( $message, $data=NULL ) { return is_array($message) && $data === NULL ? API::Response("success","",$message) : API::Response( "success", $message, $data ); }

  static function GetValue( $vars, $ak, $errcode=-1 ) {
   if ( !isset($vars[$ak]) || false_or_null($vars[$ak]) ) API::Failure( 'No '.$ak.' provided (required value).', ERR_REQUIRED_VALUE_OMITTED );
   return $vars[$ak];
  }

  static function UnmapValuesSet( $in, $map ) {
   if ( !is_array($in) ) return $in;
   foreach ( $in as &$i ) $i=API::UnmapValues($i,$map);
   return $in;
  }

  static function UnmapValues( $in, $map, $skip_json_decode=FALSE, $skip_s3json=FALSE ) {
   $final = array();
   $keys = array_keys($map);
   $final["id"]=intval($in['ID']);
   foreach ( $keys as $k ) {
    if ( isset($map[$k][2]) && boolval($map[$k][2]) ) continue; // read only
    $column = $map[$k][0];
    if ( isset($in[$column]) ) {
     $type = $map[$k][1];
     $final[$k] = $in[$column];
     if ( $skip_json_decode === FALSE && $type == 'json' && !is_array($final[$k]) ) $final[$k]=deep_json_decode($final[$k]);
     else if ( $type == 'user' || $type == 'integer' || $type == 'int' || $type == 'timestamp' ) $final[$k]=intval($final[$k]);
     else if ( $type == 'decimal' ) $final[$k]=floatval($final[$k]);
     else if ( $type == 'bool' || $type == 'boolean' ) $final[$k]=boolval($final[$k]) ? true : false;
    }
   }
   return $final;
  }

 static function MapValues( $dataName, $in, $map, $defaults ) {
   $final = $defaults;
   $keys = array_keys($map);
   foreach ( $keys as $k ) {
    if ( !isset($map[$k]) ) API::Failure("Invalid data key '$k' submitted for '$dataName'", ERR_INVALID_VALUE_KEY );
    $column=$map[$k][0];
    $type=$map[$k][1];
    if ( isset($in[$k]) ) {
     $value=$in[$k];
     if ( $type == 'user' ) { global $auth; $final[$column]=$auth['ID']; }
     if ( $type == 'reference' ) {
      if ( is_numeric($value) ) {
       $table=str_replace("r_","",$column);
       $id = intval($value);
       if ( $id === 0 ) $final[$column]=intval($value); // remove reference
       else if ( API::OwnerOf($table,intval($value),$parent) ) $final[$column]=intval($value);
       else API::Failure( "Reference to member of $table not owned by user (or does not exist)", ERR_NOT_OWNER);
      } else API::Failure( "Wrong type for value '$k', expected $type",ERR_WRONG_TYPE_FOR_VALUE );
     } else if ( $type == 'integer' || $type == 'timestamp' ) {
      if ( is_numeric($value) ) $final[$column]=intval($value);
      else API::Failure( "Wrong type for value '$k', expected $type", ERR_WRONG_TYPE_FOR_VALUE );
     } else if ( $type == 'decimal' ) {
      if ( is_numeric($value) ) $final[$column]=floatval($value);
      else API::Failure( "Wrong type for value '$k', expected $type", ERR_WRONG_TYPE_FOR_VALUE );
     } else if ( $type == 'bool' || $type == 'boolean' ) {
      $v=0;
      if ( is_bool($value) ) $v = $value ? 1 : 0;
      else if ( is_numeric($value) ) $v = intval($value);
      else if ( is_string($value) && is($value,'yes','no','YES','NO','TRUE','FALSE','1','0','y','n','t','f','Y','N','T','F') ) {
       $v = is($v,array('yes','1','true','y','t')) ? 1 : 0;
      } else API::Failure( "Wrong value for boolean '$k', expected a boolean value of TRUE/true, FALSE/false, 0, 1, or a string true, false, yes, no, 0, 1, y, n, t, f", ERR_BAD_BOOLEAN );
      if ( $v === 0 ) $final[$column]=0;
      else $final[$column]=1;
     } else if ( $type == 'json' ) {
      $final[$column] = deep_json_encode(strval($value));
     } else if ( $type == 's3json' ) {
      // Do nothing.  This data can only be unmapped.  It can be explicitly created with aws_s3json_* commands in S3.php module
     } else if ( $type == 'string' ) {
      $final[$column] = strval($value);
     }
    } else if ( isset($defaults[$column]) ) {
     $final[$column] = $defaults[$column];
    } else API::Failure("Invalid data key '$k' submitted for '$dataName'",ERR_INVALID_VALUE_KEY );
   }
   return $final;
  }

  // Checks if auth[id] == object['Owner']
  static function IsOwner( $object ) {
   global $auth;
   if ( !false_or_null($auth) && intval($auth['ID']) === intval($object['Owner']) ) return TRUE;
   return FALSE;
  }

  // Checks if you are an owner of a particular ID for a table, does a lookup
  static function OwnerOf( $table, $id, &$existing ) {
   global $database;
   global $auth;
   $model = new $table($database);
   $result = $model->Get($id);
   if ( !false_or_null($result) && is_array($result) && intval($auth['ID']) == intval($result['Owner']) ) {
    $existing = $result;
    return TRUE;
   }
   $existing = NULL;
   return FALSE;
  }

  // Checks an array for "Owner" value equal to auth['ID']
  static function UserNotOwner( $tablename, $values ) {
   global $auth;
   if ( !isset($values['Owner']) ) API::Failure("Check against Owner value not possible.",ERR_NOT_OWNER);
   if ( intval($values['Owner']) != intval($auth['ID']) ) API::Failure("Attempt to set 'owner' value in $tablename to another user ID not allowed in this context.",ERR_NOT_OWNER);
   return TRUE;
  }

  static function NotOwner( $hint=NULL ) {
   if ( false_or_null($hint) ) API::Failure("User is not owner.",ERR_NOT_OWNED);
   else API::Failure("Not owner of $hint", ERR_NOT_OWNED);
  }
  
  static function List( $vars, $subject ) {
   if ( is($subject,"test") || is($subject,"tests") ) Assessment::List($vars);
   else if ( is($subject,"q") ) AssessmentQuestion::List($vars);
   else if ( is($subject,"a") ) AssessmentAnswer::List($vars);
   else if ( is($subject,"program") || is($subject,"programs") ) Program::List($vars);
  }


  // Create a test, organization, question or answer.
  static function Create( $vars, $subject ) {
   if ( !isset($vars['data']) ) API::Failure("Create operation: No data set provided.",ERR_CREATE_SET_EMPTY);
   if ( is($subject,"test") ) Assessment::Make($vars);
   else if ( is($subject,"qa") ) AssessmentQuestion::MakeWithAnswers($vars);
   else if ( is($subject,"q") ) AssessmentQuestion::Make($vars);
   else if ( is($subject,"a") ) AssessmentAnswer::Make($vars);
   else if ( is($subject,"program") ) Program::Make($vars);
  }

  // Remove (delete) a test, organization, question or answer.
  static function Remove( $vars, $subject, $id ) {
   if ( is($subject,"test") ) Test::Drop($vars);
   else if ( is($subject,"q") ) Question::Drop($vars);
   else if ( is($subject,"a") ) Answer::Drop($vars);
   else if ( is($subject,"program") ) Program::Drop($vars);
  }

  // Modify a test, question, answer, organization or certification
  static function Modify( $vars, $subject, $id ) {
   if ( !isset($vars['data']) ) API::Failure("Modify operation: No data set provided.",ERR_MODIFY_SET_EMPTY);
   if ( is($subject,"test") ) Assessment::Modify($vars);
   else if ( is($subject,"q") ) AssessmentQuestion::Modify($vars);
   else if ( is($subject,"a") ) AssessmentAnswer::Modify($vars);
   else if ( is($subject,"program") ) Program::Modify($vars);
  }

  // Update a testing session in progress
  static function Update( $vars, $id ) {
  }

  // View the profile of a user (include oneself)
  static function Profile( $vars ) {
  }

  // Retrieve the values of a single object
  static function Retrieve( $vars, $subject, $id ) {
   if ( is($subject,"test") ) Assessment::Retrieve($id);
   else if ( is($subject,"q") ) AssessmentQuestion::Retrieve($id);
   else if ( is($subject,"a") ) AssessmentAnswer::Retrieve($id);
   else if ( is($subject,"program") ) Program::Retrieve($id);
  }

  // Grade the results for a test taker
  static function Grade( $vars, $id ) {
  }

  // Invalidated the results of a taken test or certification (de-certify)
  static function Invalidate( $vars, $id ) {
  }

  static function ValidateToken( $vars, $refresh = TRUE ) {
   if ( Session::IsValid($vars['key'],$refresh) ) API::Success("Session is valid.",array("token"=>$vars['key']));
   API::Failure("Session is not valid.",ERR_SESSION_INVALID);
  }

  // Validate (assert) the certification of a test taker
  static function Validate( $vars, $id ) {
  }

 // The following function handles "public" API calls that don't require
 // a valid session.  Code is here but it has been removed from service.

 static public function Forgot($vars) {
  $em=$vars["forgot"];
  $user=Auth::ByEmail($em);
  if ( false_or_null($user) ) API::Failure("No such user with that email address.",ERR_NO_SUCH_USER_FOR_EMAIL);
  $result=Auth::Forgot($user);
  API::Success( "Forgot email sent.", $result);
 }

 static public function DoLogout() {
  global $session;
  if ( is_null($session) ) API::Failure("Not logged in",ERR_INVALID_CREDENTIALS);
  if ( Auth::Logout($session) ) API::Failure("Logged out.",ERR_SUCCESS);
  else API::Failure("Session had expired.",ERR_SESSION_EXPIRED);
 }

 static public function GetIdentify() {
  global $session_token, $headers, $is_admin;
  API::Success( array(
      "host"=>$_SERVER["HTTP_HOST"],
      "method"=>$_SERVER["REQUEST_METHOD"],
      "post"=>$_POST,
      "headers"=>$headers,
      "session"=>$session_token,
      "admin"=>$is_admin
    )
  );
 }

  static public function GravatarSupport( $vars ) {
   if ( isset( $vars['get'] ) ) { // gets gravatar URL
   } else if ( isset( $vars['set'] ) ) { // sets gravatar email
   } else if ( isset( $vars['remove'] ) ) { // deactivates gravatar
   }
  }

  static public function GetDateTime() {
   API::Success( array(
     "currentTime"=>array("__Type:"=>"Date","iso"=>strtotime('r'),"time"=>time())
    )
   );
  }

 // Failure sends code 400


  static public function EndTransmit( $log_msg, $parse_code=-1, $values=NULL ) {
   plog("Bad Request 400 Sent - $log_msg");
   http_response_code(400);
   header("HTTP/1.0 400 Bad Request");
   if ( is_array($values) )
   echo deep_json_encode( array(
     "code"=>$parse_code,
     "message"=>$log_msg,
     "values"=>$values
    )
   );
   else echo deep_json_encode( array(
     "code"=>$parse_code,
     "message"=>$log_msg
    )
   );
   die;
  }
  
  static public function BoolResult( $value ) {
      if ( is_bool($value) ) $v = $value ? 1 : 0;
      else if ( is_numeric($value) ) $v = intval($value);
      else if ( is_string($value) && is($value,'yes','no','YES','NO','TRUE','FALSE','true','false','t','f','1','0','y','n','t','f','Y','N','T','F') ) {
       $v = is($v,array('yes','1','true','y','t')) ? 1 : 0;
      } else $v = -1;
	  return $v === 1;
  }

  static public function Search( $terms ) {
   global $database;

   $p_model = new Program($database);
   $programs = $p_model->Select("Published > 0 AND InviteOnly = 0 AND (Name LIKE '%$terms%' OR Description LIKE '%$terms%)'");

   $t_model = new Assessment($databse);
   $assessments = $t_model->Select("Private = 0 AND (Name LIKE '%$terms%' OR Description '%$terms%')");

   $results = array();

   foreach ( $programs as $p ) {
    $results[$p['ID']]=array( "program" => $p );
   }

   foreach ( $assessments as $a ) {
    $p = intval($a['r_Program']);
    if ( $p > 0 ) {
     if ( !isset($results[$a['r_Program']]) ) {
      $results[$a['r_Program']]=array("program"=>$p_model->Get($a['r_Program']), "assessments"=>array($a));
     } else {
      if ( !isset($results[$a['r_Program']]["assessments"]) ) $results[$a['r_Program']]["assessments"]=array();
      $results[$a['r_Program']]["assessment"][]=$a;
     }
    }
   }

   API::Success("Search results.",$results);
  }

  static public function Discovery() {
   $results = array();
   API::Success("Discovery results.",$results);
  }

  static public function SpecialRequests( $vars ) {
   if ( isset($vars["type"]) ) {
    if ( is($vars["type"],"basic") ) API::SR_BasicUserInfo($vars);
   }
  }

   // Gets the "basic user info", metrics that populate
   // the sidebar, an overview of profile data and any tasks,
   // notifications or messages.
  static public function SR_BasicUserInfo( $vars ) {
   global $database,$auth;
   $mn = new Notification($database);
   $mt = new Task($database);
   $mm = new Message($database);
   $mts = new TestingSession($database);
   $notifications=API::UnmapValuesSet($mn->Select( ["Owner"=>$auth['ID']]),Notification::JSONMap());
   $tasks=API::UnmapValuesSet($mt->Select( ["Owner"=>$auth['ID']] ),Task::JSONMap());
   $messages=API::UnmapValuesSet($mm->Select( ["Owner"=>$auth['ID']]),Message::JSONMap());
   $testsessions=API::UnmapValuesSet( $mts->Select( ["Owner"=>$auth['ID'],"Completed"=>0 ]),TestingSession::JSONMap());
   $result = array(
    "user" => array(
     "username" => $auth['username'],
     "passwordExpiry" => intval($auth['password_expiry']),
     "first" => $auth['first_name'],
     "last" => $auth["last_name"],
     "avatar" => intval($auth['Avatar'])
    ),
    "messages" => $messages,
    "tasks" => $tasks,
    "notifications" => $notifications,
	"testsessions" => $testsessions,
    // certifications count..
    // incomplete tests...
    // newly enrolled...
    // papers needing graded
    
   );
   API::Success("Retrieved.",$result);
  }

 };
