-- CreateTable
CREATE TABLE "likes" (
    "id" SERIAL NOT NULL,
    "hemocioneID" VARCHAR(255) NOT NULL,
    "competitionTeamId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "likes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "likes_hemocioneID_competitionTeamId_key" ON "likes"("hemocioneID", "competitionTeamId");

-- AddForeignKey
ALTER TABLE "likes" ADD CONSTRAINT "likes_competitionTeamId_fkey" FOREIGN KEY ("competitionTeamId") REFERENCES "competitionTeams"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
