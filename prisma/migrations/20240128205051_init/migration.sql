/*
  Warnings:

  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `User` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `user_id` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Int` to `BigInt`.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" BIGINT NOT NULL,
    "last_msg" DATETIME NOT NULL,
    "created_at" DATETIME NOT NULL
);
INSERT INTO "new_User" ("created_at", "id", "last_msg", "user_id") SELECT "created_at", "id", "last_msg", "user_id" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_user_id_key" ON "User"("user_id");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
