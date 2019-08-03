<?php

 class Auth extends Model {

  static function User( $a_id ) {
   global $auth_model;
   return $auth_model->Get($a_id);
  }

  static function Login( $un, $pw ) {
   global $auth_database, $auth, $auth_model;
   $auth_model = new Auth($auth_database);
   $auth = $auth_model->byUsername($un);
   if ( false_or_null($auth) ) API::Failure("No such user '$un'",-122);
   if ( Auth::CheckPassword($pw,$auth) ) {
    if ( Auth::PasswordIsExpired($auth) ) API::Failure("Password is expired.",-123);
    return Session::GenerateFor($auth['ID']);
   }
   API::Failure("Password invalid.",-121);
  }

  function byUsername( $un ) {
   plog('Find user: '.$un);
   return $this->First( "username", $un );
  }

  static function PasswordIsExpired( $auth ) {
   return ( strtotime('now') >= $auth['password_expiry'] );
  }

  static function ExpirePassword( $auth ) {
   if ( !false_or_null($auth) && isset($auth['ID']) ) {
    $this->Set( $auth['ID'], array( 'password_expiry'=>strtotime('now') ) );
    return TRUE;
   } else return FALSE;
  }

  static function SetPassword( $input, $auth ) {
   $hash = password_hash($input, PASSWORD_DEFAULT, $options);
   $this->Set( $auth['ID'], array( 'password' => $hash ) );
  }

  static function CheckPassword( $input, $auth ) {
   $hash = $auth['password'];
   if ( strlen(trim($hash)) === 0 ) return TRUE;
   if ( password_verify( $input, $hash ) ) {
    if (password_needs_rehash($hash, PASSWORD_DEFAULT, $options)) {
     $hash = password_hash($input, PASSWORD_DEFAULT, $options);
     $this->Set( $auth['ID'], array( 'password' => $hash ) );
    }
    return TRUE;
   }
   return FALSE;
  }

  static function ACL( $required ) {
   global $auth,$auth_database;
   if ( !is_array($auth) ) return FALSE;
   if ( !isset($auth['acl']) ) return FALSE;
   plog('Checking ACL: '.(is_array($required)?implode(',',$required):$required));
   return ACL::has($auth['acl'],$required);
  }

 };
