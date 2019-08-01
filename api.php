<?php

 global $plog_level; $plog_level=1;
 define('suppress_auth',1);
 include 'core/Page.php';

 $g=getpost();

 $key=API::Credentials($g);
 if ( $key === FALSE ) API::Failure("Not logged in or no valid API credential.",-1);

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
