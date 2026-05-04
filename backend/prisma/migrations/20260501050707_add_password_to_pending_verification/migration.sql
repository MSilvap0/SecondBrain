/*
  Warnings:

  - Added the required column `password` to the `PendingVerification` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_PendingVerification" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "verificationCode" TEXT NOT NULL,
    "verificationExpiry" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_PendingVerification" ("createdAt", "email", "id", "name", "updatedAt", "verificationCode", "verificationExpiry") SELECT "createdAt", "email", "id", "name", "updatedAt", "verificationCode", "verificationExpiry" FROM "PendingVerification";
DROP TABLE "PendingVerification";
ALTER TABLE "new_PendingVerification" RENAME TO "PendingVerification";
CREATE UNIQUE INDEX "PendingVerification_email_key" ON "PendingVerification"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
