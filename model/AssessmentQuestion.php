<?php

abstract class AssessmentQuestionType extends Enum {
 const MultipleChoice=1;
 const TrueFalse=2;
 const Essay=3;
 static function name($n) {
  switch(intval($n)) {
   case AssessmentQuestionType::MultipleChoice: return '1';
   case AssessmentQuestionType::TrueFalse: return '2';
   case AssessmentQuestionType::Essay: return '3';
   default: return 'Unknown'; break;
  }
 }
}

 class AssessmentQuestion extends Model {
  public function ForAssessment( $a_id ) { return $this->Select(array("r_Assessment",$a_id)); }
  static function JSONMap() {
   return array(
    "url" => array( "URLContent", 'string' ),
    "text" => array( "Text", 'string' ),
    "pjs" => array( "Pjs", 'string' ),
    "imageurl" => array( "ImageURL", 'string' ),
    "videourl" => array( "VideoURL", 'string' ),
    "parent" => array( "r_Assessment", 'reference' ),
    "skippable" => array( "Skippable", 'bool' ),
    "timed" => array( "LimitTime", 'bool' ),
    "limitanswers" => array( "LimitAnswers", 'bool' ),
    "seconds" => array( "Seconds", 'integer' ),
    "type" => array( "Type", 'AssessmentQuestionType' ),
    "reorder" => array( "RandomizeAnswerOrder", 'bool' ),
    "owner" => array( "Owner", 'user' )
   );
  }
  static function ValuesArray() {
   global $auth;
   return array(
    "URLContent" => "",
    "ImageURL" => "",
    "Text" => "",
    "Skippable" => 0,
    "Type" => AssessmentQuestionType::MultipleChoice,
    "Pjs" => "",
    "VideoURL" => "",
    "ImageURL" => "",
    "r_Assessment" => 0,
    "RandomizeAnswerOrder" => 1,
    "LimitAnswers" => 0,
    "LimitTime" => 0,
    "Seconds" => 60,
    "Owner" => $auth['ID']
   );
  }
  static function Make( $vars ) {
   global $database;
   $m = new AssessmentQuestion($database);
   if ( isset($vars['for']) ) {
    $for=intval($vars['for']);
    if ( !API::OwnerOf("Assessment",$for,$existing) ) API::Failure("Not owner of that Assessment.", ERR_NOT_OWNER);
   } else API::Failure("No Assessment ID provided.", ERR_MISSING_ID);
   $values=API::MapValues( "AssessmentQuestion", $vars['data'], AssessmentQuestion::JSONMap(), AssessmentQuestion::ValuesArray() );
   $values['r_Assessment']=$for;
   $id=$m->Insert($values);
   if ( false_or_null($id) || intval($id) === 0 ) API::Failure("Unable to create Question.",ERR_UNABLE_TO_CREATE);
   API::Success("Question created.", array("id"=>$id));
  }
  static function MakeWithAnswers( $vars ) {
   global $database;
   $m = new AssessmentQuestion($database);
   if ( isset($vars['for']) ) {
    $for=intval($vars['for']);
    if ( !API::OwnerOf("Assessment",$for,$existing) ) API::Failure("Not owner of that Assessment.", ERR_NOT_OWNER);
   } else API::Failure("No Assessment ID provided.", ERR_MISSING_ID);
   unset($vars['data']['member']);
   $answers=$vars['data']['answers'];
   unset($vars['data']['answers']);
   $values=API::MapValues( "AssessmentQuestion", $vars['data'], AssessmentQuestion::JSONMap(), AssessmentQuestion::ValuesArray() );
   $values['r_Assessment']=$for;
   $m->Insert($values);
   $question=$m->Latest($values);
   $qa=array();
   if ( false_or_null($question) ) API::Failure("Unable to create Question.",ERR_UNABLE_TO_CREATE);
   if ( intval($question['Type']) !== AssessmentQuestionType::Essay ) {
    $ma=new AssessmentAnswer($database);
    foreach ( $answers as $answer ) {
     $values=API::MapValues( "AssessmentAnswer", $answer, AssessmentAnswer::JSONMap(), AssessmentAnswer::ValuesArray() );
     $values['r_AssessmentQuestion']=$question['ID'];
     $ma->Insert($values);
     $a=$ma->Latest($values);
     if ( false_or_null($a) ) API::Failure("Unable to create Answer.",ERR_UNABLE_TO_CREATE);
     $qa[]=$a;
    }
   }
   $question = API::UnmapValues( $question, AssessmentQuestion::JSONMap() );
   $question["answers"]=API::UnmapValues( $qa, AssessmentAnswer::JSONMap() );
   API::Success("Question created.", $question);
  }
  static function Modify( $vars ) {
   global $database;
   $m = new AssessmentQuestion($database);
   if ( isset($vars['for']) ) {
    if ( API::OwnerOf("AssessmentQuestion",$vars['for'],$existing) ) $id=$vars['for'];
    else API::Failure("Not owner of that Assessment Question.", ERR_NOT_OWNER);
   } else API::Failure("No Assessment Question ID provided.", ERR_MISSING_ID);
   $values=API::MapValues( "AssessmentQuestion", $vars['data'], AssessmentQuestion::JSONMap(), $existing );
   $m->Set($id,$values);
   API::Success("Question modified.", array("id"=>$id));
  }

  static function Retrieve( $id ) {
   global $database;
   $m = new AssessmentQuestion($database);
   $ma= new AssessmentAnswer($database);
   $o = $m->Get($id);
   if ( API::IsOwner($o) ) {
    $answers = $ma->Select(array("r_AssessmentQuestion"=>$o['ID']));
    foreach ( $answers as $answer ) {
     $values=API::MapValues( "AssessmentAnswer", $answer, AssessmentAnswer::JSONMap(), AssessmentAnswer::ValuesArray() );
     $values['r_AssessmentQuestion']=$o['ID'];
     $ma->Insert($values);
     $a=$ma->Latest($values);
     if ( false_or_null($a) ) API::Failure("Unable to create Answer.",ERR_UNABLE_TO_CREATE);
     $qa[]=$a;
    }
    $o=API::UnmapValues( $o, AssessmentQuestion::JSONMap() );
    $o = API::UnmapValues( $o, AssessmentQuestion::JSONMap() );
    $o["answers"]=API::UnmapValuesSet( $qa, AssessmentAnswer::JSONMap() );
    API::Success("Question retrieved.",$o);
   } else API::Failure("Not owner.",ERR_NOT_OWNER);
  }
 };
