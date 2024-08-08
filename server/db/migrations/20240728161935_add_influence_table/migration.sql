-- CreateEnum
CREATE TYPE "ProofType" AS ENUM ('selfie', 'document');

-- AlterTable
ALTER TABLE "competitions" ADD COLUMN     "has_influence" BOOLEAN DEFAULT false;

-- AlterTable
ALTER TABLE "donations" ADD COLUMN     "proofType" "ProofType" DEFAULT 'document';

-- CreateTable
CREATE TABLE "influence" (
    "id" SERIAL NOT NULL,
    "user_email" VARCHAR(255) NOT NULL,
    "hemocioneID" VARCHAR(255) NOT NULL,
    "competitionId" INTEGER NOT NULL,
    "competitionTeamId" INTEGER NOT NULL,
    "amount_of_influence" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "influence_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "influence_user_email_competitionId_key" ON "influence"("user_email", "competitionId");

-- AddForeignKey
ALTER TABLE "influence" ADD CONSTRAINT "influence_competitionId_fkey" FOREIGN KEY ("competitionId") REFERENCES "competitions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "influence" ADD CONSTRAINT "influence_competitionTeamId_fkey" FOREIGN KEY ("competitionTeamId") REFERENCES "competitionTeams"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
