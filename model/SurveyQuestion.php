<?php

 class SurveyQuestion extends Model {
  public function ForProgram( $program_id ) { return $this->Select(array("r_Program",$program_id)); }
 };
