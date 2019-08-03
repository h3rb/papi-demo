<?php
global $plog_level; $plog_level=1;
include 'core/Page.php';
plog('File: '.__FILE__);
global $session_model, $auth_model, $auth;
$g=getpost();
if ( !(isset($g['username']) && isset($g['password'])) ) Page::Redirect("login?m=1");
$auth=$auth_model->byUsername($g['username']);
plog('$getpost: '.vars($g));
plog('$auth: '.vars($auth));
if ( !is_array($auth) ) Page::Redirect("login?m=2");
if ( strlen(trim($auth['password'])) === 0 // Empty password..
  || matchcrypt($g['password'],$auth['password']) ) {
 plog('Password matched!  User has authenticated.');
 if ( Auth::ACL('locked') ) {
  plog('Account is locked, logging user '.$auth['ID'].' off.');
  $session_model->Logout();
  Page::Redirect("login?m=4"); die;
 }
 $session_model->CreateNew($auth['ID'],TRUE);
 Page::Redirect("dash");
} else {
 plog( "Password incorrect." );
 Page::Redirect("login?m=1");
}
