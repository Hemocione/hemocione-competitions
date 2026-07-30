-- Migration IDEMPOTENTE de ponta a ponta, de proposito.
--
-- Em producao o PROD_RUNBOOK.sql deste diretorio deve ser aplicado ANTES do
-- `prisma migrate deploy`: ele cria os mesmos objetos na ordem certa, com
-- CREATE INDEX CONCURRENTLY, que nao bloqueia escrita em "donations". Como todo
-- statement aqui e idempotente, depois do runbook esta migration vira no-op
-- inteira e o Prisma a marca como aplicada sem `migrate resolve` na mao.
--
-- Em dev e CI, onde a tabela e pequena, rodar so esta migration basta.

-- CreateEnum
-- CREATE TYPE nao aceita IF NOT EXISTS, daí o DO block.
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'CompetitionMode') THEN
    CREATE TYPE "CompetitionMode" AS ENUM ('donation', 'participation');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'RegistrationKind') THEN
    CREATE TYPE "RegistrationKind" AS ENUM ('donation', 'participation');
  END IF;
END
$$;

-- AlterEnum
-- Apenas ADICIONA o valor. Usar valor novo de enum na mesma transacao em que ele
-- foi criado e proibido pelo Postgres, entao nada aqui pode referenciar 'any'.
ALTER TYPE "ProofType" ADD VALUE IF NOT EXISTS 'any';

-- AlterTable
-- ADD COLUMN com DEFAULT e metadata-only a partir do PG 11: nao reescreve a
-- tabela, entao o lock e curto.
ALTER TABLE "competitions"
  ADD COLUMN IF NOT EXISTS "mode" "CompetitionMode" NOT NULL DEFAULT 'donation';

-- NOTA: o `prisma migrate dev` tambem gerou aqui um
-- `ALTER COLUMN "autoApprove" DROP NOT NULL`, que foi REMOVIDO de proposito.
--
-- Aquilo e drift pre-existente, nao parte desta feature: a migration
-- 20250319190955 criou a coluna como `BOOLEAN NOT NULL DEFAULT true`, enquanto o
-- schema.prisma declara `Boolean?`. Mudar a nulidade de uma coluna de producao
-- que nao tem relacao com esta mudanca nao cabe neste PR — o drift precisa ser
-- resolvido deliberadamente, em mudanca propria.

-- AlterTable
ALTER TABLE "donations"
  ADD COLUMN IF NOT EXISTS "kind" "RegistrationKind" NOT NULL DEFAULT 'donation';

ALTER TABLE "donations"
  ADD COLUMN IF NOT EXISTS "proof_metadata" JSONB;

-- CreateIndex
-- Sem CONCURRENTLY porque o Prisma envelopa migrations em transacao e o Postgres
-- recusa CREATE INDEX CONCURRENTLY dentro de transacao (25001). Em producao,
-- prefira o PROD_RUNBOOK.sql — ver comentario no topo.
CREATE INDEX IF NOT EXISTS "donations_competitionId_kind"
  ON "donations" ("competitionId", "kind");
