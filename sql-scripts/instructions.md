**Populate**

após subir o container do postgres: 

- yarn prisma migrate dev
- docker cp sql-scripts/populate_tables.sql my-postgres:/populate.sql
- docker exec -i my-postgres psql -U postgres -d competitions -f /populate.sql