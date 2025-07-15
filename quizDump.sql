-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: localhost    Database: guhuza_quiz2
-- ------------------------------------------------------
-- Server version	8.0.42

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `_prisma_migrations`
--

DROP TABLE IF EXISTS `_prisma_migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `_prisma_migrations` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `checksum` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `logs` text COLLATE utf8mb4_unicode_ci,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `applied_steps_count` int unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `_prisma_migrations`
--

LOCK TABLES `_prisma_migrations` WRITE;
/*!40000 ALTER TABLE `_prisma_migrations` DISABLE KEYS */;
INSERT INTO `_prisma_migrations` VALUES ('12cb1395-2a55-40c6-8288-6d02c0eebedc','d7f1a92e2f87537184618b835b7dd5d9c24b261cb414cb78a35f85ce04fd5207','2025-07-09 00:00:34.763','20250517211729_test',NULL,NULL,'2025-07-09 00:00:34.508',1),('1e3a712c-399b-4291-a5a7-f3712d4d4fa1','17335cafb320843e71715909ff11df6179a70d0657468a313a7efe1d6049b1a3','2025-07-09 00:00:34.417','20250213110023_conneting',NULL,NULL,'2025-07-09 00:00:34.092',1),('45bef7e7-1f85-41cc-af7d-3c166a35120a','a680a83cda8d146885ea7b2cd499b1871a494bfba9fdfe13bc7161c23f786f17','2025-07-09 00:00:33.506','20250209065852_user',NULL,NULL,'2025-07-09 00:00:33.410',1),('4e396850-eb49-4de0-9107-840a587ed8e1','38848fe103347bda4ab50a92c4b3ee49013d028a9774fbd939ac316a3f0f4da7','2025-07-14 21:48:33.845','20250714214833_add_nickname_to_player',NULL,NULL,'2025-07-14 21:48:33.756',1),('7c45a96a-1bfc-4312-9a6c-f9b87e308bbe','badb187511e3be1c08a45e6802ac8f69fac6c1f4e56fd1c5d98548a0f898d2ae','2025-07-09 00:00:34.502','20250217060206_updatedmilestone',NULL,NULL,'2025-07-09 00:00:34.422',1),('7d153c2f-2352-4cb6-8c15-2890e5d65511','4c434cbbb08473e1846340742663de61b77855ae1a814de658ad79519e16ba66','2025-07-09 00:00:34.086','20250210170217_user',NULL,NULL,'2025-07-09 00:00:33.512',1),('dc255ff8-bb45-4b30-a232-ee328eac069a','201b4d789c27ea318084a903590e9f81256341e653151c6acfd07dc4485ddd45','2025-07-14 21:00:35.706','20250714210034_add_quiz_sessions',NULL,NULL,'2025-07-14 21:00:34.794',1);
/*!40000 ALTER TABLE `_prisma_migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `level`
--

DROP TABLE IF EXISTS `level`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `level` (
  `Level_Id` int NOT NULL AUTO_INCREMENT,
  `Level_Title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Level_number` int NOT NULL,
  PRIMARY KEY (`Level_Id`)
) ENGINE=InnoDB AUTO_INCREMENT=201 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `level`
--

LOCK TABLES `level` WRITE;
/*!40000 ALTER TABLE `level` DISABLE KEYS */;
INSERT INTO `level` VALUES (1,'The First Steps',1),(2,'Basic Understanding',2),(3,'Fundamentals Mastery',4),(4,'Building Knowledge',7),(5,'Expertise Development',12),(6,'Intermediate Proficiency',11),(7,'Refined Understanding',14),(8,'Comprehensive Mastery',18),(9,'Conceptual Expansion',15),(10,'Elite Skill Building',16),(11,'Sharpening Expertise',21),(12,'Pro-Level Insights',17),(13,'Deep Knowledge',19),(14,'Masterclass Concepts',22),(15,'Advanced Challenges',20),(16,'Elite Challenges',29),(17,'High-Level Insights',23),(18,'In-Depth Understanding',31),(19,'Skill Refinement',30),(20,'Strategic Thinking',24),(21,'Deep Diving Challenges',26),(22,'Top-Tier Strategies',39),(23,'Final Countdown',35),(24,'Proficiency Peak',40),(25,'Ultimate Insights',38),(26,'Advanced Problem Solving',32),(27,'Critical Thinking',33),(28,'Advanced Expertise',28),(29,'Pro-Level Mastery',27),(30,'Strategic Mastery',34),(31,'Challenge Extreme',42),(32,'Excellence in Practice',43),(33,'Extreme Challenges',37),(34,'Precision Skills',44),(35,'Supreme Understanding',47),(36,'Final Mastery',41),(37,'Conceptual Excellence',25),(38,'Legendary Learning',46),(39,'Strategic Genius',45),(40,'Path to Mastery',36),(41,'Top Challenge',49),(42,'The Ultimate Test',50),(43,'Ultra Mastery',48),(44,'Intermediate Insights',6),(45,'Advanced Foundations',9),(46,'Mastering the Basics',13),(47,'Challenge Mode',10),(48,'Progressive Learning',8),(49,'Exploring Concepts',3),(50,'Beginning Challenges',5),(51,'Fundamentals Mastery',4),(52,'Intermediate Insights',6),(53,'Beginning Challenges',5),(54,'The First Steps',1),(55,'Building Knowledge',7),(56,'Exploring Concepts',3),(57,'Refined Understanding',14),(58,'Mastering the Basics',13),(59,'Progressive Learning',8),(60,'Expertise Development',12),(61,'Basic Understanding',2),(62,'Intermediate Proficiency',11),(63,'Advanced Foundations',9),(64,'Elite Skill Building',16),(65,'Conceptual Expansion',15),(66,'Challenge Mode',10),(67,'Advanced Challenges',20),(68,'Comprehensive Mastery',18),(69,'Deep Knowledge',19),(70,'Pro-Level Insights',17),(71,'Sharpening Expertise',21),(72,'Deep Diving Challenges',26),(73,'Advanced Expertise',28),(74,'Conceptual Excellence',25),(75,'Pro-Level Mastery',27),(76,'Masterclass Concepts',22),(77,'High-Level Insights',23),(78,'In-Depth Understanding',31),(79,'Elite Challenges',29),(80,'Advanced Problem Solving',32),(81,'Final Countdown',35),(82,'Ultimate Insights',38),(83,'Extreme Challenges',37),(84,'Strategic Mastery',34),(85,'Top-Tier Strategies',39),(86,'Critical Thinking',33),(87,'Strategic Thinking',24),(88,'Path to Mastery',36),(89,'Skill Refinement',30),(90,'Precision Skills',44),(91,'Proficiency Peak',40),(92,'Final Mastery',41),(93,'Excellence in Practice',43),(94,'The Ultimate Test',50),(95,'Legendary Learning',46),(96,'Top Challenge',49),(97,'Supreme Understanding',47),(98,'Challenge Extreme',42),(99,'Strategic Genius',45),(100,'Ultra Mastery',48),(101,'Fundamentals Mastery',4),(102,'Intermediate Proficiency',11),(103,'Building Knowledge',7),(104,'Basic Understanding',2),(105,'Mastering the Basics',13),(106,'Intermediate Insights',6),(107,'Challenge Mode',10),(108,'Exploring Concepts',3),(109,'Advanced Foundations',9),(110,'Progressive Learning',8),(111,'The First Steps',1),(112,'Beginning Challenges',5),(113,'Refined Understanding',14),(114,'Expertise Development',12),(115,'Pro-Level Insights',17),(116,'Advanced Challenges',20),(117,'Conceptual Expansion',15),(118,'High-Level Insights',23),(119,'Strategic Thinking',24),(120,'Masterclass Concepts',22),(121,'Comprehensive Mastery',18),(122,'Deep Knowledge',19),(123,'Elite Skill Building',16),(124,'Sharpening Expertise',21),(125,'Pro-Level Mastery',27),(126,'Deep Diving Challenges',26),(127,'Advanced Expertise',28),(128,'Advanced Problem Solving',32),(129,'In-Depth Understanding',31),(130,'Elite Challenges',29),(131,'Skill Refinement',30),(132,'Ultimate Insights',38),(133,'Final Countdown',35),(134,'Final Mastery',41),(135,'Path to Mastery',36),(136,'Extreme Challenges',37),(137,'Conceptual Excellence',25),(138,'Top-Tier Strategies',39),(139,'Excellence in Practice',43),(140,'Critical Thinking',33),(141,'Supreme Understanding',47),(142,'Legendary Learning',46),(143,'Precision Skills',44),(144,'Strategic Genius',45),(145,'Proficiency Peak',40),(146,'Strategic Mastery',34),(147,'Ultra Mastery',48),(148,'Challenge Extreme',42),(149,'The Ultimate Test',50),(150,'Top Challenge',49),(151,'Basic Understanding',2),(152,'Beginning Challenges',5),(153,'Progressive Learning',8),(154,'Mastering the Basics',13),(155,'Fundamentals Mastery',4),(156,'Refined Understanding',14),(157,'The First Steps',1),(158,'Challenge Mode',10),(159,'Building Knowledge',7),(160,'Intermediate Proficiency',11),(161,'Expertise Development',12),(162,'Advanced Foundations',9),(163,'Exploring Concepts',3),(164,'Conceptual Expansion',15),(165,'Deep Diving Challenges',26),(166,'Intermediate Insights',6),(167,'Conceptual Excellence',25),(168,'Comprehensive Mastery',18),(169,'Elite Challenges',29),(170,'Masterclass Concepts',22),(171,'Deep Knowledge',19),(172,'Elite Skill Building',16),(173,'Advanced Challenges',20),(174,'Sharpening Expertise',21),(175,'Advanced Expertise',28),(176,'Skill Refinement',30),(177,'Pro-Level Mastery',27),(178,'Pro-Level Insights',17),(179,'Critical Thinking',33),(180,'Advanced Problem Solving',32),(181,'Final Countdown',35),(182,'Top-Tier Strategies',39),(183,'High-Level Insights',23),(184,'Extreme Challenges',37),(185,'Path to Mastery',36),(186,'In-Depth Understanding',31),(187,'Excellence in Practice',43),(188,'Ultimate Insights',38),(189,'Precision Skills',44),(190,'Final Mastery',41),(191,'Strategic Thinking',24),(192,'Supreme Understanding',47),(193,'Ultra Mastery',48),(194,'Strategic Mastery',34),(195,'Top Challenge',49),(196,'Legendary Learning',46),(197,'Proficiency Peak',40),(198,'Strategic Genius',45),(199,'The Ultimate Test',50),(200,'Challenge Extreme',42);
/*!40000 ALTER TABLE `level` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `milestone`
--

DROP TABLE IF EXISTS `milestone`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `milestone` (
  `Milestone_Id` int NOT NULL AUTO_INCREMENT,
  `Milestone_Title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Milestone_description` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `UnlockingLevel` int NOT NULL,
  `Milestone_Button_CTA` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Milestone_Link` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Milestone_reward_message` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`Milestone_Id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `milestone`
--

LOCK TABLES `milestone` WRITE;
/*!40000 ALTER TABLE `milestone` DISABLE KEYS */;
INSERT INTO `milestone` VALUES (1,'Quiz Master','Complete 5 quizzes',2,'Continue Journey','/quiz/2','You\'re becoming a quiz master!'),(2,'First Quiz','Complete your first quiz',1,'Start Quiz','/quiz/1','Congratulations on completing your first quiz!'),(3,'First Quiz','Complete your first quiz',1,'Start Quiz','/quiz/1','Congratulations on completing your first quiz!'),(4,'Quiz Master','Complete 5 quizzes',2,'Continue Journey','/quiz/2','You\'re becoming a quiz master!'),(5,'First Quiz','Complete your first quiz',1,'Start Quiz','/quiz/1','Congratulations on completing your first quiz!'),(6,'Quiz Master','Complete 5 quizzes',2,'Continue Journey','/quiz/2','You\'re becoming a quiz master!'),(7,'Quiz Master','Complete 5 quizzes',2,'Continue Journey','/quiz/2','You\'re becoming a quiz master!'),(8,'First Quiz','Complete your first quiz',1,'Start Quiz','/quiz/1','Congratulations on completing your first quiz!');
/*!40000 ALTER TABLE `milestone` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `player`
--

DROP TABLE IF EXISTS `player`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `player` (
  `Player_ID` int NOT NULL AUTO_INCREMENT,
  `Player_name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Playerpoint` int NOT NULL,
  `streak` int NOT NULL,
  `lastLogin` datetime(3) NOT NULL,
  `Level_Id` int DEFAULT NULL,
  `Milestone_Id` int DEFAULT NULL,
  `nickname` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`Player_ID`),
  KEY `player_Level_Id_idx` (`Level_Id`),
  KEY `player_Milestone_Id_idx` (`Milestone_Id`),
  CONSTRAINT `player_Level_Id_fkey` FOREIGN KEY (`Level_Id`) REFERENCES `level` (`Level_Id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `player_Milestone_Id_fkey` FOREIGN KEY (`Milestone_Id`) REFERENCES `milestone` (`Milestone_Id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4506 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `player`
--

LOCK TABLES `player` WRITE;
/*!40000 ALTER TABLE `player` DISABLE KEYS */;
INSERT INTO `player` VALUES (4409,'Anonymous',123005,2,'2025-07-15 04:00:00.000',3,3,'okeNinja402'),(4505,'Anonymous',23255,2,'2025-07-15 04:00:00.000',3,1,'BraveFox695');
/*!40000 ALTER TABLE `player` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `questionprogress`
--

DROP TABLE IF EXISTS `questionprogress`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `questionprogress` (
  `Progress_ID` int NOT NULL AUTO_INCREMENT,
  `Session_ID` int NOT NULL,
  `Question_Index` int NOT NULL,
  `Selected_Answer` int DEFAULT NULL,
  `Is_Correct` tinyint(1) DEFAULT NULL,
  `Time_Taken` int DEFAULT NULL,
  `Used_Hint` tinyint(1) NOT NULL DEFAULT '0',
  `Retry_Count` int NOT NULL DEFAULT '0',
  `Answer_Checked` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`Progress_ID`),
  UNIQUE KEY `QuestionProgress_Session_ID_Question_Index_key` (`Session_ID`,`Question_Index`),
  KEY `QuestionProgress_Session_ID_idx` (`Session_ID`),
  CONSTRAINT `QuestionProgress_Session_ID_fkey` FOREIGN KEY (`Session_ID`) REFERENCES `quizsession` (`Session_ID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `questionprogress`
--

LOCK TABLES `questionprogress` WRITE;
/*!40000 ALTER TABLE `questionprogress` DISABLE KEYS */;
INSERT INTO `questionprogress` VALUES (1,1,0,2,0,4,0,1,1),(2,1,1,1,0,3,0,0,1),(3,1,2,0,0,1,0,0,1),(4,1,3,2,0,1,0,0,1),(5,1,4,0,0,5,0,0,1),(6,1,5,2,0,2,0,0,1),(7,1,6,0,0,3,0,0,1),(8,1,7,1,0,4,0,0,1),(9,1,8,1,0,2,0,0,1),(10,1,9,0,0,6,0,0,1),(11,1,10,-1,0,0,0,0,0),(12,2,0,1,0,1,1,0,1),(13,2,1,2,0,5,0,0,1),(14,2,2,0,0,6,0,2,1),(15,2,3,1,0,4,0,0,1),(16,2,4,2,0,10,0,2,1),(17,2,5,1,0,14,1,1,1),(18,2,6,2,0,5,0,1,1),(19,2,7,1,0,2,1,0,1),(20,2,8,0,0,9,0,2,1),(21,2,9,1,0,1,0,0,1),(22,2,10,-1,0,1,0,0,0),(23,3,0,0,0,13,0,2,1),(24,3,1,2,0,9,0,1,1),(25,3,2,2,0,14,1,2,1),(26,3,3,0,0,3,0,1,1),(27,3,4,2,0,11,0,1,1),(28,3,5,2,0,3,0,0,1),(29,3,6,1,0,14,1,2,1),(30,3,7,1,0,8,0,1,1),(31,3,8,2,0,3,0,1,1),(32,3,9,1,0,0,0,0,1),(33,3,10,-1,0,14,0,0,1);
/*!40000 ALTER TABLE `questionprogress` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `quizsession`
--

DROP TABLE IF EXISTS `quizsession`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `quizsession` (
  `Session_ID` int NOT NULL AUTO_INCREMENT,
  `Player_ID` int NOT NULL,
  `Level_Id` int NOT NULL,
  `Current_Question` int NOT NULL DEFAULT '0',
  `Score` int NOT NULL DEFAULT '0',
  `Total_Questions` int NOT NULL,
  `Completed` tinyint(1) NOT NULL DEFAULT '0',
  `Started_At` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `Last_Activity` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `Time_Spent` int NOT NULL DEFAULT '0',
  `Correct_Answers` int NOT NULL DEFAULT '0',
  `Wrong_Answers` int NOT NULL DEFAULT '0',
  `Streak` int NOT NULL DEFAULT '0',
  `Used_Hints` int NOT NULL DEFAULT '0',
  `Retry_Count` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`Session_ID`),
  UNIQUE KEY `quizSession_Player_ID_Level_Id_key` (`Player_ID`,`Level_Id`),
  KEY `quizSession_Player_ID_idx` (`Player_ID`),
  KEY `quizSession_Level_Id_idx` (`Level_Id`),
  CONSTRAINT `quizSession_Level_Id_fkey` FOREIGN KEY (`Level_Id`) REFERENCES `level` (`Level_Id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `quizSession_Player_ID_fkey` FOREIGN KEY (`Player_ID`) REFERENCES `player` (`Player_ID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `quizsession`
--

LOCK TABLES `quizsession` WRITE;
/*!40000 ALTER TABLE `quizsession` DISABLE KEYS */;
INSERT INTO `quizsession` VALUES (1,4409,1,10,310,10,1,'2025-07-14 21:08:03.186','2025-07-15 18:05:30.239',0,0,0,0,0,0),(2,4409,2,10,175,10,1,'2025-07-14 21:09:28.538','2025-07-15 00:19:00.700',13,2,2,2,0,0),(3,4409,3,9,175,10,0,'2025-07-15 00:19:01.246','2025-07-15 18:05:36.289',0,1,0,1,0,0);
/*!40000 ALTER TABLE `quizsession` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-07-15 14:21:09
