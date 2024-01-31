/*
  Warnings:

  - You are about to drop the column `completed_at` on the `Request` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" BIGINT NOT NULL,
    "last_msg" DATETIME NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_User" ("created_at", "id", "last_msg", "user_id") SELECT "created_at", "id", "last_msg", "user_id" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_user_id_key" ON "User"("user_id");
CREATE TABLE "new_Request" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" BIGINT NOT NULL,
    "video_id" TEXT NOT NULL,
    "bytes" BIGINT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Request" ("bytes", "created_at", "id", "user_id", "video_id") SELECT "bytes", "created_at", "id", "user_id", "video_id" FROM "Request";
DROP TABLE "Request";
ALTER TABLE "new_Request" RENAME TO "Request";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
