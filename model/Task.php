<?php
 /*
CREATE TABLE `Task` (
  `ID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `Content` text NOT NULL,
  `Created` int(10) unsigned NOT NULL,
  `Owner` int(10) unsigned NOT NULL,
  `Completion` int(10) unsigned NOT NULL COMMENT '0=to-do\n1=done',
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
  */
 class Task extends Model {
  static function JSONMap() {
   return array(
    "content" => array( "Content", 'string' ),
    "created" => array( "Created", 'timestamp' ),
    "owner"=> array( "Owner", 'integer' ),
    "done"=> array( "Completion", 'integer' ),
   );
  }
  static function ValuesArray() {
   global $auth;
   return array(
   "Content" => "New Task",
   "Created" => time(),
   "Owner" => $auth['ID'],
   "Completion" => 0
   );
  }
 };
