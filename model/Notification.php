<?php
 /*
 CREATE TABLE `Notification` (
  `ID` int(10) unsigned NOT NULL,
  `Content` text NOT NULL,
  `Created` int(10) unsigned NOT NULL,
  `Owner` int(10) unsigned NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
  */
 class Notification extends Model {
  static function JSONMap() {
   return array(
    "content" => array( "Content", 'string' ),
    "created" => array( "Created", 'timestamp' ),
    "owner"=> array( "Owner", 'integer' ),
   );
  }
  static function ValuesArray() {
   global $auth;
   return array(
   "Content" => "New Notification",
   "Created" => time(),
   "Owner" => $auth['ID'],
   );
  }
 };
