-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "emailVerified" BOOLEAN NOT NULL DEFAULT true,
    "verificationCode" TEXT,
    "verificationExpiry" DATETIME,
    "plan" TEXT NOT NULL DEFAULT 'free',
    "planExpiresAt" DATETIME,
    "ideasLimit" INTEGER NOT NULL DEFAULT 10,
    "ideasCount" INTEGER NOT NULL DEFAULT 0,
    "hasCompletedOnboarding" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_User" ("createdAt", "email", "emailVerified", "id", "ideasCount", "ideasLimit", "name", "password", "plan", "planExpiresAt", "updatedAt", "verificationCode", "verificationExpiry") SELECT "createdAt", "email", "emailVerified", "id", "ideasCount", "ideasLimit", "name", "password", "plan", "planExpiresAt", "updatedAt", "verificationCode", "verificationExpiry" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
