/*
  Warnings:

  - You are about to drop the column `competitionTeamsId` on the `influence` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "influence" DROP CONSTRAINT "influence_competitionTeamsId_fkey";

-- AlterTable
ALTER TABLE "influence" DROP COLUMN "competitionTeamsId";
