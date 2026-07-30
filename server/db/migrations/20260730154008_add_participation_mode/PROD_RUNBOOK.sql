-- RUNBOOK DE PRODUCAO — aplicar via psql ANTES de `prisma migrate deploy`
--
-- POR QUE EXISTE
-- O `migration.sql` cria o indice "donations_competitionId_kind" SEM
-- CONCURRENTLY, porque o Prisma envelopa migrations em transacao e o Postgres
-- recusa CREATE INDEX CONCURRENTLY dentro de transacao (erro 25001). Sem
-- CONCURRENTLY, o CREATE INDEX pega lock que BLOQUEIA ESCRITA em "donations"
-- durante toda a construcao — inaceitavel numa tabela grande no meio de
-- campanha.
--
-- ORDEM IMPORTA
-- Nao da para criar o indice concorrente antes de a coluna "kind" existir.
-- Por isso este runbook e AUTOSSUFICIENTE: cria os tipos, as colunas e so
-- depois o indice concorrente — na ordem certa, tudo idempotente. O
-- `migration.sql` tambem e idempotente, entao depois disto ele vira no-op
-- inteiro e o Prisma marca a migration como aplicada sem `migrate resolve`.
--
-- COMO USAR
--   1. psql < PROD_RUNBOOK.sql        (este arquivo, fora de transacao)
--   2. prisma migrate deploy          (no-op para esta migration)
--
-- NAO envolver em BEGIN/COMMIT: CONCURRENTLY precisa rodar fora de transacao.

-- 1) Tipos. CREATE TYPE nao aceita IF NOT EXISTS, daí o DO block.
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

ALTER TYPE "ProofType" ADD VALUE IF NOT EXISTS 'any';

-- 2) Colunas. ADD COLUMN com DEFAULT e metadata-only a partir do PG 11, entao
--    nao reescreve a tabela — o lock e curto mesmo numa tabela grande.
ALTER TABLE "competitions"
  ADD COLUMN IF NOT EXISTS "mode" "CompetitionMode" NOT NULL DEFAULT 'donation';

ALTER TABLE "donations"
  ADD COLUMN IF NOT EXISTS "kind" "RegistrationKind" NOT NULL DEFAULT 'donation';

ALTER TABLE "donations"
  ADD COLUMN IF NOT EXISTS "proof_metadata" JSONB;

-- 3) Indice, agora que a coluna existe. Fora de transacao, sem bloquear escrita.
CREATE INDEX CONCURRENTLY IF NOT EXISTS "donations_competitionId_kind"
  ON "donations" ("competitionId", "kind");

-- 4) Conferir. Um CONCURRENTLY interrompido deixa indice INVALID, que precisa
--    ser dropado e recriado:
--
--   SELECT i.indisvalid, c.relname
--   FROM pg_index i JOIN pg_class c ON c.oid = i.indexrelid
--   WHERE c.relname = 'donations_competitionId_kind';
