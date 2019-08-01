<?php

 class AssessmentQuestionGripe extends Model {
  public function ForAssessment( $a_id ) { return $this->Select(array("r_Assessment",$a_id)); }
  public function ForAssessmentQuestion( $aq_id ) { return $this->Select(array("r_AssessmentQuestion",$aq_id)); }
 };
