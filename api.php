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

 if ( !isset($gp['data']) ) API::Failure("No data provided.",ERR_NO_DATA);

 $g = json_decode($gp["data"],true);

 // var_dump($g); die;

 API::Credentials($g);

 if ( isset($gp['data']) && isset($gp['data']['key']) ) API::ValidateToken($gp['data']);
 if ( false_or_null($session) ) {
  if ( isset($gp['data']) && isset($gp['data']['login']) ) API::Credentials($gp);
  else
  API::Failure("Not logged in or no valid API credential. ".str_replace("\n","",print_r($gp,true)),ERR_INVALID_CREDENTIALS);
 }

 // var_dump($g); die;

 if ( isset($g['data']) && isset($g['data']['action']) ) $g=$g['data'];

 if ( !isset($g['action']) || false_or_null($g['action']) ) API::Failure("No action provided. ".str_replace("\n","",print_r($gp,true)),ERR_NO_ACTION);

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
  $id=API::GetValue($g,'for',-4);
  API::Modify($g,$subject,$id);
 } else if ( $action == 'proctor' ) { // attempts to update a test session
  $id=API::GetValue($g,'for',-4);
  API::Update($g,$id);
 } else if ( $action == 'profile' ) { // gets a profile user or oneself
  API::Profile($g);
 } else if ( $action == 'get' ) { // gets a single object
  $subject=API::GetValue($g,'subject',-3);
  $id=API::GetValue($g,'for',-4);
  API::Retrieve($g,$subject,$id);
 } else if ( $action == 'datetime' ) {
  API::GetDateTime();
 } else if ( $action == 'gravatar' ) {
  API::GravatarSupport($g);
 } else if ( $action == 'identify' ) {
  API::GetIdentify();
 }

 API::Failure("Unknown request or badly formed request.",ERR_UNKNOWN_REQUEST);
