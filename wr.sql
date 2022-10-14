-- MySQL dump 10.13  Distrib 8.0.28, for Win64 (x86_64)
--
-- Host: localhost    Database: waterreminder
-- ------------------------------------------------------
-- Server version	8.0.28

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
-- Table structure for table `alarmas`
--

DROP TABLE IF EXISTS `alarmas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `alarmas` (
  `idAlarmas` int NOT NULL AUTO_INCREMENT,
  `hora` varchar(10) DEFAULT NULL,
  `minutos` varchar(10) DEFAULT NULL,
  `Persona_idPersona` int NOT NULL,
  PRIMARY KEY (`idAlarmas`,`Persona_idPersona`),
  KEY `fk_Alarmas_Persona1_idx` (`Persona_idPersona`),
  CONSTRAINT `fk_Alarmas_Persona1` FOREIGN KEY (`Persona_idPersona`) REFERENCES `persona` (`idPersona`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `alarmas`
--

LOCK TABLES `alarmas` WRITE;
/*!40000 ALTER TABLE `alarmas` DISABLE KEYS */;
/*!40000 ALTER TABLE `alarmas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cgrupos`
--

DROP TABLE IF EXISTS `cgrupos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cgrupos` (
  `idCGrupos` int NOT NULL AUTO_INCREMENT,
  `Nombre_Grupo` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`idCGrupos`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cgrupos`
--

LOCK TABLES `cgrupos` WRITE;
/*!40000 ALTER TABLE `cgrupos` DISABLE KEYS */;
/*!40000 ALTER TABLE `cgrupos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `consumo_agua`
--

DROP TABLE IF EXISTS `consumo_agua`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `consumo_agua` (
  `idConsumo_Agua` int NOT NULL AUTO_INCREMENT,
  `Consumo_Total` int DEFAULT NULL,
  `Fecha` date DEFAULT NULL,
  `Persona_idPersona` int NOT NULL,
  `datos_bebida_idRegistro_bebida` int NOT NULL,
  `datos_bebida_CTipo_bebida_idCTipo_bebida` int NOT NULL,
  PRIMARY KEY (`idConsumo_Agua`,`Persona_idPersona`,`datos_bebida_idRegistro_bebida`,`datos_bebida_CTipo_bebida_idCTipo_bebida`),
  KEY `fk_Consumo_Agua_Persona1_idx` (`Persona_idPersona`),
  KEY `fk_consumo_agua_datos_bebida1_idx` (`datos_bebida_idRegistro_bebida`,`datos_bebida_CTipo_bebida_idCTipo_bebida`),
  CONSTRAINT `fk_consumo_agua_datos_bebida1` FOREIGN KEY (`datos_bebida_idRegistro_bebida`, `datos_bebida_CTipo_bebida_idCTipo_bebida`) REFERENCES `datos_bebida` (`idRegistro_bebida`, `CTipo_bebida_idCTipo_bebida`),
  CONSTRAINT `fk_Consumo_Agua_Persona1` FOREIGN KEY (`Persona_idPersona`) REFERENCES `persona` (`idPersona`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `consumo_agua`
--

LOCK TABLES `consumo_agua` WRITE;
/*!40000 ALTER TABLE `consumo_agua` DISABLE KEYS */;
INSERT INTO `consumo_agua` VALUES (1,400,'2022-10-12',1,1,1),(2,600,'2022-10-14',1,1,1),(3,600,NULL,1,1,1);
/*!40000 ALTER TABLE `consumo_agua` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ctipo_bebida`
--

DROP TABLE IF EXISTS `ctipo_bebida`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ctipo_bebida` (
  `idCTipo_bebida` int NOT NULL,
  `tipo_bebida` varchar(45) DEFAULT NULL,
  `nombre_bebida` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`idCTipo_bebida`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ctipo_bebida`
--

LOCK TABLES `ctipo_bebida` WRITE;
/*!40000 ALTER TABLE `ctipo_bebida` DISABLE KEYS */;
INSERT INTO `ctipo_bebida` VALUES (1,'Agua','Agua Natural');
/*!40000 ALTER TABLE `ctipo_bebida` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `datos_bebida`
--

DROP TABLE IF EXISTS `datos_bebida`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `datos_bebida` (
  `idRegistro_bebida` int NOT NULL,
  `agua_bebida` int DEFAULT NULL,
  `cal_bebida` int DEFAULT NULL,
  `azucar_bebida` int DEFAULT NULL,
  `ml` int DEFAULT NULL,
  `CTipo_bebida_idCTipo_bebida` int NOT NULL,
  PRIMARY KEY (`idRegistro_bebida`,`CTipo_bebida_idCTipo_bebida`),
  KEY `fk_Registro_bebida_CTipo_bebida1_idx` (`CTipo_bebida_idCTipo_bebida`),
  CONSTRAINT `fk_Registro_bebida_CTipo_bebida1` FOREIGN KEY (`CTipo_bebida_idCTipo_bebida`) REFERENCES `ctipo_bebida` (`idCTipo_bebida`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `datos_bebida`
--

LOCK TABLES `datos_bebida` WRITE;
/*!40000 ALTER TABLE `datos_bebida` DISABLE KEYS */;
INSERT INTO `datos_bebida` VALUES (1,200,0,0,0,1);
/*!40000 ALTER TABLE `datos_bebida` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `persona`
--

DROP TABLE IF EXISTS `persona`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `persona` (
  `idPersona` int NOT NULL AUTO_INCREMENT,
  `peso` int DEFAULT NULL,
  `altura` varchar(10) DEFAULT NULL,
  `edad` int DEFAULT NULL,
  `meta_agua` varchar(45) DEFAULT NULL,
  `hora_desp` varchar(45) DEFAULT NULL,
  `hora_dormir` varchar(45) DEFAULT NULL,
  `tasa` int DEFAULT NULL,
  `Actividad_fisica` int DEFAULT NULL,
  `Sexo_idsexo` int NOT NULL,
  `Privilegio_idPrivilegio` int NOT NULL,
  `Usuario_idUsuario` int NOT NULL,
  PRIMARY KEY (`idPersona`,`Sexo_idsexo`,`Privilegio_idPrivilegio`,`Usuario_idUsuario`),
  KEY `fk_Persona_Sexo1_idx` (`Sexo_idsexo`),
  KEY `fk_Persona_Privilegio1_idx` (`Privilegio_idPrivilegio`),
  KEY `fk_persona_Usuario1_idx` (`Usuario_idUsuario`),
  CONSTRAINT `fk_Persona_Privilegio1` FOREIGN KEY (`Privilegio_idPrivilegio`) REFERENCES `privilegio` (`idPrivilegio`),
  CONSTRAINT `fk_Persona_Sexo1` FOREIGN KEY (`Sexo_idsexo`) REFERENCES `sexo` (`idsexo`),
  CONSTRAINT `fk_persona_Usuario1` FOREIGN KEY (`Usuario_idUsuario`) REFERENCES `usuario` (`idUsuario`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `persona`
--

LOCK TABLES `persona` WRITE;
/*!40000 ALTER TABLE `persona` DISABLE KEYS */;
INSERT INTO `persona` VALUES (1,60,'160',18,'1800','7','10',400,1,1,1,1);
/*!40000 ALTER TABLE `persona` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `persona_has_cgrupos`
--

DROP TABLE IF EXISTS `persona_has_cgrupos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `persona_has_cgrupos` (
  `Persona-Grupoid` int NOT NULL AUTO_INCREMENT,
  `persona_idPersona` int NOT NULL,
  `CGrupos_idCGrupos` int NOT NULL,
  PRIMARY KEY (`Persona-Grupoid`,`persona_idPersona`,`CGrupos_idCGrupos`),
  KEY `fk_persona_has_CGrupos_CGrupos1_idx` (`CGrupos_idCGrupos`),
  KEY `fk_persona_has_CGrupos_persona1_idx` (`persona_idPersona`),
  CONSTRAINT `fk_persona_has_CGrupos_CGrupos1` FOREIGN KEY (`CGrupos_idCGrupos`) REFERENCES `cgrupos` (`idCGrupos`),
  CONSTRAINT `fk_persona_has_CGrupos_persona1` FOREIGN KEY (`persona_idPersona`) REFERENCES `persona` (`idPersona`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `persona_has_cgrupos`
--

LOCK TABLES `persona_has_cgrupos` WRITE;
/*!40000 ALTER TABLE `persona_has_cgrupos` DISABLE KEYS */;
/*!40000 ALTER TABLE `persona_has_cgrupos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `privilegio`
--

DROP TABLE IF EXISTS `privilegio`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `privilegio` (
  `idPrivilegio` int NOT NULL AUTO_INCREMENT,
  `privilegio` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`idPrivilegio`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `privilegio`
--

LOCK TABLES `privilegio` WRITE;
/*!40000 ALTER TABLE `privilegio` DISABLE KEYS */;
INSERT INTO `privilegio` VALUES (1,'usuario'),(2,'usuario');
/*!40000 ALTER TABLE `privilegio` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sexo`
--

DROP TABLE IF EXISTS `sexo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sexo` (
  `idsexo` int NOT NULL AUTO_INCREMENT,
  `sexo` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`idsexo`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sexo`
--

LOCK TABLES `sexo` WRITE;
/*!40000 ALTER TABLE `sexo` DISABLE KEYS */;
INSERT INTO `sexo` VALUES (1,'hombre'),(2,'mujer'),(3,'maculino');
/*!40000 ALTER TABLE `sexo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuario`
--

DROP TABLE IF EXISTS `usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuario` (
  `idUsuario` int NOT NULL AUTO_INCREMENT,
  `Usuario` varchar(45) DEFAULT NULL,
  `Password` varchar(45) DEFAULT NULL,
  `email` varchar(45) DEFAULT NULL,
  `Sesion` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`idUsuario`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario`
--

LOCK TABLES `usuario` WRITE;
/*!40000 ALTER TABLE `usuario` DISABLE KEYS */;
INSERT INTO `usuario` VALUES (1,'Daniel','123','Polido@gmail.com','0000'),(3,'Nidia','123','nidis@gmail.com','0'),(4,'Rodrigo','123','ro@gmail.com','0'),(17,'Mariana','123','mary@gmail.com','0'),(18,'Edmundo','123','mundis@gmail.com','0'),(19,'Iliana','Cami3105+','lilis@gmail.com','0'),(20,'Camila','Id060704','cami@gmail.com','0'),(21,'Ismael','Cami3105+','ismael21cda@gmail.com','0');
/*!40000 ALTER TABLE `usuario` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-10-14  8:28:48
