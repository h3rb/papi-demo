<?php


abstract class AssessmentPassMode extends Enum {
 const Minimum=1;
 const Percentage=2;
 const All=3;
 static function name($n) {
  switch(intval($n)) {
   case AssessmentPassMode::Minimum: return '1';
   case AssessmentPassMode::Percentage: return '2';
   case AssessmentPassMode::All: return '3';
   default: return 'Unknown'; break;
  }
 }
}

 class Assessment extends Model {
  public function ForProgram( $program_id ) {
   return $this->Select(array("r_Program",$program_id));
  }
  static function JSONMap() {
   return array(
    "name" => array( "Name", 'string' ),
    "desc" => array( "Description", 'string' ),
    "parent" => array( "r_Assessment", 'reference' ),
    "timed" => array( "Timed", 'bool' ),
    "limit" => array( "TimeLimit", 'integer' ),
    "mode" => array( "Passmode", 'AssessmentPassMode' ),
    "minimum" => array( "PassMinimum", 'integer' ),
    "percentage" => array( "PassPercentage", 'decimal' ),
    "pooled" => array( "QuestionsFromPool", 'bool' ),
    "reorder" => array( "RandomizeOrder", 'bool' ),
    "private" => array( "Private", 'bool' ),
    "private_badges" => array( "PrivateBadges", 'bool' ),
    "badge" => array( "Badge", 'integer' ),
    "owner" => array( "Owner", 'user' )
   );
  }
  static function ValuesArray() {
   global $auth;
   return array(
   "Name" => "New Test",
   "Description" => "A great assessment deserves an accurate and informative description.",
   "r_Assessment" => 0,
   "r_Program" => 0,
   "Timed" => 0,
   "TimeLimit" => 0,
   "PassMode" => 0,
   "PassMinimum" => 1,
   "PassPercentage" => 100,
   "QuestionsFromPool" => 0,
   "RandomizeOrder" => 0,
   "Private" => 1,
   "PrivateBadges" => 1,
   "Badge" => 0,
   "Owner" => $auth['ID']
   );
  }
  static function Make( $vars ) {
   global $database;
   $m = new Assessment($database);
   $values=API::MapValues( "Assessment", $vars['data'], Assessment::JSONMap(), Assessment::ValuesArray() );
   if ( isset($vars['for']) ) {
    if ( API::OwnerOf("Program",$vars['for']) ) $values['r_Program']=$vars['for'];
    else API::Failure("Not owner of that Program.", -10);
   }
   API::UserNotOwner("Assessment",$values);
   $id=$m->Create($values);
   API::Success("Assessment created.", array("id"=>$id));
  }
  static function Modify( $vars ) {
   global $database;
   $m = new Assessment($database);
   $values=API::MapValues( "Assessment", $vars['data'], Assessment::JSONMap(), Assessment::ValuesArray() );
   API::UserNotOwner("Assessment",$values);
   if ( isset($vars['for']) ) {
    if ( API::OwnerOf("Assessment",$vars['for']) ) $id=$vars['for'];
    else API::Failure("Not owner of Assessment.", -10);
   } else API::Failure("No Assessment ID provided.", -9);
   API::UserNotOwner("Assessment",$values);
   $m->Set($id,$values);
   API::Success("Assessment modified.", array("id"=>$id));
  }
 };
