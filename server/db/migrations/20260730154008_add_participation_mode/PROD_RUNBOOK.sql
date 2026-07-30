-- RUNBOOK DE PRODUCAO — aplicar ANTES de `prisma migrate deploy`
--
-- Por que existe: o `migration.sql` cria o indice
-- "donations_competitionId_kind" SEM CONCURRENTLY, porque o Prisma envelopa
-- migrations em transacao e o Postgres recusa CREATE INDEX CONCURRENTLY dentro
-- de transacao (erro 25001). Sem CONCURRENTLY, o CREATE INDEX pega um lock que
-- BLOQUEIA ESCRITA em "donations" durante toda a construcao — inaceitavel numa
-- tabela grande no meio de campanha.
--
-- Como usar:
--   1. rodar este arquivo via psql, fora de transacao, ANTES do deploy
--   2. depois rodar o `prisma migrate deploy` normalmente
--
-- O `IF NOT EXISTS` no migration.sql torna a criacao do indice no-op depois
-- disso, e a migration e marcada como aplicada sem `migrate resolve` manual.
--
-- Nao envolver em BEGIN/COMMIT: CONCURRENTLY precisa rodar fora de transacao.

CREATE INDEX CONCURRENTLY IF NOT EXISTS "donations_competitionId_kind"
  ON "donations" ("competitionId", "kind");

-- Conferir que ficou valido (um CONCURRENTLY interrompido deixa indice INVALID,
-- que precisa ser dropado e recriado):
--
--   SELECT i.indisvalid, c.relname
--   FROM pg_index i JOIN pg_class c ON c.oid = i.indexrelid
--   WHERE c.relname = 'donations_competitionId_kind';
