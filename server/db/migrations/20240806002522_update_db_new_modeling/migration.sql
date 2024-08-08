/*
  Warnings:

  - You are about to drop the column `amountEngagement` on the `competitionTeams` table. All the data in the column will be lost.
  - You are about to drop the column `proofType` on the `donations` table. All the data in the column will be lost.
  - You are about to drop the column `competitionTeamId` on the `influence` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[hemocioneID,competitionId]` on the table `influence` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[code,competitionId]` on the table `influence` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `code` to the `influence` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_name` to the `influence` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "influence" DROP CONSTRAINT "influence_competitionTeamId_fkey";

-- DropIndex
DROP INDEX "influence_user_email_competitionTeamId_key";

-- AlterTable
ALTER TABLE "competitionTeams" DROP COLUMN "amountEngagement",
ADD COLUMN     "amountLikes" INTEGER DEFAULT 0;

-- AlterTable
ALTER TABLE "competitions" ADD COLUMN     "has_likes" BOOLEAN DEFAULT false,
ADD COLUMN     "proof_type" "ProofType" DEFAULT 'selfie';

-- AlterTable
ALTER TABLE "donations" DROP COLUMN "proofType",
ADD COLUMN     "influenceId" INTEGER;

-- AlterTable
ALTER TABLE "influence" DROP COLUMN "competitionTeamId",
ADD COLUMN     "code" VARCHAR(255) NOT NULL,
ADD COLUMN     "competitionTeamsId" INTEGER,
ADD COLUMN     "user_name" VARCHAR(255) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "influence_hemocioneID_competitionId_key" ON "influence"("hemocioneID", "competitionId");

-- CreateIndex
CREATE UNIQUE INDEX "influence_code_competitionId_key" ON "influence"("code", "competitionId");

-- AddForeignKey
ALTER TABLE "donations" ADD CONSTRAINT "donations_influenceId_fkey" FOREIGN KEY ("influenceId") REFERENCES "influence"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "influence" ADD CONSTRAINT "influence_competitionTeamsId_fkey" FOREIGN KEY ("competitionTeamsId") REFERENCES "competitionTeams"("id") ON DELETE SET NULL ON UPDATE CASCADE;
