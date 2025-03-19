-- Först skapar vi _prisma_migrations tabell om den inte redan finns
CREATE TABLE IF NOT EXISTS `_prisma_migrations` (
  `id` VARCHAR(36) NOT NULL,
  `checksum` VARCHAR(64) NOT NULL,
  `finished_at` DATETIME(3) NULL,
  `migration_name` VARCHAR(255) NOT NULL,
  `logs` TEXT NULL,
  `rolled_back_at` DATETIME(3) NULL,
  `started_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `applied_steps_count` INTEGER UNSIGNED NOT NULL DEFAULT 0,
  
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Steg 1: Importera användare (User) först eftersom många andra tabeller refererar till denna
-- Lägg in dina User INSERT-satser här
INSERT INTO `User` VALUES('cm890pehq0000v2yrs19y3p0m','Baljeet','casper.hedar@gmail.com',NULL,'/uploads/4fd6dc60-debb-42a7-a9b3-a1d4c2780881.gif','$2b$10$K0Lv.nJNka9cXaPSeJd8EuV/cm6KOYcAoMlFkukWTcKBc0G.V2qZ.','ADMIN','1741971249565','1742300824123',11);

-- Steg 2: Importera Casino-data, eftersom Favorite refererar till denna
-- Lägg in dina Casino INSERT-satser här
INSERT INTO `Casino` VALUES('starzino','STARZINO','/images/casinos/starzino.png','Stort utbud av slots och live casino spel med snabba utbetalningar.','Up to €1500 + 150 free spins','Welcome package up to €1500 bonus + 150 free spins!',4.2000000000000001776,'https://starzinotracker.com/d86dfc5c0','1742035500425','1742035500425');
INSERT INTO `Casino` VALUES('ggbet','GGBET','/images/casinos/ggbet.png','Stort spelutbud med fokus på esport och sportvadslagning.','Up to €4500 + 275 free spins','100% welcome bonus - up to €4500 + 275 free spins!',4.7000000000000001776,'https://getggbetpromo.com/l/66dee1775f4ba035ee0e43a5','1742035949234','1742035949234');
INSERT INTO `Casino` VALUES('instantcasino','INSTANTCASINO','/images/casinos/instant.png','Cashback-casino med överraskande enkelt koncept och snabba uttag.','10% weekly cashback','10% weekly cashback on all losses!',4.0999999999999996447,'https://record.instantcasinoaffiliates.com/_M3-qV2DN6fYWqcfzuvZcQGNd7ZgqdRLk/1/','1742035953126','1742035953126');
INSERT INTO `Casino` VALUES('hugocasino','HUGO CASINO','/images/casinos/Hugo-Casino_logo.jpg','Populärt casino med många free spins och ett stort spelutbud.','225% up to €600 + 275 spins','225% deposit bonus - up to €600 + 275 free spins!',4.0,'https://hugoredirect.com/d5f1b591b','1742035953914','1742035953914');

-- Steg 3: Importera ForumCategory-data, eftersom Thread refererar till denna
INSERT INTO `ForumCategory` VALUES('cm8d8frbm0002v2bul51x15b1','Betalningsmetoder','Frågor och diskussioner om insättningar, uttag och olika betalningsalternativ','betalningsmetoder',2,'1742226101266','1742246018066');
INSERT INTO `ForumCategory` VALUES('cm8d8frbm0003v2buzw0qyl53','Allmänna diskussioner','Övriga diskussioner relaterade till casino och spel','allmanna-diskussioner',4,'1742226101267','1742226101267');
INSERT INTO `ForumCategory` VALUES('cm8ddcbqy0000v222lfr5j2qs','Casinobonusar Sverige','Diskussion om svenska casinobonusar, villkor och exklusiva erbjudanden.','casinobonusar-sverige',1,'1742234339194','1742246017805');
INSERT INTO `ForumCategory` VALUES('cm8ddngpn0000v2bu40bnxy1g','Bonushunt','Gissa i streamens bonushunt!','bonushunt',4,'1742234858843','1742234858843');

-- Steg 4: Nu kan vi importera Favorite-data eftersom både User och Casino finns
INSERT INTO `Favorite` VALUES('cm8a3pubw0003v2jro39ee1nu','cm890pehq0000v2yrs19y3p0m','instantcasino','1742036775116');
INSERT INTO `Favorite` VALUES('cm8a3pzqm0007v2jrue0o25ci','cm890pehq0000v2yrs19y3p0m','hugocasino','1742036782127');
INSERT INTO `Favorite` VALUES('cm8a4224k0001v2pb5twk2fmg','cm890pehq0000v2yrs19y3p0m','ggbet','1742037345091');
INSERT INTO `Favorite` VALUES('cm8aicpev0001v2j67jdv2tl3','cm890pehq0000v2yrs19y3p0m','starzino','1742061356454');

-- Steg 5: Lägg till Thread-data eftersom User och ForumCategory nu finns
-- Steg 6: Lägg till Post-data eftersom User och Thread nu finns
-- Steg 7: Lägg till Like-data eftersom User och Post nu finns
-- Steg 8: Lägg till Report-data eftersom User och Post nu finns

-- Om du har migrations-data kan du lägga till dessa sist
-- INSERT INTO `_prisma_migrations` ...

-- Anpassa denna fil med ytterligare data från din mysql_data.sql-fil efter behov 