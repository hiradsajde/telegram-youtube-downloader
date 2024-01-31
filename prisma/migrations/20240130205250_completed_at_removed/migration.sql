/*
  Warnings:

  - You are about to drop the column `filesize` on the `Request` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Request" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" BIGINT NOT NULL,
    "video_id" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Request" ("created_at", "id", "user_id", "video_id") SELECT "created_at", "id", "user_id", "video_id" FROM "Request";
DROP TABLE "Request";
ALTER TABLE "new_Request" RENAME TO "Request";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
