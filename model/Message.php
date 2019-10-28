<?php
/*
CREATE TABLE `Message` (
  `ID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `Subject` text NOT NULL,
  `Content` text NOT NULL,
  `FromUser` int(10) unsigned NOT NULL,
  `Owner` int(10) unsigned NOT NULL,
  `Created` int(10) unsigned NOT NULL,
  `Read` int(10) unsigned NOT NULL COMMENT '0=unread\n1=read',
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
 */
 class Message extends Model {
  static function JSONMap() {
   return array(
    "subject" => array( "Subject", 'string' ),
    "content" => array( "Content", 'string' ),
    "created" => array( "Created", 'timestamp' ),
    "from"=> array( "FromUser", 'integer' ),
    "owner"=> array( "Owner", 'integer' ),
    "read"=> array( "Read", 'integer' ),
   );
  }
  static function ValuesArray() {
   global $auth;
   return array(
   "Subject" => "New Message",
   "Content" => "Message content...",
   "Created" => time(),
   "FromUser" => $auth['ID'],
   "Owner" => $auth['ID'],
   "Read" => 0
   );
  }
 };
