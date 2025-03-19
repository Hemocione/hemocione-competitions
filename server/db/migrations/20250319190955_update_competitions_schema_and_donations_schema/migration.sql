-- CreateEnum
CREATE TYPE "ProofValidationStatus" AS ENUM ('pending', 'approved', 'rejected');

-- AlterTable
ALTER TABLE "competitions" ADD COLUMN     "autoApprove" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "webhook_configs" JSONB;

-- AlterTable
ALTER TABLE "donations" ADD COLUMN     "status" "ProofValidationStatus" NOT NULL DEFAULT 'approved';
