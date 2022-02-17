BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS `storageroom` (
	`id`	INTEGER PRIMARY KEY AUTOINCREMENT,
	`item`	TEXT,
	`itemtype`	TEXT,
	`count`	INTEGER,
	`unit`	TEXT,
	`state`	TEXT,
	`operator`	TEXT,
	`borrower`	TEXT,
	`time`	TEXT,
	`date`	TEXT
);
CREATE TABLE IF NOT EXISTS `record` (
	`id`	INTEGER PRIMARY KEY AUTOINCREMENT,
	`item`	TEXT,
	`itemtype`	TEXT,
	`count`	INTEGER,
	`unit`	TEXT,
	`totalprice`	INTEGER,
	`rider`	TEXT,
	`branch`	TEXT,
	`action`	TEXT,
	`operator`	TEXT,
	`borrower`	TEXT,
	`time`	TEXT,
	`date`	TEXT
);
CREATE TABLE IF NOT EXISTS `pricelist` (
	`id`	INTEGER PRIMARY KEY AUTOINCREMENT,
	`item`	TEXT,
	`price`	INTEGER,
	`time`	TEXT,
	`date`	TEXT
);
INSERT INTO `pricelist` VALUES (7,'Ham And Cheese',10,NULL,NULL);
INSERT INTO `pricelist` VALUES (8,'Coco Balunan',5,NULL,NULL);
INSERT INTO `pricelist` VALUES (9,'Putok',5,NULL,NULL);
INSERT INTO `pricelist` VALUES (10,'Kababayan',2,NULL,NULL);
INSERT INTO `pricelist` VALUES (11,'EggPie',15,NULL,NULL);
INSERT INTO `pricelist` VALUES (12,'Crinkles',3,NULL,NULL);
INSERT INTO `pricelist` VALUES (13,'Brownies',3,NULL,NULL);
INSERT INTO `pricelist` VALUES (14,'Ube Bar',3,NULL,NULL);
INSERT INTO `pricelist` VALUES (15,'Polvoron',3,NULL,NULL);
INSERT INTO `pricelist` VALUES (16,'Cookies',3,NULL,NULL);
INSERT INTO `pricelist` VALUES (17,'Black Forest',25,NULL,NULL);
INSERT INTO `pricelist` VALUES (18,'Yema Cake',25,NULL,NULL);
INSERT INTO `pricelist` VALUES (19,'Caramel Cake',25,NULL,NULL);
INSERT INTO `pricelist` VALUES (20,'Custard',35,NULL,NULL);
INSERT INTO `pricelist` VALUES (21,'Half Moon',35,NULL,NULL);
INSERT INTO `pricelist` VALUES (22,'White/Ube Roll',15,NULL,NULL);
INSERT INTO `pricelist` VALUES (24,'Triangle',12,NULL,NULL);
INSERT INTO `pricelist` VALUES (25,'Inipit',12,NULL,NULL);
INSERT INTO `pricelist` VALUES (26,'Pianono',12,NULL,NULL);
INSERT INTO `pricelist` VALUES (27,'Mamon',10,NULL,NULL);
INSERT INTO `pricelist` VALUES (28,'Caramel/Yema Roll',20,NULL,NULL);
INSERT INTO `pricelist` VALUES (29,'Brazo De Mercedes',20,NULL,NULL);
INSERT INTO `pricelist` VALUES (30,'Macaroons',5,NULL,NULL);
INSERT INTO `pricelist` VALUES (31,'Pandesal',2,NULL,NULL);
INSERT INTO `pricelist` VALUES (32,'Burger Buns (s)',5,NULL,NULL);
INSERT INTO `pricelist` VALUES (33,'Burger Buns (m)',10,NULL,NULL);
INSERT INTO `pricelist` VALUES (34,'Burger Buns (L)',20,NULL,NULL);
INSERT INTO `pricelist` VALUES (35,'Tasty',35,NULL,NULL);
INSERT INTO `pricelist` VALUES (36,'Pagong',20,NULL,NULL);
INSERT INTO `pricelist` VALUES (37,'Donut (s)',2,NULL,NULL);
INSERT INTO `pricelist` VALUES (38,'Donut (m)',5,NULL,NULL);
INSERT INTO `pricelist` VALUES (39,'Cheese Bread (s)',2,NULL,NULL);
INSERT INTO `pricelist` VALUES (40,'Cheese Bread (m)',5,NULL,NULL);
INSERT INTO `pricelist` VALUES (41,'Pan De Coco (s)',2,NULL,NULL);
INSERT INTO `pricelist` VALUES (42,'Pan De Coco (m)',5,NULL,NULL);
CREATE TABLE IF NOT EXISTS `operators` (
	`id`	INTEGER PRIMARY KEY AUTOINCREMENT,
	`username`	TEXT,
	`password`	TEXT,
	`position`	INTEGER
);
INSERT INTO `operators` VALUES (3,'admin','admin','ADMIN');
INSERT INTO `operators` VALUES (5,'user','user','OPERATOR');
CREATE TABLE IF NOT EXISTS `miniitem` (
	`id`	INTEGER PRIMARY KEY AUTOINCREMENT,
	`item`	TEXT,
	`type`	TEXT
);
CREATE TABLE IF NOT EXISTS `breadroom` (
	`id`	INTEGER PRIMARY KEY AUTOINCREMENT,
	`item`	TEXT,
	`count`	INTEGER,
	`unit`	TEXT,
	`time`	TEXT,
	`date`	TEXT
);
CREATE TABLE IF NOT EXISTS `availableitem` (
	`id`	INTEGER PRIMARY KEY AUTOINCREMENT,
	`item`	TEXT,
	`count`	INTEGER,
	`unit`	TEXT,
	`time`	TEXT,
	`date`	TEXT
);
COMMIT;
