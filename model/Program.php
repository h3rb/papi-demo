<?php


abstract class ProgramMode extends Enum {
 const Each=1;
 const All=2;
 static function name($n) {
  switch(intval($n)) {
   case ProgramMode::Each: return '1';
   case ProgramMode::All: return '2';
   default: return 'Unknown'; break;
  }
 }
}

 class Program extends Model {
  public function ForUser( $user_id ) { return $this->Select(array("Owner"=>$user_id)); }
  
  static function JSONMap() {
   return array(
    "name" => array( "Name", 'string' ),
    "desc" => array( "Description", 'string' ),
    "logo" => array( "Logo", 'integer' ),
    "published" => array( "Published", 'bool' ),
    "selfregistration" => array( "SelfRegistration", 'bool' ),
    "mode" => array( "ProgramMode", 'ProgramMode' ),
    "cost" => array( "Free", 'decimal' ),
    "created" => array( "Created", 'timestamp' ),
    "owner" => array( "Owner", 'integer' ),
    "invite" => array( "InviteOnly", 'bool' ),
    "premium" => array( "PaymentRequired", 'bool' ),
    "autoenroll" => array( "AutoEnroll", 'bool' ),
    "days" => array("Days", 'integer' ),
    "crowdgrading" => array("CrowdGrading", 'integer'),
    "intro" => array("Introduction", "string")
   );
  }
  static function ValuesArray() {
   global $auth;
   return array(
   "Name" => "New Testing Program",
   "Logo" => 0,
   "Published" => 0,
   "SelfRegistration" => 1,
   "ProgramMode" => ProgramMode::All,
   "Free" => 0.00,
   "Created" => time(),
   "Owner" => $auth['ID'],
   "InviteOnly" => 0,
   "PaymentRequired" => 0,
   "AutoEnroll" => 1,
   "Description" => "",
   "Days" => 0,
   "Introduction"=>"Welcome to the course!",
   "CrowdGrading" => 0
   );
  }
  static function Make( $vars ) {
   global $database;
   $m = new Program($database);
   $values=API::MapValues( "Program", $vars['data'], Program::JSONMap(), Program::ValuesArray() );
   $id=$m->Insert($values);
   if ( false_or_null($id) || $id === 0 ) API::Failure("Unable to create program.",ERR_UNABLE_TO_CREATE);
   API::Success("Program created.", array("id"=>$id));
  }
  static function Modify( $vars ) {
   global $database;
   $m = new Program($database);
   if ( isset($vars['for']) ) {
    if ( API::OwnerOf("Program",$vars['for'],$existing) ) $id=$vars['for'];
    else API::Failure("Not owner of Program.", ERR_NOT_OWNER);
   } else API::Failure("No Program ID provided.",ERR_MISSING_ID);
   $values=API::MapValues( "Program", $vars['data'], Program::JSONMap(), $existing );
   API::UserNotOwner("Program",$values);
   API::UserNotOwner("Program",$values);
   $m->Set($id,$values);
   API::Success("Program modified.", array("id"=>$id));
  }
  static function Retrieve( $id ) {
   global $database;
   $m = new Program($database);
   $o = $m->Get($id);
   if ( API::IsOwner($o) ) API::Success(API::UnmapValues( $o, Program::JSONMap() ));
  }
  static function List( $vars ) {
	  global $auth,$database;
	  $m = new Program($database);
	  $results=array();
	  if ( isset($vars['test']) ) {
		  if ( API::OwnerOf("Assessment",$vars['test'],$existing) ) $results= array( $m->Get($existing['r_Program']) );
	  } else if ( isset($vars['q']) ) {
		  if ( API::OwnerOf("AssessmentQuestion",$vars['q'],$existing) ) {
			  $n = new Assessment($database);
			  $t = $n->Get($existing['r_Assessment']);
			  if ( !false_or_null($t) ) $results=array( $t->Get($existing['r_Program']) );
			  else API::Failure("Could not find assessment.", ERR_NOT_FOUND);
		  } else API::Failure("Not owner.",ERR_NOT_OWNER);
	  } else if ( isset($vars['a']) ) {
		  if ( API::OwnerOf("AssessmentAnswer",$vars['a'],$existing) ) {
			  $n = new Assessment($database);
			  $results= $n->Get($existing['r_Assessment']);
			  $t = $n->Get($existing['r_Assessment']);
			  if ( !false_or_null($t) ) $results=array( $t->Get($existing['r_Program']) );
			  else API::Failure("Could not find assessment.", ERR_NOT_FOUND);			  
		  } else API::Failure("Not owner.",ERR_NOT_OWNER);
	  } else if ( isset($vars['search']) ) {
	  } else {
		  $results =  $m->Select(array("Owner"=>$auth['ID']));
	  }
	  if ( isset($vars['everything']) ) {
		  if ( is_array($results) ) foreach ( $results as &$pgm ) {
			  $pgm = API::UnmapValues($pgm,Program::JSONMap());
			  $n = new Assessment($database);
			  $pgm["tests"] = $n->Select(array("r_Program"=>$pgm['id']));
			  if ( is_array($pgm["tests"]) ) foreach ( $pgm["tests"] as &$test ) {
				  $test = API::UnmapValues($test,Assessment::JSONMap());
				  $o = new AssessmentQuestion($database);
				  $test["questions"] = $n->Select(array("r_Assessment",$test['id']));
				  if ( is_array($test["questions"]) ) {
					  foreach ( $test["questions"] as &$q ) {
						$o = new AssessmentAnswer($database);
						$q = API::UnmapValues($q,AssessmentQuestion::JSONMap());
						$q["answers"] = $n->Select(array("r_AssessmentQuestion",$q['id']));
						foreach ( $q["answers"] as &$a ) $a=API::UnmapValues($a,AssessmentQuestion::JSONMap());
					  }
				  }
			  } else $pgm["tests"] = array();
		  }
	  }
	  API::Success("Programs retrieved.",array("result"=>$results));
  }
 };
