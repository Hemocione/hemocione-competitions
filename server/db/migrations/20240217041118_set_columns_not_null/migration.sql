/*
  Warnings:

  - Made the column `teamId` on table `competitionTeams` required. This step will fail if there are existing NULL values in that column.
  - Made the column `competitionId` on table `competitionTeams` required. This step will fail if there are existing NULL values in that column.
  - Made the column `name` on table `competitions` required. This step will fail if there are existing NULL values in that column.
  - Made the column `start_at` on table `competitions` required. This step will fail if there are existing NULL values in that column.
  - Made the column `end_at` on table `competitions` required. This step will fail if there are existing NULL values in that column.
  - Made the column `slug` on table `competitions` required. This step will fail if there are existing NULL values in that column.
  - Made the column `competitionTeamId` on table `donations` required. This step will fail if there are existing NULL values in that column.
  - Made the column `competitionId` on table `donations` required. This step will fail if there are existing NULL values in that column.
  - Made the column `name` on table `institutions` required. This step will fail if there are existing NULL values in that column.
  - Made the column `name` on table `teams` required. This step will fail if there are existing NULL values in that column.
  - Made the column `institutionId` on table `teams` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "competitionTeams" ALTER COLUMN "teamId" SET NOT NULL,
ALTER COLUMN "competitionId" SET NOT NULL;

-- AlterTable
ALTER TABLE "competitions" ALTER COLUMN "name" SET NOT NULL,
ALTER COLUMN "start_at" SET NOT NULL,
ALTER COLUMN "end_at" SET NOT NULL,
ALTER COLUMN "slug" SET NOT NULL;

-- AlterTable
ALTER TABLE "donations" ALTER COLUMN "competitionTeamId" SET NOT NULL,
ALTER COLUMN "competitionId" SET NOT NULL;

-- AlterTable
ALTER TABLE "institutions" ALTER COLUMN "name" SET NOT NULL;

-- AlterTable
ALTER TABLE "teams" ALTER COLUMN "name" SET NOT NULL,
ALTER COLUMN "institutionId" SET NOT NULL;
