-- MySQL dump 10.13  Distrib 5.7.34, for Linux (x86_64)
--
-- Host: localhost    Database: dbmicert
-- ------------------------------------------------------
-- Server version	5.7.34-0ubuntu0.18.04.1

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
-- Table structure for table `AppSettings`
--

DROP TABLE IF EXISTS `AppSettings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `AppSettings` (
  `ID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `JSON` longtext NOT NULL COMMENT 'JSON array of the settings',
  `Created` int(10) unsigned NOT NULL COMMENT 'When it was created',
  PRIMARY KEY (`ID`),
  KEY `Created` (`Created`)
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
  `Private` int(11) unsigned NOT NULL,
  `PrivateBadges` int(11) unsigned NOT NULL,
  `Badge` int(11) unsigned NOT NULL,
  `Owner` int(10) unsigned NOT NULL,
  PRIMARY KEY (`ID`),
  KEY `r_Assessment` (`r_Assessment`),
  KEY `r_Program` (`r_Program`),
  KEY `Owner` (`Owner`),
  KEY `Timed` (`Timed`),
  KEY `PassMode` (`PassMode`),
  KEY `RandomizeOrder` (`RandomizeOrder`),
  KEY `QuestionsFromPool` (`QuestionsFromPool`),
  KEY `Private` (`Private`),
  KEY `PrivateBadges` (`PrivateBadges`),
  KEY `Badge` (`Badge`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Assessment`
--

LOCK TABLES `Assessment` WRITE;
/*!40000 ALTER TABLE `Assessment` DISABLE KEYS */;
INSERT INTO `Assessment` VALUES (1,'My new test','A great assessment deserves an accurate and informative description.',0,0,0,0,0,1,100,0,0,1,1,0,1),(2,'A name for a test','A great assessment deserves an accurate and informative description.',0,0,0,0,0,1,100,0,0,1,1,0,1),(3,'test1','a test',0,2,0,0,0,1,100,0,0,1,1,0,1),(4,'another test','test3',0,2,0,0,0,1,100,0,0,1,1,0,1),(5,'My test','',0,3,0,0,0,1,100,0,0,1,1,0,18);
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
  `ImageURL` text NOT NULL,
  `VideoURL` text NOT NULL,
  `r_AssessmentQuestion` int(10) unsigned NOT NULL,
  `Owner` int(11) unsigned NOT NULL,
  PRIMARY KEY (`ID`),
  KEY `Correct` (`Correct`),
  KEY `r_AssessmentQuestion` (`r_AssessmentQuestion`),
  KEY `Owner` (`Owner`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `AssessmentAnswer`
--

LOCK TABLES `AssessmentAnswer` WRITE;
/*!40000 ALTER TABLE `AssessmentAnswer` DISABLE KEYS */;
INSERT INTO `AssessmentAnswer` VALUES (1,'',0,'','',1,1),(2,'',0,'','',1,1),(3,'b',0,'','',0,1),(4,'b',0,'','',0,1),(5,'b',0,'','',0,1),(6,'b',1,'','',0,1),(7,'b',0,'','',0,1),(8,'b',1,'','',0,1),(9,'b',0,'','',0,1),(10,'b',1,'','',0,1),(11,'b',0,'','',0,1),(12,'b',1,'','',0,1),(13,'b',0,'','',0,1),(14,'b',1,'','',0,1),(15,'aa',1,'','',0,1),(16,'aa',0,'','',0,1),(17,'ba',0,'','',0,1),(18,'ba',1,'','',0,1),(19,'a',0,'','',0,1),(20,'b',1,'','',0,1);
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
  `Owner` int(11) unsigned NOT NULL,
  PRIMARY KEY (`ID`),
  KEY `r_Assessment` (`r_Assessment`),
  KEY `Owner` (`Owner`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `AssessmentQuestion`
--

LOCK TABLES `AssessmentQuestion` WRITE;
/*!40000 ALTER TABLE `AssessmentQuestion` DISABLE KEYS */;
INSERT INTO `AssessmentQuestion` VALUES (1,'','',0,1,'','','',2,1,0,0,60,1),(2,'','q',0,1,'','','',3,0,0,0,60,1),(3,'','q',0,1,'','','',3,0,0,0,60,1),(4,'','q',0,1,'','','',3,0,0,0,60,1),(5,'','q',0,1,'','','',3,0,0,0,60,1),(6,'','q',0,1,'','','',3,0,0,0,60,1),(7,'','q',0,1,'','','',3,0,0,0,60,1),(8,'','q',0,1,'','','',3,0,0,0,60,1),(9,'','new question',0,1,'','','',3,0,0,0,60,1),(10,'','qa',0,1,'','','',3,0,0,0,60,1);
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
  `r_AssessmentAnswer` int(10) unsigned NOT NULL,
  `Owner` int(10) unsigned NOT NULL,
  `Anonymous` int(10) unsigned NOT NULL,
  PRIMARY KEY (`ID`),
  KEY `r_Assessment` (`r_Assessment`),
  KEY `r_AssessmentQuestion` (`r_AssessmentQuestion`),
  KEY `r_AssessmentAnswer` (`r_AssessmentAnswer`),
  KEY `Owner` (`Owner`),
  KEY `Griped` (`Griped`),
  KEY `Anonymous` (`Anonymous`)
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
  `r_Assessment` int(10) unsigned NOT NULL,
  `Score` text NOT NULL,
  `Public` int(10) unsigned NOT NULL,
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
  `username` tinytext NOT NULL COMMENT 'User login name',
  `password` tinytext NOT NULL COMMENT 'User encrypted password',
  `password_expiry` int(10) unsigned NOT NULL COMMENT 'When current password expires next',
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
  `RegistrationSurvey` text NOT NULL,
  `su` int(11) unsigned NOT NULL DEFAULT '0',
  `Created` int(10) unsigned NOT NULL,
  PRIMARY KEY (`ID`),
  KEY `AccountType` (`AccountType`),
  KEY `Created` (`Created`),
  KEY `EmailVerified` (`EmailVerified`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=latin1 COMMENT='Main Auth table for handling user logins';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Auth`
--

LOCK TABLES `Auth` WRITE;
/*!40000 ALTER TABLE `Auth` DISABLE KEYS */;
INSERT INTO `Auth` VALUES (1,'admin','',1700000000,'','','su',0,'','','','','','',0,'',0,'micertapp@gmail.com','','',0,'','',0,'',0,'',0,0),(17,'this','$2y$10$qxUUBSAx3dX8sW783M3FduJQWChT3le6kDcEJQgx99CcpqKLy1rDa',1700000000,'','','',0,'','','','','','',0,'',0,'joe@dirt.com','','',0,'','',0,'',0,'{\"m\":\"\",\"s\":\"1\",\"t\":null,\"o\":null}',0,0),(18,'joedirt','$2y$10$DH64kJ0ePWrIZWYZIK7NDOmh5lLnH0bIej9./GD/dDxbnrqza1Q9C',1700000000,'','','',0,'','','','','','',0,'',0,'joe2@dirt.com','','',0,'','',0,'',0,'{\"m\":\"Hey I hope to take a lot of tests\",\"s\":\"1\",\"t\":null,\"o\":\"1\"}',0,0),(19,'h3rb','$2y$10$jcpNoZ8axE5oNww1YhHMO.uRqlA0yURdSBaRvqDYq5RoONdqkYhve',1700000000,'','','',0,'','','','','','',0,'',0,'herb.gilliland@gmail.com','','',0,'','',0,'',0,'{\"m\":\"\",\"s\":\"1\",\"t\":null,\"o\":null}',0,0),(20,'soph','$2y$10$j57lJTstBE6z.H2aQE89c.BsJrFprR3gaYyxKsBGTtuAX/PBpxPHG',1700000000,'','','',0,'','','','','','',0,'',0,'sophian.ajouaou@gmail.com','','',0,'','',0,'',0,'{\"m\":\"\",\"s\":null,\"t\":null,\"o\":null}',0,0),(21,'hgil','$2y$10$Giavhx8He1b0qyvREbs.xOySdt8KFVknPORsewTDEeBSR8v4r1FuO',1700000000,'','0','0',0,'','','','','','',0,'0',1,'hgilliland@gmail.com','','',0,'','',0,'',0,'{\"m\":\"\",\"s\":null,\"t\":null,\"o\":null}',0,0),(22,'Nancy.Sayo','$2y$10$.348vsTKE2HtO2MHhe2ri.XBb.eal7cks8hQrz2IDkK7ai7G8hhg.',1700000000,'','0','0',0,'','','','','','',0,'0',1,'nancy.sayo@gmail.com','','',0,'','',0,'',0,'{\"m\":\"Testing\",\"s\":null,\"t\":\"1\",\"o\":null}',0,0),(23,'micertify','$2y$10$1MhyEsHd1kzfTOXkUoNssutWQp0m14TyRBJIkUGNO0ikf0JzqzYaC',1700000000,'','0','0',0,'','','','','','',0,'0',1,'micertapp@gmail.com','','',0,'','',0,'',0,'{\"m\":\"\",\"s\":null,\"t\":\"1\",\"o\":null}',0,0);
/*!40000 ALTER TABLE `Auth` ENABLE KEYS */;
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
  PRIMARY KEY (`ID`),
  KEY `Logo` (`Logo`)
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
  `Owner` int(10) unsigned NOT NULL,
  PRIMARY KEY (`ID`),
  KEY `Created` (`Created`),
  KEY `Owner` (`Owner`)
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
  `Comment` text NOT NULL,
  `Timestamp` int(10) unsigned NOT NULL,
  `Table` text NOT NULL,
  `Field` text NOT NULL,
  `Icon` int(11) unsigned NOT NULL,
  `Owner` int(10) unsigned NOT NULL,
  `ReplyTo` int(10) unsigned NOT NULL,
  PRIMARY KEY (`ID`),
  KEY `Owner` (`Owner`),
  KEY `ReplyTo` (`ReplyTo`),
  KEY `Timestamp` (`Timestamp`)
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
-- Table structure for table `Enrollment`
--

DROP TABLE IF EXISTS `Enrollment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Enrollment` (
  `ID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `r_Program` int(10) unsigned NOT NULL,
  `Created` int(10) unsigned NOT NULL,
  `Completed` int(10) unsigned NOT NULL,
  `Paid` int(10) unsigned NOT NULL,
  `Owner` int(10) unsigned NOT NULL,
  PRIMARY KEY (`ID`),
  KEY `r_Program` (`r_Program`),
  KEY `Owner` (`Owner`),
  KEY `Created` (`Created`),
  KEY `Completed` (`Completed`),
  KEY `Paid` (`Paid`)
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
-- Table structure for table `Message`
--

DROP TABLE IF EXISTS `Message`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Message` (
  `ID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `Subject` text NOT NULL,
  `Content` text NOT NULL,
  `FromUser` int(10) unsigned NOT NULL,
  `Owner` int(10) unsigned NOT NULL,
  `Created` int(10) unsigned NOT NULL,
  `HasRead` int(10) unsigned NOT NULL,
  PRIMARY KEY (`ID`),
  KEY `Owner` (`Owner`),
  KEY `Created` (`Created`),
  KEY `HasRead` (`HasRead`),
  KEY `FromUser` (`FromUser`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Message`
--

LOCK TABLES `Message` WRITE;
/*!40000 ALTER TABLE `Message` DISABLE KEYS */;
/*!40000 ALTER TABLE `Message` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Notification`
--

DROP TABLE IF EXISTS `Notification`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Notification` (
  `ID` int(10) unsigned NOT NULL,
  `Content` text NOT NULL,
  `Created` int(10) unsigned NOT NULL,
  `Owner` int(10) unsigned NOT NULL,
  PRIMARY KEY (`ID`),
  KEY `Created` (`Created`),
  KEY `Owner` (`Owner`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Notification`
--

LOCK TABLES `Notification` WRITE;
/*!40000 ALTER TABLE `Notification` DISABLE KEYS */;
/*!40000 ALTER TABLE `Notification` ENABLE KEYS */;
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
  `Owner` int(10) unsigned NOT NULL,
  `InviteOnly` int(10) unsigned NOT NULL,
  `PaymentRequired` int(10) unsigned NOT NULL,
  `AutoEnroll` int(10) unsigned NOT NULL DEFAULT '1' COMMENT '0=No\n1=Yes',
  `Description` text,
  `Days` int(10) unsigned NOT NULL,
  `Introduction` text NOT NULL,
  `CrowdGrading` int(10) unsigned NOT NULL,
  `Category` int(10) unsigned NOT NULL,
  `Featured` int(10) unsigned NOT NULL COMMENT '1 = Hand picked\n2 = Paid for',
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Program`
--

LOCK TABLES `Program` WRITE;
/*!40000 ALTER TABLE `Program` DISABLE KEYS */;
INSERT INTO `Program` VALUES (1,'Testy Westy',1,0,0,0,2,1567706994,1,0,0,1,NULL,0,'',0,0,0),(2,'test2',0,0,1,0,2,1587935816,1,0,0,1,'',0,'Welcome to the course!',0,0,0),(3,'Joe\'s Program',0,0,1,0,2,1624916340,18,0,0,1,'asdasd',0,'Welcome to the course!',0,0,0);
/*!40000 ALTER TABLE `Program` ENABLE KEYS */;
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
  PRIMARY KEY (`ID`),
  KEY `r_Auth` (`r_Auth`),
  KEY `Created` (`Created`)
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
  PRIMARY KEY (`ID`),
  KEY `Created` (`Created`),
  KEY `Requestor` (`Requestor`),
  KEY `Program` (`Program`)
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
-- Table structure for table `Session`
--

DROP TABLE IF EXISTS `Session`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Session` (
  `ID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `r_Auth` int(10) unsigned DEFAULT NULL COMMENT 'Reference to an Auth',
  `requests` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '# of requests made by this session',
  `last_url` text,
  `flags` int(10) unsigned NOT NULL DEFAULT '0' COMMENT 'Any special flags',
  `login` text NOT NULL COMMENT 'Login time',
  `logout` text COMMENT 'Logout time',
  `status` int(11) unsigned NOT NULL COMMENT 'Connected status',
  `IP` text COMMENT 'IP Address',
  `ip_info` text COMMENT 'IP information gathered from GeoIP',
  `HOST` text COMMENT 'Hostname',
  `REFERRER` text COMMENT 'Referring URL',
  `BROWSER` text COMMENT 'Browser information',
  `expiresAt` int(10) unsigned NOT NULL DEFAULT '0' COMMENT 'Last refresh',
  `token` text,
  PRIMARY KEY (`ID`),
  KEY `r_Auth` (`r_Auth`),
  KEY `status` (`status`),
  KEY `expiresAt` (`expiresAt`)
) ENGINE=InnoDB AUTO_INCREMENT=3094 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Session`
--

LOCK TABLES `Session` WRITE;
/*!40000 ALTER TABLE `Session` DISABLE KEYS */;
INSERT INTO `Session` VALUES (3004,1,0,NULL,0,'1564799049',NULL,1,'104.168.61.123',NULL,NULL,'','',1564800849,'c638ab6b937a736b174639783595df88'),(3005,1,0,NULL,0,'1564799052',NULL,1,'104.168.61.123',NULL,NULL,'','',1564800852,'0d251c8e2f6479c6042251c4e596f298'),(3006,1,0,NULL,0,'1564799101',NULL,1,'104.168.61.123',NULL,NULL,'','',1564800901,'c0455ed02392143358e20ea23ca72b03'),(3007,1,0,NULL,0,'1564799951',NULL,1,'104.168.61.123',NULL,NULL,'','',1564801751,'50384c2361c419cae5c954045588cec3'),(3008,1,0,NULL,0,'1564799989',NULL,1,'104.168.61.123',NULL,NULL,'','',1564801789,'a10c28e2af9e689ccdc8d52111756151'),(3009,1,0,NULL,0,'1564800104',NULL,1,'104.168.61.123',NULL,NULL,'','',1564801904,'bf2bf79d297d51734ed2d7ac4ff32c4b'),(3010,1,0,NULL,0,'1564841933',NULL,1,'73.154.36.180',NULL,NULL,'http://www.micertify.com/login','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.142 Safari/537.36',1564843733,'f303c69a5a53e91e8864ee13bf6e6c7b'),(3011,1,0,'http://www.micertify.com/logout',0,'1564842094','1564842213',0,'73.154.36.180',NULL,NULL,'http://www.micertify.com/login','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.142 Safari/537.36',1564843894,'4a9e4f7be801c48655517e7ceda15b14'),(3012,1,0,NULL,0,'1564842367',NULL,1,'104.168.61.123',NULL,NULL,'','',1564846850,'14bbae913ecff3a1c7802b01fffee3aa'),(3013,1,0,NULL,0,'1564858072',NULL,1,'104.168.61.123',NULL,NULL,'','',1564859872,'68405275d10ab5dbd5bffa597fd5dd5d'),(3014,1,0,NULL,0,'1564858123',NULL,1,'104.168.61.123',NULL,NULL,'','',1564861147,'ebfa3345519666272763cd0655d68792'),(3015,1,0,NULL,0,'1565140580',NULL,1,'104.168.61.123',NULL,NULL,'','',1565142380,'274de74be5998f9c6c796d7e6a3bc70a'),(3016,1,0,NULL,0,'1565140588',NULL,1,'104.168.61.123',NULL,NULL,'','',1565143382,'132a65c8b5c2d74acbebc97a56114def'),(3017,1,0,NULL,0,'1566254760',NULL,1,'104.168.61.123',NULL,NULL,'','',1566256560,'ac2b30e1dfc375fd15e78fae009fd9fa'),(3018,1,0,'http://micertify.com/dash',0,'1566447741','1566448949',0,'73.154.36.180',NULL,NULL,'http://micertify.com/login','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.100 Safari/537.36',1566449541,'4ff056f68c0f1de46cc6039b13d97fd2'),(3019,1,4,'http://micertify.com/dash',0,'1566448958',NULL,1,'73.154.36.180',NULL,NULL,'http://micertify.com/login','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.100 Safari/537.36',1566452228,'fce03b245e85d005872584eb935f40f0'),(3020,1,0,NULL,0,'1566662405',NULL,1,'104.168.61.123',NULL,NULL,'','',1566664205,'95049fca251306a61748c36564501eb3'),(3021,1,0,NULL,0,'1566663953',NULL,1,'73.154.36.180',NULL,NULL,'http://micertify.com/app/','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.100 Safari/537.36',1566665753,'d821b9d8923600e5bae440022160489c'),(3022,1,0,NULL,0,'1566664015',NULL,1,'73.154.36.180',NULL,NULL,'http://micertify.com/app/','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.100 Safari/537.36',1566665815,'b296c2f6eff9891031009c96858ab2eb'),(3023,1,0,NULL,0,'1566664038',NULL,1,'73.154.36.180',NULL,NULL,'http://micertify.com/app/','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.100 Safari/537.36',1566665838,'ac59b0422f0f75817982fc006ec7cfeb'),(3024,1,0,NULL,0,'1566664128',NULL,1,'73.154.36.180',NULL,NULL,'http://micertify.com/app/','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.100 Safari/537.36',1566665928,'c3d8e73268bb06c43f0616928375c017'),(3025,1,12811,'http://micertify.com/dash',0,'1566664179',NULL,1,'73.154.36.180',NULL,NULL,'http://micertify.com/app/','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.100 Safari/537.36',1567033894,'824eaabd5c859da4eeaa61dba95fdf0c'),(3026,1,499,NULL,0,'1567042534','1567053591',0,'73.154.36.180',NULL,NULL,'http://micertify.com/app/','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.100 Safari/537.36',1567057270,'65262057f60a16528fb213b84441ad9a'),(3027,1,0,NULL,0,'1567055695',NULL,1,'73.154.36.180',NULL,NULL,'http://micertify.com/app/?q=Lost+Astronaut+Studios&search=','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.100 Safari/537.36',1567057495,'b5914b066f5fda1350915f6c1be6eaf6'),(3028,1,6,NULL,0,'1567055811','1567055897',0,'73.154.36.180',NULL,NULL,'http://micertify.com/app/?q=Lost+Astronaut+Studios&search=','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.100 Safari/537.36',1567057697,'6b4eef60d86097d1ac71cb9b92efae90'),(3029,1,23,NULL,0,'1567055912','1567056557',0,'73.154.36.180',NULL,NULL,'http://micertify.com/app/?q=Lost+Astronaut+Studios&search=','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.100 Safari/537.36',1567058357,'31c721a84978265a49f68b6dfd64a202'),(3030,1,0,NULL,0,'1567056587',NULL,1,'73.154.36.180',NULL,NULL,'http://micertify.com/app/?q=Lost+Astronaut+Studios&search=','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.100 Safari/537.36',1567058387,'1e3b0d9084a31ada94728095bc6a566c'),(3031,1,0,NULL,0,'1567056594',NULL,1,'73.154.36.180',NULL,NULL,'http://micertify.com/app/?q=Lost+Astronaut+Studios&search=','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.100 Safari/537.36',1567058394,'fdf2cb4c9e718516dc9f45e54822731a'),(3032,1,4,NULL,0,'1567056602','1567056646',0,'73.154.36.180',NULL,NULL,'http://micertify.com/app/?q=Lost+Astronaut+Studios&search=','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.100 Safari/537.36',1567058446,'767098d4790ec31deaa5a8398e6f7e0f'),(3033,1,4,NULL,0,'1567056650','1567056702',0,'73.154.36.180',NULL,NULL,'http://micertify.com/app/?q=Lost+Astronaut+Studios&search=','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.100 Safari/537.36',1567058502,'f12d5f659dc305f4ed7f6bfe82d4e3f0'),(3034,1,0,NULL,0,'1567056705',NULL,1,'73.154.36.180',NULL,NULL,'http://micertify.com/app/?q=Lost+Astronaut+Studios&search=','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.100 Safari/537.36',1567058505,'66c4e233d25bd11760de435e78155c5e'),(3035,1,0,NULL,0,'1567056709',NULL,1,'73.154.36.180',NULL,NULL,'http://micertify.com/app/?q=Lost+Astronaut+Studios&search=','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.100 Safari/537.36',1567058509,'65b302f7f40fd95fe44ae1919456f202'),(3036,1,0,NULL,0,'1567056741',NULL,1,'73.154.36.180',NULL,NULL,'http://micertify.com/app/?q=Lost+Astronaut+Studios&search=','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.100 Safari/537.36',1567058541,'789314ae5e82a98c84ec9207592b31eb'),(3037,1,2,NULL,0,'1567056760','1567056762',0,'73.154.36.180',NULL,NULL,'http://micertify.com/app/?q=Lost+Astronaut+Studios&search=','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.100 Safari/537.36',1567058562,'8e33b9143bb104e53555655a4ba28d5c'),(3038,1,58,NULL,0,'1567056768','1567058338',0,'73.154.36.180',NULL,NULL,'http://micertify.com/app/?q=Lost+Astronaut+Studios&search=','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.100 Safari/537.36',1567060138,'f3f596d2582bce3e1f38f19636c2ff15'),(3039,1,5,'http://micertify.com/dash',0,'1567094755','1567094871',0,'73.154.36.180',NULL,NULL,'http://micertify.com/login','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.100 Safari/537.36',1567096671,'00536cca605482b4887c0fad3f4d120c'),(3040,1,52,NULL,0,'1567094901','1567096313',0,'73.154.36.180',NULL,NULL,'http://micertify.com/app/','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.100 Safari/537.36',1567098114,'06dfc8c670905484faa6bd9d4fd619b0'),(3041,1,47,NULL,0,'1567095080','1567096379',0,'198.163.38.6',NULL,NULL,'http://micertify.com/app/','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.142 Safari/537.36',1567098179,'d472732b29119e710e6c0f8ce3f52e22'),(3042,1,47,'http://micertify.com/request_login.php',0,'1567095092','1567096401',0,'69.231.249.238',NULL,NULL,'http://micertify.com/app/','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.100 Safari/537.36',1567098201,'501529ff4a7ca061bc35abbff6f019e3'),(3043,1,0,'http://micertify.com/dash',0,'1567095131',NULL,1,'69.231.249.238',NULL,NULL,'http://micertify.com/login','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.100 Safari/537.36',1567096931,'69e75c1a21ed80ec42231d72bbcec4cc'),(3044,1,52,NULL,0,'1567107838','1567109223',0,'73.154.36.180',NULL,NULL,'http://micertify.com/app/?q=Lost+Astronaut+Studios&search=','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.100 Safari/537.36',1567111023,'7cd9217f4cc646599f0e3ce6d882f953'),(3045,1,152,NULL,0,'1567130578','1567135016',0,'73.154.36.180',NULL,NULL,'http://micertify.com/app/','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.100 Safari/537.36',1567136816,'35ff6a659bfccb20308f8c9b5a661192'),(3046,1,11,NULL,0,'1567706216',NULL,1,'104.168.61.123',NULL,NULL,'','',1567709220,'e4b6aa5d230148f3c90e0bd3c07940dd'),(3047,1,50,'http://micertify.com/dash',0,'1568039326','1568040651',0,'73.154.36.180',NULL,NULL,'http://micertify.com/login','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.132 Safari/537.36',1568042451,'efb87b57cdab198e11b3aedf876592b1'),(3048,1,0,NULL,0,'1568040685',NULL,1,'73.154.36.180',NULL,NULL,'http://micertify.com/app/','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.132 Safari/537.36',1568042485,'b5cea074c57fe5161b4ccc696d9342ee'),(3049,1,319,NULL,0,'1568040702','1568047795',0,'73.154.36.180',NULL,NULL,'http://micertify.com/app/','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.132 Safari/537.36',1568049595,'97c7f137d46f02c7753d821b24d3e725'),(3050,1,0,NULL,0,'1568044063',NULL,1,'73.154.36.180',NULL,NULL,'http://micertify.com/app/','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.132 Safari/537.36',1568045863,'79fe6bc45b011f60f260bc717587e00c'),(3051,1,46,NULL,0,'1568047807','1568049064',0,'73.154.36.180',NULL,NULL,'http://micertify.com/app/index.html','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.132 Safari/537.36',1568050864,'011fcf79139b8cbe49529809b03440c5'),(3052,1,0,NULL,0,'1568053566',NULL,1,'73.154.36.180',NULL,NULL,'http://micertify.com/app/','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.132 Safari/537.36',1568055366,'fad7f73fbab9b21b796936a23894c441'),(3053,1,73,NULL,0,'1568053572','1568055611',0,'73.154.36.180',NULL,NULL,'http://micertify.com/app/','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.132 Safari/537.36',1568057411,'ba73e939b31223606551070863542655'),(3054,1,157,'http://micertify.com/app/js/getconfig.php',0,'1585920970','1585922718',0,'73.154.36.180',NULL,NULL,'http://micertify.com/app/','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36',1585926555,'a0284ee7ee644eba62abfa522e22477d'),(3055,1,1,NULL,0,'1585922579',NULL,1,'73.154.36.180',NULL,NULL,'http://micertify.com/app/','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36',1585924394,'575c1a21bed603b8b5ce5ef14aa50df4'),(3056,1,368,'http://micertify.com/app/js/getconfig.php',0,'1587932815','1587937899',0,'73.154.36.180',NULL,NULL,'http://micertify.com/app/','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.122 Safari/537.36',1587939699,'620b78c84eb480220083dfd7250fcabe'),(3057,1,205,'http://micertify.com/app/js/getconfig.php',0,'1589889212','1589891644',0,'73.154.36.180',NULL,NULL,'http://micertify.com/app/','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Safari/537.36',1589893444,'4a2ddc2e5dee2205219713ed7867da19'),(3058,1,249,NULL,0,'1590790378','1590793965',0,'73.154.36.180',NULL,NULL,'http://micertify.com/app/','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.61 Safari/537.36',1590795765,'79dd947edb3a4b3838aa35b4f2ef33ee'),(3059,1,436,'http://micertify.com/app/js/getconfig.php',0,'1590800759','1590804445',0,'73.154.36.180',NULL,NULL,'http://micertify.com/app/','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.61 Safari/537.36',1590806270,'0b8ba7d4264921441451ca44dc5ad1e4'),(3060,1,165,'http://micertify.com/app/js/getconfig.php',0,'1590804513','1590806785',0,'73.154.36.180',NULL,NULL,'http://micertify.com/app/','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.61 Safari/537.36',1590808586,'30b78d9d00c8556df8d46a76cfe0f031'),(3061,1,755,'http://micertify.com/app/js/getconfig.php',0,'1590816742','1590822821',0,'73.154.36.180',NULL,NULL,'http://micertify.com/app/','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.61 Safari/537.36',1590824716,'b467c7d23f4f168a6f113fc37af24d2a'),(3062,1,120,NULL,0,'1591218037','1591219713',0,'73.154.36.180',NULL,NULL,'http://micertify.com/app/','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.61 Safari/537.36',1591221514,'18f323b2c87f7a27f609701a4dfc8770'),(3063,1,208,'http://micertify.com/app/js/getconfig.php',0,'1591221093','1591223692',0,'73.154.36.180',NULL,NULL,'http://micertify.com/app/','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.61 Safari/537.36',1591225492,'0ec54544c759e16073700f772407ec70'),(3064,1,343,'http://micertify.com/app/js/getconfig.php',0,'1591230522','1591235167',0,'73.154.36.180',NULL,NULL,'http://micertify.com/app/','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.61 Safari/537.36',1591236967,'bce4057e15f0f34b81753917814c0ea7'),(3065,1,587,'http://micertify.com/app/js/getconfig.php',0,'1591237357','1591243867',0,'73.154.36.180',NULL,NULL,'http://micertify.com/app/','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.61 Safari/537.36',1591245667,'9d6b3aa2e975f3700bd9b8a57d57ed4a'),(3066,1,198,'http://micertify.com/app/js/getconfig.php',0,'1591244768','1591247248',0,'73.154.36.180',NULL,NULL,'http://micertify.com/app/','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.61 Safari/537.36',1591249048,'bff9cdce5ebec481190e726c9ea14444'),(3067,1,294,'http://micertify.com/app/js/getconfig.php',0,'1591247262','1591249995',0,'73.154.36.180',NULL,NULL,'http://micertify.com/app/','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.61 Safari/537.36',1591252628,'4783899cf0ef882d180adf6cb87cd0d3'),(3068,1,90,'http://micertify.com/app/js/getconfig.php',0,'1593389165',NULL,1,'73.154.36.180',NULL,NULL,'http://micertify.com/app/','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36',1593392118,'a9698e01e6d91441f1724a0af37e73c4'),(3069,1,150,'http://micertify.com/app/js/getconfig.php',0,'1593439223','1593441362',0,'73.154.36.180',NULL,NULL,'http://micertify.com/app/','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36',1593443162,'2896342d8ad82f03c8a4f5e48130e502'),(3070,1,105,NULL,0,'1593453756',NULL,1,'73.154.36.180',NULL,NULL,'http://micertify.com/app/','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36',1593457070,'c051a1585254c767b437b853eb34d823'),(3071,1,118,NULL,0,'1593549541','1593551218',0,'73.154.36.180',NULL,NULL,'http://micertify.com/app/','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36',1593553019,'a2e6314e8338930e4e5d7f686569202a'),(3072,1,92,NULL,0,'1594781187','1594782439',0,'73.154.36.180',NULL,NULL,'http://micertify.com/app/','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36',1594784239,'b6a07dd833f90dd0c2dbdd851984f5b6'),(3073,1,52,NULL,0,'1594839593',NULL,1,'73.154.36.180',NULL,NULL,'http://micertify.com/app/','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36',1594842115,'2fd34484a73d2b71e4e1ff26595f1100'),(3074,1,92,NULL,0,'1603503584','1603504838',0,'73.154.36.180',NULL,NULL,'http://micertify.com/app/','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36 OPR/71.0.3770.271',1603506638,'2f7b411efa89db0242fddf49be313b4d'),(3075,1,30,'http://micertify.com/app/js/getconfig.php',0,'1603506766','1603507629',0,'73.154.36.180',NULL,NULL,'http://micertify.com/app/','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.111 Safari/537.36',1603509429,'809b3c27fbb2452c674c4e7e1e29d31b'),(3076,1,4,NULL,0,'1603574488','1603574503',0,'73.154.36.180',NULL,NULL,'http://micertify.com/app/','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.111 Safari/537.36',1603576303,'0455f546957771257c626f6e8bd6b046'),(3077,18,0,NULL,0,'1603581745',NULL,1,'73.154.36.180',NULL,NULL,'http://micertify.com/app/','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.111 Safari/537.36',1603583545,'44e46bde88b1a3eb0e4df5a7850955ae'),(3078,18,25,'http://micertify.com/app/js/getconfig.php',0,'1603581771','1603582017',0,'73.154.36.180',NULL,NULL,'http://micertify.com/app/','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.111 Safari/537.36',1603583817,'6f957c4257997ca8b426728736b3b9f8'),(3079,19,0,NULL,0,'1603582035',NULL,1,'73.154.36.180',NULL,NULL,'http://micertify.com/app/','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.111 Safari/537.36',1603583835,'813148e2daf1b776da0bcea098a6f1c2'),(3080,19,4,NULL,0,'1603582208','1603582214',0,'73.154.36.180',NULL,NULL,'http://micertify.com/app/','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.111 Safari/537.36',1603584014,'f043e7281690b93e13a473f6cc3b081e'),(3081,19,9,'http://micertify.com/app/js/getconfig.php',0,'1603582221','1603582282',0,'73.154.36.180',NULL,NULL,'http://micertify.com/app/','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.111 Safari/537.36',1603584082,'42d85ea2d675aecb2eb456cb4d401cd7'),(3082,19,0,NULL,0,'1603582317',NULL,1,'73.154.36.180',NULL,NULL,'http://micertify.com/app/','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.111 Safari/537.36',1603584117,'15ea87baee1194cb3ab525b2954ec638'),(3083,19,99,'http://micertify.com/app/js/getconfig.php',0,'1603582386',NULL,1,'73.154.36.180',NULL,NULL,'http://micertify.com/app/','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.111 Safari/537.36',1603585249,'f8c3fed2afc72071be64936cf93d8380'),(3084,19,188,'https://micertify.com:443/app/js/getconfig.php',0,'1603586541','1603587860',0,'73.154.36.180',NULL,NULL,'https://micertify.com/app/','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.111 Safari/537.36',1603589716,'c16ffcd3b264f7d6ce360d4a040a7a8d'),(3085,19,97,NULL,0,'1603768084','1603769400',0,'73.154.36.180',NULL,NULL,'https://micertify.com/app/','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.111 Safari/537.36',1603771200,'13122e0c195f2a8cf650251abee554f1'),(3086,19,220,NULL,0,'1603844724','1603847783',0,'73.154.36.180',NULL,NULL,'https://micertify.com/app/','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.111 Safari/537.36',1603849583,'7667da21c6634848b9ee45a51dfacc2e'),(3087,19,466,'https://micertify.com:443/app/js/getconfig.php',0,'1603850275','1603855503',0,'73.154.36.180',NULL,NULL,'https://micertify.com/app/','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.111 Safari/537.36',1603857303,'49c6fe0786b9b4e328544d30a66a8113'),(3088,23,95,NULL,0,'1603989903','1603991174',0,'73.154.36.180',NULL,NULL,'https://micertify.com/app/','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.111 Safari/537.36',1603992974,'8ca887653ff5c39f847a968bc4947e90'),(3089,23,205,NULL,0,'1603997658','1604000598',0,'73.154.36.180',NULL,NULL,'https://micertify.com/app/','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.111 Safari/537.36',1604002398,'9bce87baf4bc13ed3c230b5f4c680784'),(3090,18,8,'http://micertify.com/',0,'1624914076','1624914146',0,'73.79.254.54',NULL,NULL,'http://micertify.com/app/','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36',1624915946,'86ced1738b6a9de4951570458e830919'),(3091,18,0,NULL,0,'1624916308',NULL,1,'73.79.254.54',NULL,NULL,'http://micertify.com/app/','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36',1624918108,'c63aede8ae4a2671a7a4ba34b282a068'),(3092,18,98,'http://micertify.com/app/js/getconfig.php',0,'1624916317','1624917904',0,'73.79.254.54',NULL,NULL,'http://micertify.com/app/','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36',1624919704,'d56df9f5b3374371d2a7e847dcc1d64a'),(3093,18,222,'http://micertify.com/app/js/getconfig.php',0,'1624992937','1624996086',0,'73.79.254.54',NULL,NULL,'http://micertify.com/app/','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36',1624997886,'ca4090066a9bec0e227afbe804275807');
/*!40000 ALTER TABLE `Session` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Task`
--

DROP TABLE IF EXISTS `Task`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Task` (
  `ID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `Content` text NOT NULL,
  `Created` int(10) unsigned NOT NULL,
  `Owner` int(10) unsigned NOT NULL,
  `Completion` int(10) unsigned NOT NULL COMMENT '0=to-do\n1=done',
  PRIMARY KEY (`ID`),
  KEY `Created` (`Created`),
  KEY `Owner` (`Owner`),
  KEY `Completion` (`Completion`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Task`
--

LOCK TABLES `Task` WRITE;
/*!40000 ALTER TABLE `Task` DISABLE KEYS */;
/*!40000 ALTER TABLE `Task` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `TestingSession`
--

DROP TABLE IF EXISTS `TestingSession`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `TestingSession` (
  `ID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `Owner` int(10) unsigned NOT NULL,
  `r_AssessmentQuestion` int(10) unsigned NOT NULL,
  `QuestionStarted` int(10) unsigned NOT NULL,
  `StartingSessionToken` text,
  `SessionTokens` text,
  `Paused` int(10) unsigned NOT NULL DEFAULT '1',
  `NextQuestionStarts` int(10) unsigned NOT NULL,
  `Remaining` text,
  `Completed` text,
  `TimePassed` int(10) unsigned NOT NULL,
  `TimeStarted` int(10) unsigned NOT NULL,
  PRIMARY KEY (`ID`),
  KEY `r_AssessmentQuestion` (`r_AssessmentQuestion`),
  KEY `Owner` (`Owner`),
  KEY `Paused` (`Paused`),
  KEY `NextQuestionStarts` (`NextQuestionStarts`),
  KEY `QuestionStarted` (`QuestionStarted`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COMMENT='Used to maintain anti-cheat';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `TestingSession`
--

LOCK TABLES `TestingSession` WRITE;
/*!40000 ALTER TABLE `TestingSession` DISABLE KEYS */;
/*!40000 ALTER TABLE `TestingSession` ENABLE KEYS */;
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
  `AdministrativeEmail` tinytext NOT NULL,
  `URLEndpoint` int(10) unsigned NOT NULL,
  `Owner` int(10) unsigned NOT NULL,
  PRIMARY KEY (`ID`),
  KEY `Owner` (`Owner`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `WhiteLabel`
--

LOCK TABLES `WhiteLabel` WRITE;
/*!40000 ALTER TABLE `WhiteLabel` DISABLE KEYS */;
/*!40000 ALTER TABLE `WhiteLabel` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-07-06  2:08:32
