-- AlterTable
ALTER TABLE "influence" ADD COLUMN     "competitionTeamId" INTEGER;

-- AddForeignKey
ALTER TABLE "influence" ADD CONSTRAINT "influence_competitionTeamId_fkey" FOREIGN KEY ("competitionTeamId") REFERENCES "competitionTeams"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
