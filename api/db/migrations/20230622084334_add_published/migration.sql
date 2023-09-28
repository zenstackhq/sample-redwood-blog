-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Post" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "zenstack_guard" BOOLEAN NOT NULL DEFAULT true,
    "zenstack_transaction" TEXT,
    CONSTRAINT "Post_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Post" ("body", "createdAt", "id", "title", "userId", "zenstack_guard", "zenstack_transaction") SELECT "body", "createdAt", "id", "title", "userId", "zenstack_guard", "zenstack_transaction" FROM "Post";
DROP TABLE "Post";
ALTER TABLE "new_Post" RENAME TO "Post";
CREATE INDEX "Post_zenstack_transaction_idx" ON "Post"("zenstack_transaction");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
