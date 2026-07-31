-- Migration IDEMPOTENTE de ponta a ponta, de proposito.
--
-- Roda inteira no deploy, via `prisma migrate deploy`. Nao ha runbook manual.
--
-- O CREATE INDEX abaixo e SEM CONCURRENTLY e portanto bloqueia escrita em
-- "donations" enquanto constroi. Isso foi decidido conscientemente: nao ha copa
-- em andamento, a tabela e pequena, e a janela e de segundos — nao vale o custo
-- operacional de um passo manual antes de cada deploy.
--
-- Se algum dia isso rodar com uma copa ativa e tabela grande, o caminho e criar
-- o indice com CONCURRENTLY por fora ANTES do deploy: como todo statement aqui e
-- idempotente, a migration vira no-op e o Prisma a marca como aplicada sem
-- `migrate resolve` na mao.

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
-- Sem CONCURRENTLY: o Prisma envelopa migrations em transacao e o Postgres
-- recusa CREATE INDEX CONCURRENTLY dentro de transacao (erro 25001). O
-- IF NOT EXISTS torna isto no-op onde o indice ja existe — inclusive no banco de
-- dev, onde ele foi criado durante os testes.
CREATE INDEX IF NOT EXISTS "donations_competitionId_kind"
  ON "donations" ("competitionId", "kind");
