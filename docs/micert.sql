CREATE DATABASE micert;

USE micert;

-- MySQL dump 10.13  Distrib 5.7.9, for Win64 (x86_64)
--
-- Host: certspring-test.cqnjgzurcgos.us-west-2.rds.amazonaws.com    Database: demo
-- ------------------------------------------------------
-- Server version	5.6.27-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `Answer`
--

DROP TABLE IF EXISTS `Answer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Answer` (
  `ID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `Content` text NOT NULL,
  `r_FileImage` int(10) unsigned NOT NULL,
  `r_Slideshow` int(10) unsigned NOT NULL,
  `Type` int(10) unsigned NOT NULL,
  `Correct` int(10) unsigned NOT NULL,
  `r_Question` int(10) unsigned NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Answer`
--

LOCK TABLES `Answer` WRITE;
/*!40000 ALTER TABLE `Answer` DISABLE KEYS */;
INSERT INTO `Answer` VALUES (18,'Pilsner',0,0,0,0,14),(19,'Lager',0,0,0,0,14),(20,'IPA',0,0,0,0,14),(21,'Stout',0,0,0,0,14),(22,'A cup of coffee',0,0,0,0,16),(23,'A fine wine',0,0,0,0,16),(24,'A heady pint',0,0,0,0,16),(25,'A cup of tea',0,0,0,0,16),(26,'A bowl of broth',0,0,0,0,16),(27,'I like beer',10090,0,0,0,13);
/*!40000 ALTER TABLE `Answer` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `AppSettings`
--

DROP TABLE IF EXISTS `AppSettings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `AppSettings` (
  `ID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `JSON` longtext NOT NULL COMMENT 'JSON array of the settings',
  `Created` int(10) unsigned NOT NULL COMMENT 'When it was created',
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COMMENT='History of the web application settings and its current (largest ID)';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `AppSettings`
--

LOCK TABLES `AppSettings` WRITE;
/*!40000 ALTER TABLE `AppSettings` DISABLE KEYS */;
/*!40000 ALTER TABLE `AppSettings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Assessment`
--

DROP TABLE IF EXISTS `Assessment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Assessment` (
  `ID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `Name` text NOT NULL,
  `Description` text NOT NULL,
  `r_Assessment` int(10) unsigned NOT NULL,
  `r_Program` int(10) unsigned NOT NULL,
  `Timed` int(10) unsigned NOT NULL,
  `TimeLimit` int(10) unsigned NOT NULL,
  `PassMode` int(10) unsigned NOT NULL,
  `PassMinimum` int(10) unsigned NOT NULL,
  `PassPercentage` int(10) unsigned NOT NULL,
  `QuestionsFromPool` int(10) unsigned NOT NULL COMMENT '0 = all questions available\n',
  `RandomizeOrder` int(10) unsigned NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Assessment`
--

LOCK TABLES `Assessment` WRITE;
/*!40000 ALTER TABLE `Assessment` DISABLE KEYS */;
/*!40000 ALTER TABLE `Assessment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `AssessmentAnswer`
--

DROP TABLE IF EXISTS `AssessmentAnswer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `AssessmentAnswer` (
  `ID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `Content` text NOT NULL,
  `Correct` int(10) unsigned NOT NULL,
  `Image` text NOT NULL,
  `VideoURL` text NOT NULL,
  `r_AssessmentQuestion` int(10) unsigned NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `AssessmentAnswer`
--

LOCK TABLES `AssessmentAnswer` WRITE;
/*!40000 ALTER TABLE `AssessmentAnswer` DISABLE KEYS */;
/*!40000 ALTER TABLE `AssessmentAnswer` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `AssessmentQuestion`
--

DROP TABLE IF EXISTS `AssessmentQuestion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `AssessmentQuestion` (
  `ID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `URLContent` text NOT NULL,
  `Image` text NOT NULL,
  `Text` text NOT NULL,
  `Skippable` int(10) unsigned NOT NULL,
  `Type` int(10) unsigned NOT NULL,
  `Pjs` text NOT NULL,
  `VideoURL` text NOT NULL,
  `ImageURL` text NOT NULL,
  `r_Assessment` int(10) unsigned NOT NULL,
  `RandomizeAnswerOrder` int(10) unsigned NOT NULL,
  `LimitAnswers` int(10) unsigned NOT NULL,
  `LimitTime` int(10) unsigned NOT NULL,
  `Seconds` int(10) unsigned NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `AssessmentQuestion`
--

LOCK TABLES `AssessmentQuestion` WRITE;
/*!40000 ALTER TABLE `AssessmentQuestion` DISABLE KEYS */;
/*!40000 ALTER TABLE `AssessmentQuestion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `AssessmentQuestionGripe`
--

DROP TABLE IF EXISTS `AssessmentQuestionGripe`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `AssessmentQuestionGripe` (
  `ID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `Griped` int(10) unsigned NOT NULL COMMENT 'User who griped',
  `r_AssessmentQuestion` int(10) unsigned NOT NULL,
  `r_Assessment` int(10) unsigned NOT NULL,
  `QuestionSnapshot` text NOT NULL,
  `Created` int(10) unsigned NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `AssessmentQuestionGripe`
--

LOCK TABLES `AssessmentQuestionGripe` WRITE;
/*!40000 ALTER TABLE `AssessmentQuestionGripe` DISABLE KEYS */;
/*!40000 ALTER TABLE `AssessmentQuestionGripe` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `AssessmentResult`
--

DROP TABLE IF EXISTS `AssessmentResult`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `AssessmentResult` (
  `ID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `Result` text NOT NULL COMMENT 'JSON',
  `r_Auth` int(10) unsigned NOT NULL,
  `Created` int(10) unsigned NOT NULL,
  `EmailRecipient` text NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `AssessmentResult`
--

LOCK TABLES `AssessmentResult` WRITE;
/*!40000 ALTER TABLE `AssessmentResult` DISABLE KEYS */;
/*!40000 ALTER TABLE `AssessmentResult` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Auth`
--

DROP TABLE IF EXISTS `Auth`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Auth` (
  `ID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `username` text NOT NULL COMMENT 'User login name',
  `password` text NOT NULL COMMENT 'User encrypted password',
  `password_expiry` text NOT NULL COMMENT 'When current password expires next',
  `FacebookID` tinytext NOT NULL COMMENT 'Used for Facebook Auth',
  `birthdate` tinytext NOT NULL COMMENT 'Used to authenticate',
  `acl` tinytext NOT NULL COMMENT 'Contains tags that unlock certain features',
  `flags` int(10) unsigned NOT NULL COMMENT 'Bitflags for this user',
  `securityq1` tinytext NOT NULL COMMENT 'Security Question 1',
  `securityq2` tinytext NOT NULL COMMENT 'Security Question 2',
  `securityq3` tinytext NOT NULL COMMENT 'Security Question 3',
  `securitya1` tinytext NOT NULL COMMENT 'Security Answer 1',
  `securitya2` tinytext NOT NULL COMMENT 'Security Answer 2',
  `securitya3` tinytext NOT NULL COMMENT 'Security Answer 3',
  `EmailVerified` int(10) unsigned NOT NULL,
  `Recurly` text NOT NULL,
  `AccountType` int(11) unsigned NOT NULL,
  `email` tinytext NOT NULL,
  `first_name` tinytext NOT NULL,
  `last_name` tinytext NOT NULL,
  `flags_copy1` int(10) unsigned NOT NULL,
  `Title` tinytext NOT NULL,
  `Website` tinytext NOT NULL,
  `Avatar` int(11) unsigned NOT NULL,
  `Twitter` tinytext NOT NULL,
  `Newsletter` int(11) unsigned NOT NULL COMMENT '0=no\n1=subscribed',
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=449 DEFAULT CHARSET=latin1 COMMENT='Main Auth table for handling user logins';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Auth`
--

LOCK TABLES `Auth` WRITE;
/*!40000 ALTER TABLE `Auth` DISABLE KEYS */;
INSERT INTO `Auth` VALUES (1,'admin','bc54a5065cfb10d30e1df7985165bab6','1519756349','','','su',0,'','','','','','',0,'',0,'','','',0,'','',0,'',0),(448,'h3rb','','','','','',0,'','','','','','',0,'',0,'','','',0,'','',0,'',0);
/*!40000 ALTER TABLE `Auth` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `AutoRowLock`
--

DROP TABLE IF EXISTS `AutoRowLock`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `AutoRowLock` (
  `ID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `T` varchar(45) NOT NULL,
  `I` int(10) unsigned NOT NULL,
  `Timestamp` int(10) unsigned NOT NULL,
  `r_Auth` int(10) unsigned NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=10022 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `AutoRowLock`
--

LOCK TABLES `AutoRowLock` WRITE;
/*!40000 ALTER TABLE `AutoRowLock` DISABLE KEYS */;
/*!40000 ALTER TABLE `AutoRowLock` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Branding`
--

DROP TABLE IF EXISTS `Branding`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Branding` (
  `ID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `Logo` int(10) unsigned NOT NULL COMMENT 'Link to a particular logo r_FileImage to override the default one present in Style',
  `Name` text NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Branding`
--

LOCK TABLES `Branding` WRITE;
/*!40000 ALTER TABLE `Branding` DISABLE KEYS */;
/*!40000 ALTER TABLE `Branding` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `CertificateDesign`
--

DROP TABLE IF EXISTS `CertificateDesign`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `CertificateDesign` (
  `ID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `Title` text NOT NULL,
  `Theme` int(10) unsigned NOT NULL,
  `CustomBacking` int(10) unsigned NOT NULL,
  `TextPlacements` text NOT NULL,
  `Created` int(10) unsigned NOT NULL,
  `r_Auth` int(10) unsigned NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `CertificateDesign`
--

LOCK TABLES `CertificateDesign` WRITE;
/*!40000 ALTER TABLE `CertificateDesign` DISABLE KEYS */;
/*!40000 ALTER TABLE `CertificateDesign` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Comment`
--

DROP TABLE IF EXISTS `Comment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Comment` (
  `ID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `r_Auth` int(10) unsigned NOT NULL,
  `Comment` text NOT NULL,
  `Timestamp` int(10) unsigned NOT NULL,
  `Table` text NOT NULL,
  `Field` text NOT NULL,
  `Icon` int(11) unsigned NOT NULL,
  `r_ReplyTo` int(11) unsigned NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Comment`
--

LOCK TABLES `Comment` WRITE;
/*!40000 ALTER TABLE `Comment` DISABLE KEYS */;
/*!40000 ALTER TABLE `Comment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Deletion`
--

DROP TABLE IF EXISTS `Deletion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Deletion` (
  `ID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `Table` text NOT NULL,
  `Data` longtext NOT NULL,
  `Reference` int(10) unsigned NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Deletion`
--

LOCK TABLES `Deletion` WRITE;
/*!40000 ALTER TABLE `Deletion` DISABLE KEYS */;
/*!40000 ALTER TABLE `Deletion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Enrollment`
--

DROP TABLE IF EXISTS `Enrollment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Enrollment` (
  `ID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `r_Program` int(10) unsigned NOT NULL,
  `r_Auth` int(10) unsigned NOT NULL,
  `Created` int(10) unsigned NOT NULL,
  `Completed` int(10) unsigned NOT NULL,
  `Paid` int(10) unsigned NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Enrollment`
--

LOCK TABLES `Enrollment` WRITE;
/*!40000 ALTER TABLE `Enrollment` DISABLE KEYS */;
/*!40000 ALTER TABLE `Enrollment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `File`
--

DROP TABLE IF EXISTS `File`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `File` (
  `ID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `Name` text NOT NULL COMMENT 'Original name of the file',
  `Uploaded` int(10) unsigned NOT NULL COMMENT 'Timestamp of upload time',
  `Uploader` int(10) unsigned NOT NULL COMMENT 'Reference to Auth of the uploader',
  `Size` int(10) unsigned NOT NULL COMMENT 'File size in bytes',
  `Extension` varchar(45) NOT NULL COMMENT 'Lower case extension of the file',
  `filemtime` int(10) unsigned NOT NULL,
  `Type` text NOT NULL COMMENT 'Mime type',
  `S3` text NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=20217 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `File`
--

LOCK TABLES `File` WRITE;
/*!40000 ALTER TABLE `File` DISABLE KEYS */;
INSERT INTO `File` VALUES (20211,'KcneMAMcq.png',1488218152,1,861245,'png',1488218152,'image/png',''),(20212,'KG_MINAS_TIRITH_001.jpg',1488219599,1,140200,'jpg',1488219599,'image/jpeg',''),(20213,'walter_newton-robocop_social.png',1488219616,1,287891,'png',1488219616,'image/png',''),(20214,'Green-Logo.png',1488219826,1,2601,'png',1488219826,'image/png',''),(20215,'ZeroTypes.png',1488220081,1,636686,'png',1488220081,'image/png',''),(20216,'1-jGrdwwREz_yVyJ75Dzuf4w.png',1488220306,1,424518,'png',1488220306,'image/png','');
/*!40000 ALTER TABLE `File` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `FileF3XB`
--

DROP TABLE IF EXISTS `FileF3XB`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `FileF3XB` (
  `ID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `r_File` int(10) unsigned NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COMMENT='Support for the TTFex-B format binary to allow selection in Kiosk Catalog Exports...';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `FileF3XB`
--

LOCK TABLES `FileF3XB` WRITE;
/*!40000 ALTER TABLE `FileF3XB` DISABLE KEYS */;
/*!40000 ALTER TABLE `FileF3XB` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `FileFLAC`
--

DROP TABLE IF EXISTS `FileFLAC`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `FileFLAC` (
  `ID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `Length` decimal(10,8) unsigned NOT NULL,
  `r_File` int(10) unsigned NOT NULL,
  PRIMARY KEY (`ID`,`Length`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `FileFLAC`
--

LOCK TABLES `FileFLAC` WRITE;
/*!40000 ALTER TABLE `FileFLAC` DISABLE KEYS */;
/*!40000 ALTER TABLE `FileFLAC` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `FileImage`
--

DROP TABLE IF EXISTS `FileImage`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `FileImage` (
  `ID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `Width` int(10) unsigned NOT NULL DEFAULT '0' COMMENT 'Size in pixels',
  `Height` int(10) unsigned NOT NULL DEFAULT '0' COMMENT 'Size in pixels',
  `Format` int(10) unsigned NOT NULL COMMENT '0=JPG, 1=PNG',
  `r_File` int(10) unsigned NOT NULL,
  `SEO` tinytext NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=10091 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `FileImage`
--

LOCK TABLES `FileImage` WRITE;
/*!40000 ALTER TABLE `FileImage` DISABLE KEYS */;
INSERT INTO `FileImage` VALUES (10090,960,900,0,20216,'');
/*!40000 ALTER TABLE `FileImage` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `FileSTL`
--

DROP TABLE IF EXISTS `FileSTL`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `FileSTL` (
  `ID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `Facets` int(10) unsigned NOT NULL COMMENT 'Facet count',
  `Bounds` text NOT NULL COMMENT 'Boundary information for the model',
  `Extents` text NOT NULL COMMENT 'Extents information for the model',
  `r_File` int(10) unsigned NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=9494 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `FileSTL`
--

LOCK TABLES `FileSTL` WRITE;
/*!40000 ALTER TABLE `FileSTL` DISABLE KEYS */;
/*!40000 ALTER TABLE `FileSTL` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `FileWAV`
--

DROP TABLE IF EXISTS `FileWAV`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `FileWAV` (
  `ID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `Length` decimal(10,0) NOT NULL COMMENT 'Audio length in seconds',
  `r_File` int(10) unsigned NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=263 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `FileWAV`
--

LOCK TABLES `FileWAV` WRITE;
/*!40000 ALTER TABLE `FileWAV` DISABLE KEYS */;
/*!40000 ALTER TABLE `FileWAV` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `GANTT`
--

DROP TABLE IF EXISTS `GANTT`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `GANTT` (
  `ID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `Name` text NOT NULL,
  `JSON` longtext NOT NULL,
  `r_Creator` int(10) unsigned NOT NULL,
  `AnyoneCanEdit` int(10) unsigned NOT NULL,
  `Editors` varchar(45) DEFAULT NULL,
  `Created` int(10) unsigned NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `GANTT`
--

LOCK TABLES `GANTT` WRITE;
/*!40000 ALTER TABLE `GANTT` DISABLE KEYS */;
/*!40000 ALTER TABLE `GANTT` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Modification`
--

DROP TABLE IF EXISTS `Modification`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Modification` (
  `ID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `r_Auth` int(10) unsigned NOT NULL COMMENT 'Who made the modification',
  `What` longtext NOT NULL COMMENT 'JSON in the form of array(tables)=>array(fields)=>array(IDs)',
  `Message` longtext NOT NULL COMMENT 'Any extra data provided by the application as to what was changed',
  `Timestamp` int(10) unsigned NOT NULL COMMENT 'When this modification was made for history screens',
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=19566 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Modification`
--

LOCK TABLES `Modification` WRITE;
/*!40000 ALTER TABLE `Modification` DISABLE KEYS */;
INSERT INTO `Modification` VALUES (19536,1,'{\"D\":{\"Survey\":{\"F\":\"Name\",\"I\":\"3\"}}}','',1488218518),(19537,1,'{\"D\":{\"Survey\":{\"F\":\"Name\",\"I\":\"3\"}}}','',1488218730),(19538,1,'{\"D\":{\"Survey\":{\"F\":\"Description\",\"I\":\"3\"}}}','',1488218732),(19539,1,'{\"D\":{\"Question\":{\"F\":\"Type\",\"I\":\"13\"}}}','',1488218886),(19540,1,'{\"D\":{\"Question\":{\"F\":\"Description\",\"I\":\"13\"}}}','',1488218900),(19541,1,'{\"D\":{\"Question\":{\"F\":\"Type\",\"I\":\"14\"}}}','',1488218928),(19542,1,'{\"D\":{\"Question\":{\"F\":\"Description\",\"I\":\"14\"}}}','',1488218935),(19543,1,'{\"D\":{\"Answer\":{\"F\":\"Content\",\"I\":\"18\"}}}','',1488219171),(19544,1,'{\"D\":{\"Answer\":{\"F\":\"Content\",\"I\":\"19\"}}}','',1488219179),(19545,1,'{\"D\":{\"Answer\":{\"F\":\"Content\",\"I\":\"20\"}}}','',1488219190),(19546,1,'{\"D\":{\"Answer\":{\"F\":\"Content\",\"I\":\"21\"}}}','',1488219198),(19547,1,'{\"D\":{\"Question\":{\"F\":\"Type\",\"I\":\"15\"}}}','',1488219272),(19548,1,'{\"D\":{\"Question\":{\"F\":\"Description\",\"I\":\"15\"}}}','',1488219278),(19549,1,'{\"D\":{\"Question\":{\"F\":\"Type\",\"I\":\"16\"}}}','',1488219296),(19550,1,'{\"D\":{\"Question\":{\"F\":\"Description\",\"I\":\"16\"}}}','',1488219304),(19551,1,'{\"D\":{\"Answer\":{\"F\":\"Content\",\"I\":\"22\"}}}','',1488219324),(19552,1,'{\"D\":{\"Answer\":{\"F\":\"Content\",\"I\":\"23\"}}}','',1488219336),(19553,1,'{\"D\":{\"Answer\":{\"F\":\"Content\",\"I\":\"24\"}}}','',1488219343),(19554,1,'{\"D\":{\"Answer\":{\"F\":\"Content\",\"I\":\"25\"}}}','',1488219351),(19555,1,'{\"D\":{\"Answer\":{\"F\":\"Content\",\"I\":\"26\"}}}','',1488219364),(19556,1,'{\"D\":{\"Question\":{\"F\":\"Type\",\"I\":\"16\"}}}','',1488219377),(19557,1,'{\"D\":{\"Question\":{\"F\":\"r_FileImage\",\"I\":\"13\"}}}','',1488220374),(19558,1,'{\"D\":{\"Answer\":{\"F\":\"Content\",\"I\":\"27\"}}}','',1488230542),(19559,1,'{\"D\":{\"Answer\":{\"F\":\"r_FileImage\",\"I\":\"27\"}}}','',1488230591),(19560,1,'{\"D\":{\"Auth\":{\"F\":\"username\",\"I\":\"448\"}}}','',1488258551),(19561,1,'{\"D\":{\"Profile\":{\"F\":\"first_name\",\"I\":\"316\"}}}','',1488258552),(19562,1,'{\"D\":{\"Profile\":{\"F\":\"last_name\",\"I\":\"316\"}}}','',1488258553),(19563,1,'{\"D\":{\"Profile\":{\"F\":\"email\",\"I\":\"316\"}}}','',1488258554),(19564,1,'{\"D\":{\"Auth\":{\"F\":\"acl\",\"I\":\"448\"}}}','',1488258568),(19565,1,'{\"D\":{\"Auth\":{\"F\":\"acl\",\"I\":\"448\"}}}','',1488258568);
/*!40000 ALTER TABLE `Modification` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Program`
--

DROP TABLE IF EXISTS `Program`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Program` (
  `ID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `Name` text NOT NULL,
  `Logo` int(10) unsigned NOT NULL,
  `Published` int(10) unsigned NOT NULL,
  `SelfRegistration` int(10) unsigned NOT NULL,
  `Free` decimal(10,0) unsigned NOT NULL,
  `ProgramMode` int(10) unsigned NOT NULL COMMENT '0=Course Mode\n1=',
  `Created` int(10) unsigned NOT NULL,
  `r_Auth` int(10) unsigned NOT NULL,
  `InviteOnly` int(10) unsigned NOT NULL,
  `PaymentRequired` int(10) unsigned NOT NULL,
  `AutoEnroll` int(10) unsigned NOT NULL DEFAULT '1' COMMENT '0=No\n1=Yes',
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Program`
--

LOCK TABLES `Program` WRITE;
/*!40000 ALTER TABLE `Program` DISABLE KEYS */;
/*!40000 ALTER TABLE `Program` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Question`
--

DROP TABLE IF EXISTS `Question`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Question` (
  `ID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `Description` text NOT NULL,
  `Type` int(10) unsigned NOT NULL COMMENT 'Types of questions are Choose One (Radio), Choose Many (Checkbox), True/False (Boolean), Rating (5 star), Free Text (Enter text), and radio/checkbox with optional free text ("something else")',
  `r_FileImage` int(10) unsigned NOT NULL,
  `NotRequired` int(10) unsigned NOT NULL,
  `Randomize` int(10) unsigned NOT NULL,
  `r_Survey` int(10) unsigned NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Question`
--

LOCK TABLES `Question` WRITE;
/*!40000 ALTER TABLE `Question` DISABLE KEYS */;
INSERT INTO `Question` VALUES (13,'Beer is very good.',3,10090,0,0,3),(14,'I am familiar with the following beers.',2,0,0,0,3),(15,'My overall opinion of beer is..',0,0,0,0,3),(16,'One of which of the following is a good beer?',1,0,0,0,3);
/*!40000 ALTER TABLE `Question` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `RequestedEmailVerification`
--

DROP TABLE IF EXISTS `RequestedEmailVerification`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `RequestedEmailVerification` (
  `ID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `r_Auth` int(10) unsigned NOT NULL,
  `Created` int(10) unsigned NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `RequestedEmailVerification`
--

LOCK TABLES `RequestedEmailVerification` WRITE;
/*!40000 ALTER TABLE `RequestedEmailVerification` DISABLE KEYS */;
/*!40000 ALTER TABLE `RequestedEmailVerification` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `RequestedEnrollment`
--

DROP TABLE IF EXISTS `RequestedEnrollment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `RequestedEnrollment` (
  `ID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `Requestor` int(10) unsigned NOT NULL COMMENT 'r_Auth of the requestor',
  `Program` int(10) unsigned NOT NULL,
  `Created` int(10) unsigned NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `RequestedEnrollment`
--

LOCK TABLES `RequestedEnrollment` WRITE;
/*!40000 ALTER TABLE `RequestedEnrollment` DISABLE KEYS */;
/*!40000 ALTER TABLE `RequestedEnrollment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `RequestedSurvey`
--

DROP TABLE IF EXISTS `RequestedSurvey`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `RequestedSurvey` (
  `ID` int(10) unsigned NOT NULL,
  `EmailRecipient` text NOT NULL,
  `r_AuthRecipient` int(10) unsigned NOT NULL,
  `r_AuthOriginator` int(10) unsigned NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `RequestedSurvey`
--

LOCK TABLES `RequestedSurvey` WRITE;
/*!40000 ALTER TABLE `RequestedSurvey` DISABLE KEYS */;
/*!40000 ALTER TABLE `RequestedSurvey` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `RowLock`
--

DROP TABLE IF EXISTS `RowLock`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `RowLock` (
  `ID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `T` varchar(45) NOT NULL,
  `I` int(10) unsigned NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=96 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `RowLock`
--

LOCK TABLES `RowLock` WRITE;
/*!40000 ALTER TABLE `RowLock` DISABLE KEYS */;
/*!40000 ALTER TABLE `RowLock` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Session`
--

DROP TABLE IF EXISTS `Session`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Session` (
  `ID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `r_Auth` int(10) unsigned NOT NULL COMMENT 'Reference to an Auth',
  `requests` int(10) unsigned NOT NULL COMMENT '# of requests made by this session',
  `last_url` text NOT NULL,
  `flags` int(10) unsigned NOT NULL COMMENT 'Any special flags',
  `login` text NOT NULL COMMENT 'Login time',
  `logout` text NOT NULL COMMENT 'Logout time',
  `status` int(11) NOT NULL COMMENT 'Connected status',
  `IP` text NOT NULL COMMENT 'IP Address',
  `ip_info` text NOT NULL COMMENT 'IP information gathered from GeoIP',
  `HOST` text NOT NULL COMMENT 'Hostname',
  `REFERRER` text NOT NULL COMMENT 'Referring URL',
  `BROWSER` text NOT NULL COMMENT 'Browser information',
  `refreshed` int(10) unsigned NOT NULL COMMENT 'Last refresh',
  `last_refreshed` int(10) unsigned NOT NULL COMMENT 'Last refresh before that',
  `timeout` text NOT NULL COMMENT 'How long until we time out',
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=2946 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Session`
--

LOCK TABLES `Session` WRITE;
/*!40000 ALTER TABLE `Session` DISABLE KEYS */;
INSERT INTO `Session` VALUES (2939,1,978,'http://54.201.212.43/logout',0,'1488217814','1488220332',0,'108.39.248.114','','','http://54.201.212.43/login?m=2','Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36 OPR/43.0.2442.991',1488220332,1488220331,''),(2940,1,11,'http://54.201.212.43/logout',0,'1488220335','1488220355',0,'108.39.248.114','','','http://54.201.212.43/login','Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36 OPR/43.0.2442.991',1488220355,1488220353,''),(2941,1,5430,'http://54.201.212.43/dash',0,'1488220361','',0,'108.39.248.114','','','http://54.201.212.43/login?m=1','Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36 OPR/43.0.2442.991',1488238586,1488238581,''),(2942,1,127,'http://54.201.212.43/survey.edit?ID=3',0,'1488230418','',0,'209.166.178.226','','','http://54.201.212.43/login','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_3) AppleWebKit/602.4.8 (KHTML, like Gecko) Version/10.0.3 Safari/602.4.8',1488233436,1488233431,''),(2943,1,58,'http://54.201.212.43/logout',0,'1488257364','1488258593',0,'108.39.248.114','','','http://54.201.212.43/login?m=2','Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36 OPR/43.0.2442.991',1488258593,1488258582,''),(2944,448,107,'http://54.201.212.43/dash',0,'1488258596','',1,'108.39.248.114','','','http://54.201.212.43/login','Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36 OPR/43.0.2442.991',1488268997,1488268989,''),(2945,1,1,'http://54.201.212.43/dash',0,'1488408477','',1,'209.166.178.226','','','http://54.201.212.43/login','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_3) AppleWebKit/602.4.8 (KHTML, like Gecko) Version/10.0.3 Safari/602.4.8',1488408477,1488408477,'');
/*!40000 ALTER TABLE `Session` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Slide`
--

DROP TABLE IF EXISTS `Slide`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Slide` (
  `ID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `Name` text NOT NULL COMMENT 'A friendly name for this slide',
  `r_FileImage` int(10) unsigned NOT NULL COMMENT 'An image to be displayed',
  `r_Film` int(10) unsigned NOT NULL COMMENT 'A film to be displayed (can loop for slide duration)',
  `Duration` decimal(10,5) NOT NULL DEFAULT '12.00000' COMMENT 'How long this slide is displayed in seconds',
  `FadeIn` decimal(10,5) NOT NULL DEFAULT '0.50000' COMMENT 'Fade-in duration of the slide in seconds',
  `FadeOut` decimal(10,5) NOT NULL DEFAULT '0.50000' COMMENT 'Fade-out duration of the slide in seconds',
  `r_FileWAV` int(11) NOT NULL,
  `WAVDelay` decimal(10,5) NOT NULL DEFAULT '0.00000',
  `Blending` int(10) unsigned NOT NULL DEFAULT '5',
  `Tags` text NOT NULL,
  `r_FileImage2` int(10) unsigned NOT NULL,
  `r_FileImage3` int(10) unsigned NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=372 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Slide`
--

LOCK TABLES `Slide` WRITE;
/*!40000 ALTER TABLE `Slide` DISABLE KEYS */;
/*!40000 ALTER TABLE `Slide` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Slideshow`
--

DROP TABLE IF EXISTS `Slideshow`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Slideshow` (
  `ID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `Name` text NOT NULL COMMENT 'A friendly name for this slideshow',
  `Frames` longtext NOT NULL COMMENT 'Frame and order of Slides',
  `Tags` text NOT NULL COMMENT 'Looping: slideshow loops indefinitely (until user interaction)',
  `Creator` int(10) unsigned NOT NULL,
  `Created` int(10) unsigned NOT NULL,
  `Notes` text NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Slideshow`
--

LOCK TABLES `Slideshow` WRITE;
/*!40000 ALTER TABLE `Slideshow` DISABLE KEYS */;
/*!40000 ALTER TABLE `Slideshow` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Survey`
--

DROP TABLE IF EXISTS `Survey`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Survey` (
  `ID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `Name` tinytext NOT NULL,
  `Description` text NOT NULL,
  `Type` int(10) unsigned NOT NULL,
  `Active` int(10) unsigned NOT NULL,
  `Created` int(10) unsigned NOT NULL,
  `Creator` int(10) unsigned NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Survey`
--

LOCK TABLES `Survey` WRITE;
/*!40000 ALTER TABLE `Survey` DISABLE KEYS */;
INSERT INTO `Survey` VALUES (3,'Certification of Beer Judge','Get certified in judging beer!',0,0,1488218515,1);
/*!40000 ALTER TABLE `Survey` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `SurveyResponse`
--

DROP TABLE IF EXISTS `SurveyResponse`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `SurveyResponse` (
  `ID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `r_Auth` int(10) unsigned NOT NULL,
  `EmailRecipient` int(10) unsigned NOT NULL,
  `Response` text NOT NULL,
  `Created` int(10) unsigned NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `SurveyResponse`
--

LOCK TABLES `SurveyResponse` WRITE;
/*!40000 ALTER TABLE `SurveyResponse` DISABLE KEYS */;
/*!40000 ALTER TABLE `SurveyResponse` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `WhiteLabel`
--

DROP TABLE IF EXISTS `WhiteLabel`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `WhiteLabel` (
  `ID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `Name` tinytext NOT NULL,
  `Logo` int(10) unsigned NOT NULL,
  `r_Auth` int(10) unsigned NOT NULL,
  `AdministrativeEmail` tinytext NOT NULL,
  `URLEndpoint` int(10) unsigned NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `WhiteLabel`
--

LOCK TABLES `WhiteLabel` WRITE;
/*!40000 ALTER TABLE `WhiteLabel` DISABLE KEYS */;
/*!40000 ALTER TABLE `WhiteLabel` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Wishlist`
--

DROP TABLE IF EXISTS `Wishlist`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Wishlist` (
  `ID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `Name` text NOT NULL,
  `Description` text NOT NULL,
  `Notes` text NOT NULL,
  `Status` text NOT NULL,
  `Timestamp` int(10) unsigned NOT NULL,
  `r_Creator` int(10) unsigned NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Wishlist`
--

LOCK TABLES `Wishlist` WRITE;
/*!40000 ALTER TABLE `Wishlist` DISABLE KEYS */;
/*!40000 ALTER TABLE `Wishlist` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `WishlistItem`
--

DROP TABLE IF EXISTS `WishlistItem`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `WishlistItem` (
  `ID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `Name` text NOT NULL,
  `Description` text NOT NULL,
  `r_Creator` int(10) unsigned NOT NULL,
  `r_Wishlist` int(10) unsigned NOT NULL,
  `Timestamp` int(10) unsigned NOT NULL,
  `r_RequestedBy` int(10) unsigned NOT NULL,
  `Status` int(10) unsigned NOT NULL COMMENT '0=New\n1=Research\n2=Accepted\n3=Completed\n4=Opposed\n5=Refactored',
  `Completed` int(10) unsigned NOT NULL,
  `Solution` text NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=57 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `WishlistItem`
--

LOCK TABLES `WishlistItem` WRITE;
/*!40000 ALTER TABLE `WishlistItem` DISABLE KEYS */;
/*!40000 ALTER TABLE `WishlistItem` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2017-03-02 17:19:32
