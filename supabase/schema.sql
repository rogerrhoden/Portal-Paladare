-- Portal Paladare — schema inicial.
-- Rode este script uma única vez no SQL Editor do Supabase
-- (Project -> SQL Editor -> New query -> colar -> Run).

create extension if not exists pgcrypto;

-- Um registro por rodada da rotina diária: mercado + feed de notícias.
-- Guardamos histórico (uma linha por dia) em vez de sobrescrever, para
-- sempre podermos consultar "qual foi o último valor bom conhecido".
create table if not exists dashboard_snapshot (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  atualizado_em timestamptz not null,
  market jsonb not null,
  feed jsonb not null
);

create index if not exists dashboard_snapshot_created_at_idx
  on dashboard_snapshot (created_at desc);

-- Agenda: feiras/prazos buscados pela rotina + datas adicionadas pelo time.
create table if not exists calendar_items (
  id uuid primary key default gen_random_uuid(),
  start_date date not null,
  end_date date,
  title text not null,
  location text,
  is_deadline boolean not null default false,
  impact text,
  source text not null default 'equipe' check (source in ('equipe', 'automatico')),
  created_at timestamptz not null default now()
);

create index if not exists calendar_items_start_date_idx
  on calendar_items (start_date);

-- Central de estudos: links curados pelo time + sugestões automáticas da rotina.
create table if not exists study_items (
  id uuid primary key default gen_random_uuid(),
  kind text not null,
  title text not null,
  description text not null,
  url text,
  source text not null default 'equipe' check (source in ('equipe', 'automatico')),
  created_at timestamptz not null default now()
);

create index if not exists study_items_created_at_idx
  on study_items (created_at desc);

-- RLS ligado e sem políticas públicas: só a chave secreta (usada exclusivamente
-- no servidor Next.js, nunca no navegador) consegue ler/escrever estas tabelas.
alter table dashboard_snapshot enable row level security;
alter table calendar_items enable row level security;
alter table study_items enable row level security;

-- Datas de feiras já confirmadas — seguro rodar de novo (verifica duplicidade pelo título).
insert into calendar_items (start_date, end_date, title, location, is_deadline, impact, source)
select * from (values
  ('2026-07-31'::date, null::date, 'Prazo — Rodadas EXPOSIBRAM', 'Inscrição · online', true,
    'Última chance de garantir reunião com mineradoras compradoras na feira de agosto.', 'automatico'),
  ('2026-08-24'::date, '2026-08-27'::date, 'EXPOSIBRAM 2026', 'Expominas · Belo Horizonte', false,
    'Maior concentração de decisores de mineração do país — prioridade pro time comercial de catering industrial.', 'automatico'),
  ('2026-09-15'::date, '2026-09-16'::date, 'Congresso Int. Direito Minerário', 'Brasília', false,
    'Bom pra entender regulação de novos projetos de mineração que ainda vão precisar de fornecedor de catering.', 'automatico'),
  ('2026-09-21'::date, '2026-09-24'::date, 'ROG.e — Rio Oil & Gas', 'Riocentro · Rio de Janeiro', false,
    'Principal feira de óleo e gás do Brasil — janela direta pra prospectar operadoras e empresas de sonda offshore.', 'automatico')
) as seed(start_date, end_date, title, location, is_deadline, impact, source)
where not exists (
  select 1 from calendar_items c where c.title = seed.title
);
