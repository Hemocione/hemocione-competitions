/*
  Warnings:

  - You are about to drop the column `amount_of_influence` on the `influence` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "influence" DROP COLUMN "amount_of_influence",
ADD COLUMN     "amountInfluence" INTEGER NOT NULL DEFAULT 0;
