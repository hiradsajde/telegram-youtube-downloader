-- CreateTable
CREATE TABLE "User" (
    "id" BIGINT NOT NULL PRIMARY KEY,
    "user_id" INTEGER NOT NULL,
    "last_msg" DATETIME NOT NULL,
    "created_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Request" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" BIGINT NOT NULL,
    "url" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL,
    "completed_at" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_user_id_key" ON "User"("user_id");
