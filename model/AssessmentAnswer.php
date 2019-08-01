<?php

 class AssessmentAnswer extends Model {
  public function ForQuestion( $q_id ) { return $this->Select(array("r_AssessmentQuestion",$q_id)); }
  static function JSONMap() {
   return array(
    "name" => array( "Name", 'string' ),
    "desc" => array( "Description", 'string' ),
    "parent" => array( "r_Assessment", 'integer' ),
    "timed" => array( "Timed", 'bool' ),
    "limit" => array( "TimeLimit", 'integer' ),
    "mode" => array( "Passmode", 'AsssessmentPassMode' ),
    "minimum" => array( "PassMinimum", 'integer' ),
    "percentage" => array( "PassPercentage", 'decimal' ),
    "pooled" => array( "QuestionsFromPool", 'bool' ),
    "randomize" => array( "RandomizeOrder", 'bool' ),
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
   $values=API::MapValues( "Assessment", $vars['data'], Asssessment::JSONMap(), Assessment::ValuesArray() );
   if ( isset($vars['for']) && API::OwnerOf("Program",$vars['for']) ) {
    $values['r_Program']=$vars['for'];
   }
   $id=$m->Create($values);
   API::Success("Assessment created.", array("id"=>$id));
  }
  static function Modify( $vars ) {
   global $database;
   $m = new Assessment($database);
   $values=API::MapValues( "Assessment", $vars['data'], Asssessment::JSONMap(), Assessment::ValuesArray() );
   if ( isset($vars['for']) ) {
    if ( API::OwnerOf("Assessment",$vars['for']) ) $id=$vars['for'];
    else API::Failure("Not owner of Assessment.", -10);
   } else API::Failure("No Assessment ID provided.", -9);
   API::Success("Assessment modified.", array("id"=>$id));
  }
 };
