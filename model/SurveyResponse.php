<?php

 class SurveyResponse extends Model {
  public function ForUser( $u_id ) { return $this->Select(array("r_Auth",$u_id)); }
 };
