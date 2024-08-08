/*
  Warnings:

  - A unique constraint covering the columns `[user_email,competitionTeamId]` on the table `influence` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "influence_user_email_competitionId_key";

-- CreateIndex
CREATE UNIQUE INDEX "influence_user_email_competitionTeamId_key" ON "influence"("user_email", "competitionTeamId");
