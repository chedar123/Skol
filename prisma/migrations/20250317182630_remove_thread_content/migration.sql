/*
  Warnings:

  - You are about to drop the column `content` on the `Thread` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Thread" (
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
    "lastPostById" TEXT,
    CONSTRAINT "Thread_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Thread_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "ForumCategory" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Thread" ("authorId", "categoryId", "createdAt", "id", "isLocked", "isSticky", "lastPostAt", "lastPostById", "slug", "title", "updatedAt", "viewCount") SELECT "authorId", "categoryId", "createdAt", "id", "isLocked", "isSticky", "lastPostAt", "lastPostById", "slug", "title", "updatedAt", "viewCount" FROM "Thread";
DROP TABLE "Thread";
ALTER TABLE "new_Thread" RENAME TO "Thread";
CREATE UNIQUE INDEX "Thread_slug_key" ON "Thread"("slug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
