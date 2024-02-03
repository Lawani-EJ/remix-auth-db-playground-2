-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Password" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "salt" TEXT NOT NULL,
    "hash" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    CONSTRAINT "Password_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Password" ("accountId", "hash", "id", "salt") SELECT "accountId", "hash", "id", "salt" FROM "Password";
DROP TABLE "Password";
ALTER TABLE "new_Password" RENAME TO "Password";
CREATE UNIQUE INDEX "Password_accountId_key" ON "Password"("accountId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
