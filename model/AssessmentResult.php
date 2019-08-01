<?php

 class AssessmentResult extends Model {
  public function ForUser( $u_id ) { return $this->Select(array("r_Auth"=>$a_id)); }
  public function ForAssessment( $a_id ) { return $this->Select(array("r_Assessment"=>$a_id)); }
 };
