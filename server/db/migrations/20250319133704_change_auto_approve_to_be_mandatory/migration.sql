/*
  Warnings:

  - Made the column `autoApprove` on table `competitions` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "competitions" ALTER COLUMN "autoApprove" SET NOT NULL;
