INSERT INTO
  competitions (
    name,
    start_at,
    end_at,
    "createdAt",
    "updatedAt",
    published,
    publication_date,
    "extraFields",
    mandatory_proof,
    proof_type,
    slug,
    banner_background,
    has_influence,
    has_likes
  )
VALUES
  (
    'Competição saúdavel entre everson defante e diego zoio',
    '2024-04-03 01:15:17.771699-03',
    '2024-04-10 01:15:17.771699-03',
    '2024-04-03 04:15:17.772',
    '2024-04-03 04:15:17.772',
    true,
    '2024-04-03 01:15:17.771699-03',
    '{}',
    true,
    'selfie',
    'competicao_saudavel_entre_everson_defante_e_diego_zoio',
    'https://i.pinimg.com/736x/8e/d4/04/8ed4040e06e68818a07c3e15ac7c18dc.jpg',
    true,
    true
  ),
  (
    'Competição saudavel entre Serjão dos fuguete e casemiro',
    '2024-04-03 01:17:56.037029-03',
    '2024-04-10 01:17:56.037029-03',
    '2024-04-03 04:17:56.037',
    '2024-04-03 04:17:56.037',
    true,
    '2024-04-03 01:17:56.037029-03',
    '{}',
    true,
    'document',
    'competicao_saudavel_entre_serjao_d',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6wN66SELW_vxFFWDzJDuB5mFnhSNvgDAzag&usqp=CAU',
    false,
    true
  ),
  (
    'IDOR: Enfermagem x Radiologia',
    '2024-04-03 01:17:56.037-03',
    '2030-04-10 01:17:56.037-03',
    '2024-07-03 06:59:12.901',
    '2024-04-03 04:17:56.037',
    true,
    '2024-04-03 01:17:56.037-03',
    NULL,
    false,
    'selfie',
    'competicao_saudavel_entre_caracol_raivoso_e_felipistando',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRu6_84c4JGJLyzwzbsaiSYLllLwN9jGSaK2A&usqp=CAU',
    false,
    false
  );

INSERT INTO
  institutions (name, "createdAt", "updatedAt")
VALUES
  (
    'UnB',
    '2024-04-03 04:09:38.417',
    '2024-04-03 04:09:38.417'
  ),
  (
    'UFBA',
    '2024-04-03 04:09:53.886',
    '2024-04-03 04:09:53.886'
  ),
  (
    'IFB',
    '2024-04-03 04:10:05.939',
    '2024-04-03 04:10:05.939'
  );

INSERT INTO
  teams (name, "institutionId", "createdAt", "updatedAt")
VALUES
  (
    'team forro boys',
    1,
    '2024-04-03 04:10:25.881',
    '2024-04-03 04:10:25.881'
  ),
  (
    'team forro perfeito',
    2,
    '2024-04-03 04:10:39.224',
    '2024-04-03 04:10:39.224'
  ),
  (
    'team forrozão',
    1,
    '2024-04-03 04:10:54.07',
    '2024-04-03 04:10:54.07'
  );

INSERT INTO
  "competitionTeams" (
    donation_count,
    "teamId",
    "competitionId",
    "createdAt",
    "updatedAt"
  )
VALUES
  (
    4,
    2,
    1,
    '2024-04-03 04:19:47.611',
    '2024-04-03 04:19:47.611'
  ),
  (
    5,
    3,
    1,
    '2024-04-03 04:19:55.104',
    '2024-04-03 04:19:55.104'
  ),
  (
    5,
    1,
    1,
    '2024-04-03 04:19:33.812',
    '2024-04-03 06:03:16.306'
  );
