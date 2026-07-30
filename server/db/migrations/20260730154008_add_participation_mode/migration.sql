-- CreateEnum
CREATE TYPE "CompetitionMode" AS ENUM ('donation', 'participation');

-- CreateEnum
CREATE TYPE "RegistrationKind" AS ENUM ('donation', 'participation');

-- AlterEnum
ALTER TYPE "ProofType" ADD VALUE 'any';

-- AlterTable
ALTER TABLE "competitions" ADD COLUMN     "mode" "CompetitionMode" NOT NULL DEFAULT 'donation';

-- NOTA: o `prisma migrate dev` tambem gerou aqui um
-- `ALTER COLUMN "autoApprove" DROP NOT NULL`, que foi REMOVIDO de proposito.
--
-- Aquilo e drift pre-existente, nao parte desta feature: a migration
-- 20250319190955 criou a coluna como `BOOLEAN NOT NULL DEFAULT true`, enquanto o
-- schema.prisma declara `Boolean?`. Mudar a nulidade de uma coluna de producao
-- que nao tem relacao com esta mudanca nao cabe neste PR — o drift precisa ser
-- resolvido deliberadamente, em mudanca propria.

-- AlterTable
ALTER TABLE "donations" ADD COLUMN     "kind" "RegistrationKind" NOT NULL DEFAULT 'donation',
ADD COLUMN     "proof_metadata" JSONB;

-- CreateIndex
--
-- Sem CONCURRENTLY de proposito: o Prisma envelopa migrations em transacao, e
-- CREATE INDEX CONCURRENTLY nao roda dentro de transacao (Postgres 25001).
--
-- Este CREATE INDEX pega lock que bloqueia ESCRITA em "donations" enquanto
-- constroi. Em producao, aplique o PROD_RUNBOOK.sql deste diretorio ANTES do
-- `prisma migrate deploy`: ele cria o mesmo indice com CONCURRENTLY, e o
-- IF NOT EXISTS abaixo torna esta linha no-op depois — a migration e marcada
-- como aplicada normalmente, sem `migrate resolve` na mao.
CREATE INDEX IF NOT EXISTS "donations_competitionId_kind" ON "donations"("competitionId", "kind");
