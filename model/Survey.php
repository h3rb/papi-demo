<?php

 class Survey extends Model {
  public function ForUser( $u_id ) { return $this->Select(array("r_Auth"=>$u_id)); }
 };
