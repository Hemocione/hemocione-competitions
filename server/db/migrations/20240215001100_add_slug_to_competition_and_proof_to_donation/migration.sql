/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `competitions` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "competitions" ADD COLUMN     "slug" VARCHAR(255);

-- AlterTable
ALTER TABLE "donations" ADD COLUMN     "proof" VARCHAR(255);

-- CreateIndex
CREATE UNIQUE INDEX "competitions_slug_key" ON "competitions"("slug");
