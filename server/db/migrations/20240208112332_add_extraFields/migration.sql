-- AlterTable
ALTER TABLE "competitions" ADD COLUMN     "extraFields" JSONB,
ADD COLUMN     "mandatory_proof" BOOLEAN DEFAULT false;

-- AlterTable
ALTER TABLE "donations" ADD COLUMN     "extraFields" JSONB,
ADD COLUMN     "hemocioneID" VARCHAR(255);
