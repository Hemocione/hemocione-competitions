/*
  Warnings:

  - You are about to drop the column `banner_art` on the `competitions` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "competitions" DROP COLUMN "banner_art",
ADD COLUMN     "banner_background" VARCHAR(255);
