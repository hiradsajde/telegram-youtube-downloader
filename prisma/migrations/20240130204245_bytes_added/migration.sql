/*
  Warnings:

  - You are about to drop the column `url` on the `Request` table. All the data in the column will be lost.
  - Added the required column `bytes` to the `Request` table without a default value. This is not possible if the table is not empty.
  - Added the required column `video_id` to the `Request` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Request" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" BIGINT NOT NULL,
    "video_id" TEXT NOT NULL,
    "bytes" BIGINT NOT NULL,
    "created_at" DATETIME NOT NULL,
    "completed_at" DATETIME NOT NULL
);
INSERT INTO "new_Request" ("completed_at", "created_at", "id", "user_id") SELECT "completed_at", "created_at", "id", "user_id" FROM "Request";
DROP TABLE "Request";
ALTER TABLE "new_Request" RENAME TO "Request";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
