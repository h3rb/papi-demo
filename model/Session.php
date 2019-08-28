<?php

 include_once SITE_ROOT.'/core/lib/lib_locate_ip.php';

 global $session_refreshed; $session_refreshed=FALSE;

 class Session extends Model {

  static function GenerateFor( $r_Auth ) {
   return Session::CreateNew($r_Auth);
  }

  // Creates a new session
  static function CreateNew( $r_Auth, $CREATE_COOKIES=FALSE ) {
   global $database, $auth_database, $auth, $session, $session_token, $session_id;
   $model = new Session($auth_database);
   plog("Session::CreateNew for User ID: ".$r_Auth);
   $now=strtotime('now');
   $data=array(
    "login"    => $now,
    "REFERRER" => getenv('HTTP_REFERER'),
    "IP"       => getenv('REMOTE_ADDR'),
//    "ip_info"  => get_ip_info( getenv('REMOTE_ADDR') ),
    "BROWSER"  => getenv('HTTP_USER_AGENT'),
    "r_Auth"   => $r_Auth,
    "status"   => 1,
    'expiresAt'     => ($expiry=strtotime(SESSION_LENGTH))
   );
   $new_id=$model->Insert( $data );
   plog('New session ID: '.vars($new_id));
   if ( $CREATE_COOKIES !== FALSE ) cook( "username", $auth['username'], timeout );
   $session_token=md5(uniqid($new_id,true));
   $result=$model->Update(array(
    'token' => $session_token
   ), array("ID"=>$new_id));
   $session_id=$new_id;
   if ( $CREATE_COOKIES !== FALSE ) cook( "session",  $session_token, timeout );
   $session = $data;
   $session['token'] = $session_token;
   plog( "Session::CreateNew, token is: ".$session_token );
   return $session_id;
  }

  // Tests if there is a current session, called in the bootstrap
  public function Active( $refresh=TRUE ) {
   global $session_model,$auth_model,$auth,$is_logged_in,$session,$session_id,$session_token,$auth;
   plog( "Cookies: ".print_r($_COOKIE,true) );
   if ( !isset($_COOKIE['session']) ) return ($is_logged_in=false);
   $session=$this->ByToken(base64_decode($_COOKIE['session']) );
   if ( !is_array($session) || !isset($session['r_Auth']) ) { plog("No session or invalid Auth: ".print_r($session,true) ); return ($is_logged_in=false); }
   if ( $this->LoggedOut($session) ) { plog("Session was already logged out ".print_r($session,true)); return ($is_logged_in=false); }
   $auth=$auth_model->Get( $session['r_Auth'] );
   if ( !is_array($auth) ) { plog("Session's Auth was invalid"); return ($is_logged_in=false); }
   if ( $auth_model->ACL('locked') ) {
    plog('Account is locked, logging user '.$auth['ID'].' off.');
    $this->Logout();
    $is_logged_in=false;
    Page::Redirect("login?m=4");
   }
   $this->Refresh();
   $url=current_page_url();
   // Ignore any ajaxy stuff
   if ( stripos($url,"ajax.") === FALSE )
    $this->Set( $session['ID'], array( 'last_url'=>current_page_url() ) );
   return ($is_logged_in=true);
  }

  static public function ByUser( $r_Auth ) {
   global $database;
   $m=new Session($database);
   $sessions=$m->Select(array('r_Auth'=>$r_User));
   if ( false_or_null($sessions) ) return NULL;
   if ( count($sessions) === 0 ) return NULL;
   return array_shift($sessions);
  }

  static public function ByToken( $session_token ) {
   global $auth_database;
   $m=new Session($auth_database);
   return $m->First("token",$session_token);
  }

  // Tests if there is a current session, called in the bootstrap
  public function ByKey( $key, $refresh=TRUE ) {
   global $session_model,$auth_model;
   global $is_logged_in;
   global $session;
   global $auth;
   $session=$this->Get( base64_decode($key) );
   if ( !is_array($session) || !isset($session['r_Auth']) ) { plog("No session or invalid Auth: ".print_r($session,true) ); return ($is_logged_in=false); }
   if ( $this->LoggedOut($session) ) { plog("Session was already logged out ".print_r($session,true)); return ($is_logged_in=false); }
   $auth=$auth_model->Get( $session['r_Auth'] );
   if ( !is_array($auth) ) { plog("Session's Auth was invalid"); return ($is_logged_in=false); }
   if ( $auth_model->ACL('locked') ) {
    plog('Account is locked, logging user '.$auth['ID'].' off.');
    $this->Logout();
    $is_logged_in=false;
    Page::Redirect("login?m=4");
   }
   $this->Refresh();
   $url=current_page_url();
   // Ignore any ajaxy stuff
   if ( stripos($url,"ajax.") === FALSE )
    $this->Set( $session['ID'], array( 'last_url'=>current_page_url() ) );
   return ($is_logged_in=true);
  }

  public function LoggedOut( $session ) {
   return intval($session['status'])===0 || $this->TimedOut($session) || intval($session['logout']) > 0;
  }

  static public function TimedOut( $session ) {
   return (strtotime('now') > intval($session['expiresAt']));
  }

  public function ActiveUsers() {
   $users=$this->Select('status=1');
   $active=array();
   foreach ($users as $session) {
    if ( !$this->LoggedOut($session) ) $active[]=$session;
    else $this->Set($session['ID'],array('status'=>0));
   }
   return $active;
  }
  
    // Tests if there is a current session, called when you don't have a cookie to depend on (mobile client)
  public function isActive( $id, $refresh=TRUE ) {
   global $session_model,$auth_model;
   global $is_logged_in;
   global $session;
   global $auth;
   plog( "Cookies: ".print_r($_COOKIE,true) );
   $session=$this->Get( $id );
   if ( !is_array($session) || !isset($session['r_Auth']) ) { plog("No session or invalid Auth: ".print_r($session,true) ); return ($is_logged_in=false); }
   if ( $this->LoggedOut($session) ) { plog("Session was already logged out ".print_r($session,true)); return ($is_logged_in=false); }
   $auth=$auth_model->Get( $session['r_Auth'] );
   if ( !is_array($auth) ) { plog("Session's Auth was invalid"); return ($is_logged_in=false); }
   if ( $auth_model->ACL('locked') ) {
    plog('Account is locked, logging user '.$auth['ID'].' off.');
    $this->Logout();
    return ($is_logged_in=false);
   }
   $this->Refresh();
   $url=current_page_url();
   // Ignore any ajaxy stuff
   if ( stripos($url,"ajax.") === FALSE )
    $this->Set( $session['ID'], array( 'last_url'=>current_page_url() ) );
   return ($is_logged_in=true);
  }

  static function logged_in() { global $is_logged_in; plog("active session is ".($is_logged_in===false?"not ":"")."logged_in()"); return $is_logged_in; }

  // Redirect a user if they don't meet the security requirements for this page.
  function Security( $logged_in, $where_to_redirect="login", $acl=FALSE ) {
   global $is_logged_in;
   if ( boolval($logged_in) !== boolval($is_logged_in) ) {
    header( "Location: $where_to_redirect");
    return FALSE;
   }
   if ( $acl !== FALSE ) {
    global $auth;
    if ( Auth::ACL($auth['acl'],$acl) === FALSE ) {
     header( "Location: $where_to_redirect");
     return FALSE;
    }
   }
   return TRUE;
  }

 function username_cleaner($s) {
  return str_replace( "'", "''", strtolower($s) );
 }

 function username_is_not_clean($s) {
  $s=strtolower($s);
  if ( preg_match( "/ /", $s ) > 0 ) return true;
  if ( preg_match( "/'/", $s ) > 0 ) return true;
  if ( preg_match("/[^-a-z0-9_.-]/i", $name) ) return false;
 }

 // Debug function
 function get_session( $get_new_cookies=false, $reporting=false ) {
  if ( $get_new_cookies === true ) $this->Active(true);
  if ( $reporting === true ) $this->print_debug_info();
 }

 // Debug function
 function print_debug_info( $sid="none in this context" ) {
  global $auth, $session_model, $auth_model, $session;
  plog( '---------' );
  plog( '$_SESSION' );
  plog( $_SESSION );
  plog( '$_COOKIE' );
  plog( $_COOKIE );
  $logged_in=$this->check_cookie(true);
  plog('print_debug_info:');
  plog( 'logged in: ' . ($logged_in ? "Yes" : "No") );
  plog( 'User:' );
  plog( $auth );
  plog( 'Session (superglobal,b64): ' . $_SESSION['session'] );
  plog( 'Database Session Entry:' );
  global $session_model;
  $session = $session_model->Get( base64_decode( $_SESSION['session'] ) );
  plog( $session );
  plog( '---------' );
 }

 static function Logout( $sess=-1 ) {
  if ( $sess=== -1 ) {
  global $session_id;
  if ( is_null($session_id) ) return FALSE;
  $sid=$session_id;
  global $session_model,$session;
  $session = $session_model->Get( $sid );
  } else $session=$sess;
  if ( is_null( $session ) ) { return FALSE; } else {
   // Turn off the session's activity indicator
   if ( !$this->LoggedOut($session) )
    $this->Set($session['ID'], array( 'status'=>0, 'logout'=>strtotime('now') ) );
  }
 }

 private function check_cookie( $report=false ) {
   if ( $report === true ) plog( 'check_cookie(): ');
   // Check for the session variable or the appropriate cookie information.
   if ( !isset($_SESSION['username'])
     || is_null($_SESSION['username'])
     || strlen(trim($_SESSION['username'])) == 0 ) {
    $token    = base64_decode( $_COOKIE['session']  );
    $username = base64_decode( $_COOKIE['username'] );
   } else {
    $username = base64_decode( $_SESSION['username'] );
    $token    = base64_decode( $_SESSION['session']  );
   }

   if ( $report === true ) $this->print_debug_info();

   // Determine if the session should has expired this page load.
   global $expired;
   $expired = false;

   // This is an expired session.
   if ( strlen($token)==0 || strlen($username)==0 ) {
    $expired = true;
    return FALSE;
   }

   // Garner the valid session information.
   global $session_token;
   $session_token=$token;

   global $session;
   $session = $session_model->ByToken($token);
   plog('check_cookie: session='.var_export($session,true));

   // Invalid or expired session
   if ( false_or_null($session) || !is_array($session) ) {
    $expired = true;
    return FALSE;
   }

   // Test for inactivity timeout.
   if ( $this->TimedOut($session) ) {
    $this->Logout();
    $expired = true;
    return FALSE;
   }

   // Did we already log out?
   if ( $this->LoggedOut($session) ) {
    $expired = true;
    return FALSE;
   }

   $this->Refresh();

   global $auth_model;
   global $auth;
   $auth=$auth_model->Get( intval($session['r_Auth']) );

   // If we delete the user's Auth record, the session is terminated.
   if ( false_or_null($auth) ) {
    $this->Logout();
    $expired = true;
    return FALSE;
   }

   // Talk if we're debugging.
   if ( $report === true ) $this->print_debug_info();
   if ( $report === true ) plog( 'check_cookie(): (end)');
   return TRUE;
  }

/////// The following functions are for non-cookie authentication. (Headers)

/*
  static public function CreateNew() {
   if ( false_or_null($user) ) return NULL;
   global $auth,$auth_database,$session_id,$session,$session_token;
   $m=new Session($auth_database);
   $m->Delete(array("r_User"=>$auth['ID']));
   $new_id=$m->Insert(array(
    'r_User'        => $auth['ID'],
    'expiresAt'     => ($expiry=strtotime('now +30 minutes'))
   ));
   $session_token=md5(uniqid($new_id,true));
   $result=$m->Update(array(
    'session_token' => $session_token
   ), array("ID"=>$new_id));
   $session_id=$new_id;
   return $new_id;
  }
 */

  static public function Refresh( $REFRESH_COOKIES = TRUE )  {
   global $no_session_refresh;
   if ( $no_session_refresh === TRUE ) return TRUE;
   global $session_refreshed;
   if ( $session_refreshed === TRUE ) return TRUE;
   global $auth_database,$session,$session_token,$session_id,$session_refreshed;
   if ( false_or_null($session) ) return NULL;
   $m=new Session($auth_database);
   if ( strtotime('now') >= intval($session['expiresAt']) ) return FALSE;
   $m->Update(array('requests'=>intval($session['requests'])+1,'expiresAt'=>strtotime(SESSION_LENGTH)),array('ID'=>$session_id));
   if ( $REFRESH_COOKIES === TRUE ) {
    global $database;
    $u_model=new Auth($database);
    $u=$u_model->Get($session['r_Auth']);
    cook( "username", $u['username'], timeout );
    cook( "session",  $session['token'], timeout );
   }
   $session_refreshed = TRUE;
   return TRUE;
  }

  static public function LogoutByToken( $session_token ) {
   global $auth_database;
   $m=new Session($auth_database);
   $result=$m->First("session_token",$session_token);
   if ( false_or_null($result) ) return FALSE;
   $m->Delete(array("session_token"=>$session_token));
   return TRUE;
  }

  static public function IsValid( $token ) {
   global $session,$session_id;
   $session = Session::ByToken($token);
//   if ( false_or_null($session) ) { Session::ByToken(base64_decode($token)); }
   if ( false_or_null($session) ) {
    return FALSE;
   }
   if ( Session::TimedOut($session) ) return FALSE;
   $session_id = $session['ID'];
   Session::Refresh();
   return TRUE;
  }

 };

