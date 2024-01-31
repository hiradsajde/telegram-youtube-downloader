/*
  Warnings:

  - You are about to drop the column `bytes` on the `Request` table. All the data in the column will be lost.
  - Added the required column `filesize` to the `Request` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Request" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" BIGINT NOT NULL,
    "video_id" TEXT NOT NULL,
    "filesize" BIGINT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Request" ("created_at", "id", "user_id", "video_id") SELECT "created_at", "id", "user_id", "video_id" FROM "Request";
DROP TABLE "Request";
ALTER TABLE "new_Request" RENAME TO "Request";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
