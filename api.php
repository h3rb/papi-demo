<?php
 global $plog_level; $plog_level=1;
 define('suppress_auth',1);

if ( !function_exists('startsWith') ) {
function startsWith($haystack, $needle){     $length = strlen($needle);     return (substr($haystack, 0, $length) === $needle);}
}
if ( !function_exists('is_ssl') ) {
function is_ssl() {
return true;
// uncomment the next line and comment out the line above to properly check for ssl, requires a cert
// if ( isset($_SERVER['HTTPS']) ) { if ( 'on' == strtolower($_SERVER['HTTPS']) ) return true; if ( '1' == $_SERVER['HTTPS'] ) return true; } elseif ( isset($_SERVER['SERVER_PORT']) && ( 443 == intval($_SERVER['SERVER_PORT']) ) ) return true; return false;
}
if ( !is_ssl() ) { // The following block is used to restrict access to the insecure version, and bump users to the secure one.
 if (  !startsWith($_SERVER["REMOTE_ADDR"],"127.")
    && !startsWith($_SERVER["REMOTE_ADDR"],"52.")
    && !startsWith($_SERVER["REMOTE_ADDR"],"172.") ) {
  echo 'Access denied to '.$_SERVER['REMOTE_ADDR']; die;
  header("Location: https://api.mydomain.com"); die;
 }
}
}

 include 'core/Page.php';

 global $headers,$session_id,$session,$session_token,$database,$auth,$user,$is_admin;

 $gp=getpost();

 if ( !isset($gp['data']) ) API::Failure("No data provided.",-69);

 $g = json_decode($gp["data"],true);

 // var_dump($g); die;

 API::Credentials($g);

 if ( false_or_null($session) ) API::Failure("Not logged in or no valid API credential.",-1);

 // var_dump($g); die;


 if ( !isset($g['action']) || false_or_null($g['action']) ) API::Failure("No action provided.",-2);

 $action = API::GetValue($g,'action',-3);
 if ( $action == 'list' ) { // returns a list of objects of a particular type
  $value=API::GetValue($g,'subject',-3);
 } else if ( $action == 'create' ) { // attempts to create an object
  $value=API::GetValue($g,'subject',-3);
  API::Create($g,$value);
 } else if ( $action == 'remove' ) { // attempts to delete an object
  $subject=API::GetValue($g,'subject',-3);
  $id=API::GetValue($g,'id',-4);
  API::Remove($g,$subject,$id);
 } else if ( $action == 'modify' ) { // attempts to modify an object
  $subject=API::GetValue($g,'subject',-3);
  $id=API::GetValue($g,'id',-4);
  API::Modify($g,$subject,$id);
 } else if ( $action == 'update' ) { // attempts to update a test session
  $id=API::GetValue($g,'id',-3);
  API::Update($g,$id);
 } else if ( $action == 'profile' ) {
  $id=API::GetValue($g,'id',-3);
  API::Profile($g,$id);
 }

 API::Failure("Unknown request or badly formed request.",-99);
