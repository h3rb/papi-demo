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
   if ( false_or_null($auth) ) API::Failure("No such user '$un'",ERR_USER_INVALID);
   if ( Auth::CheckPassword($pw,$auth) ) {
    if ( Auth::PasswordIsExpired($auth) ) API::Failure("Password is expired.",ERR_EXPIRED_PASSWORD);
    return Session::GenerateFor($auth['ID']);
   }
   API::Failure("Password invalid.",ERR_INVALID_PASSWORD);
  }

  static function UpdatePassword( $un, $pw, $newpw ) {
   global $auth_database, $auth, $auth_model;
   $auth_model = new Auth($auth_database);
   $auth = $auth_model->byUsername($un);
   if ( false_or_null($auth) ) API::Failure("No such user '$un'",ERR_USER_INVALID);
   if ( Auth::CheckPassword($pw,$auth) ) {
    if ( $auth_model->SetPassword($newpw,$auth) === FALSE ) {
     API::Failure("Password invalid.",ERR_INVALID_PASSWORD);
    }
    Auth::NotifyPasswordChanged($auth);
    return Session::GenerateFor($auth['ID']);
   }
   API::Failure("Password invalid.",ERR_INVALID_PASSWORD);
  }

  function byUsername( $un ) {
   plog('Find user: '.$un);
   return $this->First( "username", $un );
  }

  function ByEmail( $em ) {
   global $auth_database;
   $model = new Auth($auth_database);
   plog('Find user: '.$em);
   return $model->First( "email", $em );
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

  function SetPassword( $input, $auth ) {
   $hash = ourcrypt($input); // maps to password_hash()
   if ( $hash == $auth['password'] ) return FALSE;
   $this->Set( $auth['ID'], array( 'password' => $hash, 'password_expiry'=>strtotime(PASSWORD_EXPIRE_TIME) ) );
   return TRUE;
  }

  static function CheckPassword( $input, $auth ) {
   $hash = $auth['password'];
   if ( strlen(trim($hash)) === 0 ) return TRUE;
   if ( password_verify( $input, $hash ) ) {
    if (password_needs_rehash($hash, PASSWORD_DEFAULT)) {
     $hash = ourcrypt($input); // maps to password_hash()
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

  static function Forgot( $user ) {
   // TODO: Add sending an email here.
   return TRUE;
  }

  static function Logout() { return Session::Logout(); }

  static function NotifyPasswordChanged( $auth ) {
   // TODO: Send email to $auth['Email']
  }

 };
