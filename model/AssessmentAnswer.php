<?php

 class AssessmentAnswer extends Model {
  public function ForQuestion( $q_id ) { return $this->Select(array("r_AssessmentQuestion",$q_id)); }
  static function JSONMap() {
   return array(
    "text" => array( "Content", 'string' ),
    "correct" => array( "Correct", 'bool' ),
    "imageurl" => array( "ImageURL", 'string' ),
    "videourl" => array( "VideoURL", 'string' ),
    "parent" => array( "r_AssessmentQuestion", 'reference' ),
    "owner" => array( "Owner", 'user' )
   );
  }
  static function ValuesArray() {
   global $auth;
   return array(
    "Content" => "",
    "Correct" => 0,
    "ImageURL" => "",
    "VideoURL" => "",
    "r_AssessmentQuestion" => 0,
    "Owner" => $auth['ID']
   );
  }
  static function Make( $vars ) {
   global $database;
   $m = new AssessmentAnswer($database);
   if ( isset($vars['for']) ) {
    $for=intval($vars['for']);
    if ( !API::OwnerOf("AssessmentQuestion",$for,$existing) ) API::Failure("Not owner of that Assessment Question.", -10);
   } else API::Failure("No Assessment Question ID provided.", -9);
   $values=API::MapValues( "AssessmentAnswer", $vars['data'], AssessmentAnswer::JSONMap(), AssessmentAnswer::ValuesArray() );
   $values['r_AssessmentQuestion']=$for;
   API::UserNotOwner("AssessmentAnswer",$values);
   $id=$m->Insert($values);
   if ( false_or_null($id) || intval($id) === 0 ) API::Failure("Unable to create Answer.",-99);
   API::Success("Answer created.", array("id"=>$id));
  }
  static function Modify( $vars ) {
   global $database;
   $m = new AssessmentAnswer($database);
   if ( isset($vars['for']) ) {
    if ( API::OwnerOf("AssessmentAnswer",$vars['for'],$existing) ) $id=$vars['for'];
    else API::Failure("Not owner of that Assessment Answer.", -10);
   } else API::Failure("No Assessment Answer ID provided.", -9);
   $values=API::MapValues( "AssessmentAnswer", $vars['data'], AssessmentAnswer::JSONMap(), $existing );
   API::UserNotOwner("AssessmentAnswer",$values);
   $m->Set($id,$values);
   API::Success("Answer modified.", array("id"=>$id));
  }
 };
