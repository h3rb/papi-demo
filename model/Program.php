<?php

 class Program extends Model {
  public function ForUser( $user_id ) { return $this->Select(array("r_Auth"=>$user_id)); }
 };
