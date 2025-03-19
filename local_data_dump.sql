PRAGMA foreign_keys=OFF;
BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS "_prisma_migrations" (
    "id"                    TEXT PRIMARY KEY NOT NULL,
    "checksum"              TEXT NOT NULL,
    "finished_at"           DATETIME,
    "migration_name"        TEXT NOT NULL,
    "logs"                  TEXT,
    "rolled_back_at"        DATETIME,
    "started_at"            DATETIME NOT NULL DEFAULT current_timestamp,
    "applied_steps_count"   INTEGER UNSIGNED NOT NULL DEFAULT 0
);
INSERT INTO _prisma_migrations VALUES('c5df8088-d501-4532-8a3b-30e1031c8873','aaecdb18a936648ddff2e268e155d42967772207b28a331a9b94eeea70acbe9f',1741970753129,'20250314164553_init',NULL,NULL,1741970753121,1);
INSERT INTO _prisma_migrations VALUES('dca4e534-cb2b-4e62-9f04-207355ca9e9e','8cb1fe6273547968b93bd08b8ee719454841f3356841b99266035d7c1b221856',1741972322378,'20250314171202_add_roles_and_password_reset',NULL,NULL,1741972322369,1);
INSERT INTO _prisma_migrations VALUES('dd794e8c-e69c-496e-87c0-ccc63ede26cc','61624f41e6ec4536537b8e1d0b76793a0f2253dcfaada0661c7978b38f11be03',1742040727838,'20250315121207_add_slot_rating',NULL,NULL,1742040727837,1);
INSERT INTO _prisma_migrations VALUES('e185277f-d493-436c-860f-2cdc2064b845','b7c220feadbefa581c1e43a2c7e3978a146673505340cfbea835092da934a72c',1742224658255,'20250317151738_add_forum_models',NULL,NULL,1742224658245,1);
INSERT INTO _prisma_migrations VALUES('64272e1e-8430-4e66-945a-49882b466b44','906d114cd6d42deffcc320033d2eedacd5f8e0bc0248157e7ec99c7b1a13cdc2',1742235536014,'20250317181856_add_reports',NULL,NULL,1742235536012,1);
INSERT INTO _prisma_migrations VALUES('dc6c99de-4730-42ce-90c1-0d279591cfdd','701904feccc39c8c30b5f1ddf2ec784942eb6798ffe14cf258a42583f424fcce',1742235889352,'20250317182449_make_thread_content_optional',NULL,NULL,1742235889347,1);
INSERT INTO _prisma_migrations VALUES('46a03613-0076-46bf-aee2-276f983fb55d','c5de22b4fef15c08a2909d411c6cdb37f4f205bc208b12ed67be9cd482e1885c',1742235990552,'20250317182630_remove_thread_content',NULL,NULL,1742235990549,1);
INSERT INTO _prisma_migrations VALUES('0acee9e4-bf0c-4be8-b654-0b495e1cd933','5894f1f2762f1c7f9101a67271ebc644d2d6cba657c69deba4e35ea3da44655c',1742242148594,'20250317200908_add_accepted_post_to_thread',NULL,NULL,1742242148592,1);
CREATE TABLE IF NOT EXISTS "Account" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE TABLE IF NOT EXISTS "Session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" DATETIME NOT NULL,
    CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE TABLE IF NOT EXISTS "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" DATETIME NOT NULL
);
CREATE TABLE IF NOT EXISTS "PasswordReset" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" DATETIME NOT NULL,
    CONSTRAINT "PasswordReset_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE TABLE IF NOT EXISTS "Casino" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "logo" TEXT,
    "description" TEXT,
    "bonus" TEXT,
    "bonusAmount" TEXT,
    "rating" REAL,
    "url" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO Casino VALUES('starzino','STARZINO','/images/casinos/starzino.png','Stort utbud av slots och live casino spel med snabba utbetalningar.','Up to €1500 + 150 free spins','Welcome package up to €1500 bonus + 150 free spins!',4.2000000000000001776,'https://starzinotracker.com/d86dfc5c0',1742035500425,1742035500425);
INSERT INTO Casino VALUES('ggbet','GGBET','/images/casinos/ggbet.png','Stort spelutbud med fokus på esport och sportvadslagning.','Up to €4500 + 275 free spins','100% welcome bonus - up to €4500 + 275 free spins!',4.7000000000000001776,'https://getggbetpromo.com/l/66dee1775f4ba035ee0e43a5',1742035949234,1742035949234);
INSERT INTO Casino VALUES('instantcasino','INSTANTCASINO','/images/casinos/instant.png','Cashback-casino med överraskande enkelt koncept och snabba uttag.','10% weekly cashback','10% weekly cashback on all losses!',4.0999999999999996447,'https://record.instantcasinoaffiliates.com/_M3-qV2DN6fYWqcfzuvZcQGNd7ZgqdRLk/1/',1742035953126,1742035953126);
INSERT INTO Casino VALUES('hugocasino','HUGO CASINO','/images/casinos/Hugo-Casino_logo.jpg','Populärt casino med många free spins och ett stort spelutbud.','225% up to €600 + 275 spins','225% deposit bonus - up to €600 + 275 free spins!',4.0,'https://hugoredirect.com/d5f1b591b',1742035953914,1742035953914);
CREATE TABLE IF NOT EXISTS "Favorite" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "casinoId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Favorite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Favorite_casinoId_fkey" FOREIGN KEY ("casinoId") REFERENCES "Casino" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO Favorite VALUES('cm8a3pubw0003v2jro39ee1nu','cm890pehq0000v2yrs19y3p0m','instantcasino',1742036775116);
INSERT INTO Favorite VALUES('cm8a3pzqm0007v2jrue0o25ci','cm890pehq0000v2yrs19y3p0m','hugocasino',1742036782127);
INSERT INTO Favorite VALUES('cm8a4224k0001v2pb5twk2fmg','cm890pehq0000v2yrs19y3p0m','ggbet',1742037345091);
INSERT INTO Favorite VALUES('cm8aicpev0001v2j67jdv2tl3','cm890pehq0000v2yrs19y3p0m','starzino',1742061356454);
CREATE TABLE IF NOT EXISTS "SlotRating" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "slotId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "SlotRating_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE TABLE IF NOT EXISTS "ForumCategory" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "slug" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO ForumCategory VALUES('cm8d8frbm0002v2bul51x15b1','Betalningsmetoder','Frågor och diskussioner om insättningar, uttag och olika betalningsalternativ','betalningsmetoder',2,1742226101266,1742246018066);
INSERT INTO ForumCategory VALUES('cm8d8frbm0003v2buzw0qyl53','Allmänna diskussioner','Övriga diskussioner relaterade till casino och spel','allmanna-diskussioner',4,1742226101267,1742226101267);
INSERT INTO ForumCategory VALUES('cm8ddcbqy0000v222lfr5j2qs','Casinobonusar Sverige','Diskussion om svenska casinobonusar, villkor och exklusiva erbjudanden.','casinobonusar-sverige',1,1742234339194,1742246017805);
INSERT INTO ForumCategory VALUES('cm8ddngpn0000v2bu40bnxy1g','Bonushunt','Gissa i streamens bonushunt!','bonushunt',4,1742234858843,1742234858843);
CREATE TABLE IF NOT EXISTS "Post" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "content" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "authorId" TEXT NOT NULL,
    "threadId" TEXT NOT NULL,
    "isEdited" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "Post_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Post_threadId_fkey" FOREIGN KEY ("threadId") REFERENCES "Thread" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO Post VALUES('cm8de2tvm0004v2burz5tcq85','<p>kiasdasd</p>',1742235575746,1742235575746,'cm890pehq0000v2yrs19y3p0m','cm8de2tvk0002v2bu0dmsdz0f',0);
INSERT INTO Post VALUES('cm8eawj2t0003v2kxd9z5uqtx','<p>testsetsetsetse</p>',1742290709141,1742290709141,'cm890pehq0000v2yrs19y3p0m','cm8eawj220001v2kx8x9v1zdm',0);
CREATE TABLE IF NOT EXISTS "Like" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    CONSTRAINT "Like_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Like_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE TABLE IF NOT EXISTS "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" DATETIME,
    "image" TEXT,
    "password" TEXT,
    "role" TEXT NOT NULL DEFAULT 'USER',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "reputation" INTEGER NOT NULL DEFAULT 0
);
INSERT INTO User VALUES('cm890pehq0000v2yrs19y3p0m','Baljeet','casper.hedar@gmail.com',NULL,'/uploads/4fd6dc60-debb-42a7-a9b3-a1d4c2780881.gif','$2b$10$K0Lv.nJNka9cXaPSeJd8EuV/cm6KOYcAoMlFkukWTcKBc0G.V2qZ.','ADMIN',1741971249565,1742300824123,11);
INSERT INTO User VALUES('110222670010316714001','Slot Skolan','slotskolan@gmail.com',NULL,'https://lh3.googleusercontent.com/a/ACg8ocL0v_VCpa9l4B_wxm4gKcn9k5nN58parx4RHtSdZ8HhL3iEFQ=s96-c',NULL,'USER',1742241736364,1742242507934,2);
CREATE TABLE IF NOT EXISTS "Report" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "reason" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "userId" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "resolvedById" TEXT,
    "resolvedAt" DATETIME,
    "resolution" TEXT,
    CONSTRAINT "Report_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Report_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Report_resolvedById_fkey" FOREIGN KEY ("resolvedById") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
CREATE TABLE IF NOT EXISTS "Thread" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "isSticky" BOOLEAN NOT NULL DEFAULT false,
    "isLocked" BOOLEAN NOT NULL DEFAULT false,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "authorId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "lastPostAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastPostById" TEXT, "acceptedPostId" TEXT,
    CONSTRAINT "Thread_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Thread_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "ForumCategory" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO Thread VALUES('cm8de2tvk0002v2bu0dmsdz0f','hejsan','hejsan-35575742',1742235575743,1742299536945,0,0,19,'cm890pehq0000v2yrs19y3p0m','cm8d8frbm0002v2bul51x15b1',1742235575743,NULL,NULL);
INSERT INTO Thread VALUES('cm8eawj220001v2kx8x9v1zdm','hejtest','hejtest-90709091',1742290709097,1742306215126,0,0,31,'cm890pehq0000v2yrs19y3p0m','cm8ddcbqy0000v222lfr5j2qs',1742300824117,'cm890pehq0000v2yrs19y3p0m',NULL);
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");
CREATE UNIQUE INDEX "Favorite_userId_casinoId_key" ON "Favorite"("userId", "casinoId");
CREATE UNIQUE INDEX "PasswordReset_userId_key" ON "PasswordReset"("userId");
CREATE UNIQUE INDEX "PasswordReset_token_key" ON "PasswordReset"("token");
CREATE UNIQUE INDEX "SlotRating_userId_slotId_key" ON "SlotRating"("userId", "slotId");
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "ForumCategory_slug_key" ON "ForumCategory"("slug");
CREATE UNIQUE INDEX "Like_userId_postId_key" ON "Like"("userId", "postId");
CREATE UNIQUE INDEX "Thread_slug_key" ON "Thread"("slug");
COMMIT;
