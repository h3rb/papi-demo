<?php // Table: AppSettings
 class AppSettings extends Model {
  public function GetLatest() {
   $settings=$this->Select(' ORDER BY ID LIMIT 1 DESC');
   if ( false_or_null($settings) ) { // Defaults
    return array(
    );
   } else return deep_json_decode($settings['JSON']);
  }
  public function Save( $arr ) {
   return $this->Insert( array( 'JSON'=>deep_json_encode($arr) ) );
  }
 };
