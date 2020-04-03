<?php

 global $plog_level; $plog_level=1;
 include 'core/Page.php';

 $g=getpost();

// var_dump($g); die;

 if ( !isset($g['newusername']) || false_or_null($g['newusername']) ) { echo deep_json_encode(array("result"=>"failed","reason"=>"Invalid username.")); die; }

 $len=strlen($un=trim($g['newusername']));

 if ( $len == 0 || $len < 3 ) { echo deep_json_encode(array("result"=>"failed","reason"=>"Username too short.")); die; }

 global $auth_model;
 $results=$auth_model->Select(array('username'=>$un));

 if ( is_array($results) && count($results)!==0 ) { echo deep_json_encode(array("result"=>"failed","reason"=>"Username already taken.")); die; }

 if ( !isset($g['email']) || false_or_null($g['email']) ) { echo deep_json_encode(array("result"=>"failed","reason"=>"Email not provided.")); die; }

 $len=strlen($em=trim($g['email']));

 if ( $len < 6 ) { echo deep_json_encode(array("result"=>"failed","reason"=>"Invalid email.")); die; }

 if (!filter_var($em, FILTER_VALIDATE_EMAIL) === false) { /* valid */ } else { echo deep_json_encode(array("result"=>"failed","reason"=>"Email provided is not a valid email address")); die; }

 $results=$auth_model->Select(array('email'=>$em));

 if ( is_array($results) && count($results)!==0 ) { echo deep_json_encode(array("result"=>"failed","reason"=>"Email already in use. <a href='/forgot?email=".urlencode($em)."'>Forgot username?</a>")); die; }

 $pw=($g["newpassword"]);


 {
 include 'modules/zxcvbn-php/src/Matchers/MatchInterface.php';
 include 'modules/zxcvbn-php/src/Matchers/Match.php';
 include 'modules/zxcvbn-php/src/Matcher.php';
 include 'modules/zxcvbn-php/src/ScorerInterface.php';
 include 'modules/zxcvbn-php/src/Scorer.php';
 include 'modules/zxcvbn-php/src/Searcher.php';
 include 'modules/zxcvbn-php/src/Matchers/Bruteforce.php';
 include 'modules/zxcvbn-php/src/Matchers/DateMatch.php';
 include 'modules/zxcvbn-php/src/Matchers/DictionaryMatch.php';
 include 'modules/zxcvbn-php/src/Matchers/DigitMatch.php';
 include 'modules/zxcvbn-php/src/Matchers/L33tMatch.php';
 include 'modules/zxcvbn-php/src/Matchers/RepeatMatch.php';
 include 'modules/zxcvbn-php/src/Matchers/SequenceMatch.php';
 include 'modules/zxcvbn-php/src/Matchers/SpatialMatch.php';
 include 'modules/zxcvbn-php/src/Matchers/YearMatch.php';
 include 'modules/zxcvbn-php/src/Zxcvbn.php';

 $z=new Zxcvbn();
 $strength = $z->passwordStrength($pw);
// if ( $strength['score'] <= 2 ) { echo deep_json_encode(array("result"=>"failed","reason"=>"Please provide a stronger password.")); die; }
 }

 plog("!!!!ajax.register new user!!!!");

 $new_id=$auth_model->Insert(array(
  "username"=>$un,
  "password"=>ourcrypt($pw),
  "email"=>$em,
  "password_expiry"=>strtotime("+1 years"),
  "FacebookID"=>"",
  "birthdate"=>0,
  "acl"=>0,
  "flags"=>0,
  "securityq1"=>"",
  "securitya1"=>"",
  "securityq2"=>"",
  "securitya2"=>"",
  "securityq3"=>"",
  "securitya3"=>"",
  "EmailVerified"=>0,
  "Recurly"=>0,
  "AccountType"=>1,
  "first_name"=>"",
  "last_name"=>"",
  "flags_copy1"=>0,
  "Title"=>"",
  "Website"=>"",
  "Avatar"=>0,
  "Twitter"=>"",
  "Newsletter"=>0,
  "RegistrationSurvey"=>deep_json_encode(array(
   "m"=>$g["message"],
   "s"=>$g["student"],
   "t"=>$g["teacher"],
   "o"=>$g["organization"]
  ))
 ));

 plog("new_auth_id: ".$new_id);

 global $session_model, $auth;
 $auth=$auth_model->Get($new_id);

 if ( !isset($auth['ID']) || is_null($auth) || !is_array($auth) ) { echo deep_json_encode(array("result"=>"failed","reason"=>"Unable to create account")); die; }

 plog("NEW ACCOUNT SIGNUP");

 // send email

 plog('$getpost: '.vars($g));
 plog('$auth: '.vars($auth));

 $session_model->Create($auth['ID']);

 echo deep_json_encode(array("result"=>"success"));
