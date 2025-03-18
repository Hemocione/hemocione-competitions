-- AlterTable
ALTER TABLE "competitions" ADD COLUMN     "autoApprove" BOOLEAN DEFAULT false,
ADD COLUMN     "webhook_configs" JSONB;
