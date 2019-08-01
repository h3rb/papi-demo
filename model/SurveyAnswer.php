<?php

 class SurveyAnswer extends Model {
  public function ForQuestion( $q_id ) { return $this->Select(array("r_Question",$q_id)); }
 };
