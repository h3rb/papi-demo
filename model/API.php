<?php

 class API {

  static function Credentials( $vars ) {
   if ( isset($vars['login']) && is_array($vars['login']) ) {
    $un = $vars['login']['username'];
    $pw = $vars['login']['password'];
    $result=Auth::APILogin($un,$pw);
    if ( $result !== FALSE ) {
     if ( $result == -123 ) { API::Failure("Password needs reset.",-123); }
     API::Response("success","Logged in.",array("key"=>$result));
    }
   }
   if (!isset($vars['session'])) return FALSE;
   return Session::ByKey($vars['session']);
  }

  static function Failure( $reason, $errcode=-1 ) {
   echo json_encode(array("result"=>"failure", "reason"=>$reason, "error"=>$errcode)); die;
  }

  static function Response( $result, $message, $data=NULL ) {
   if ( $data === NULL ) $arr=array("result"=>$result, "message"=>$message);
   else
   $arr=array( "result"=>$result, "message"=>$message, "data"=>$data );
   echo json_encode($arr); die;
  }

  static function Success( $message, $data=NULL ) { return API::Response( "success", $message, $data ); }

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

 };
