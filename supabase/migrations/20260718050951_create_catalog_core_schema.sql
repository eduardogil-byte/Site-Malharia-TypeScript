-- ============================================================
-- SCHEMA PRIVADO
-- ============================================================

create schema if not exists private;

revoke all on schema private from public;
revoke all on schema private from anon, authenticated;


-- ============================================================
-- FUNÇÃO PARA ATUALIZAR updated_at
-- ============================================================

create or replace function private.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at = pg_catalog.now();
  return new;
end;
$$;

revoke all
on function private.set_updated_at()
from public, anon, authenticated;


-- ============================================================
-- ADMINISTRADORES
-- ============================================================

create table private.administradores (
  user_id uuid primary key
    references auth.users(id)
    on delete cascade,

  nome text not null,

  created_at timestamptz not null
    default pg_catalog.now(),

  constraint administradores_nome_valido
    check (
      pg_catalog.char_length(pg_catalog.btrim(nome))
      between 2 and 150
    )
);


-- ============================================================
-- LOGS DE AUDITORIA
-- ============================================================

create table private.logs_auditoria (
  id bigint generated always as identity primary key,

  actor_id uuid
    references auth.users(id)
    on delete set null,

  acao text not null,
  entidade text not null,
  entidade_id text,

  dados_anteriores jsonb,
  dados_novos jsonb,

  created_at timestamptz not null
    default pg_catalog.now(),

  constraint logs_acao_valida
    check (
      pg_catalog.char_length(pg_catalog.btrim(acao))
      between 2 and 100
    ),

  constraint logs_entidade_valida
    check (
      pg_catalog.char_length(pg_catalog.btrim(entidade))
      between 2 and 100
    )
);


-- ============================================================
-- CATEGORIAS
-- ============================================================

create table public.categorias (
  id uuid primary key
    default gen_random_uuid(),

  nome text not null,
  slug text not null unique,
  descricao text,

  ativa boolean not null
    default true,

  posicao integer not null,

  created_at timestamptz not null
    default pg_catalog.now(),

  updated_at timestamptz not null
    default pg_catalog.now(),

  constraint categorias_nome_valido
    check (
      pg_catalog.char_length(pg_catalog.btrim(nome))
      between 2 and 100
    ),

  constraint categorias_slug_valido
    check (
      slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'
    ),

  constraint categorias_posicao_positiva
    check (posicao > 0),

  constraint categorias_posicao_unica
    unique (posicao)
    deferrable initially deferred
);

create unique index categorias_nome_unico_ci
  on public.categorias (
    pg_catalog.lower(nome)
  );


-- ============================================================
-- PRODUTOS
-- ============================================================

create table public.produtos (
  id uuid primary key
    default gen_random_uuid(),

  categoria_id uuid not null
    references public.categorias(id)
    on delete restrict,

  nome text not null,
  slug text not null unique,

  descricao_curta text,
  descricao text,

  status text not null
    default 'rascunho',

  disponivel boolean not null
    default true,

  atributos jsonb not null
    default '{}'::jsonb,

  mensagem_whatsapp text,

  created_by uuid
    references auth.users(id)
    on delete set null,

  updated_by uuid
    references auth.users(id)
    on delete set null,

  created_at timestamptz not null
    default pg_catalog.now(),

  updated_at timestamptz not null
    default pg_catalog.now(),

  constraint produtos_nome_valido
    check (
      pg_catalog.char_length(pg_catalog.btrim(nome))
      between 2 and 150
    ),

  constraint produtos_slug_valido
    check (
      slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'
    ),

  constraint produtos_descricao_curta_limite
    check (
      descricao_curta is null
      or pg_catalog.char_length(descricao_curta) <= 300
    ),

  constraint produtos_status_valido
    check (
      status in (
        'rascunho',
        'publicado',
        'arquivado'
      )
    ),

  constraint produtos_atributos_objeto
    check (
      pg_catalog.jsonb_typeof(atributos) = 'object'
    )
);


-- ============================================================
-- IMAGENS DOS PRODUTOS
-- ============================================================

create table public.produto_imagens (
  id uuid primary key
    default gen_random_uuid(),

  produto_id uuid not null
    references public.produtos(id)
    on delete cascade,

  storage_path text not null unique,
  alt_text text,

  posicao integer not null,

  created_at timestamptz not null
    default pg_catalog.now(),

  constraint produto_imagens_path_valido
    check (
      pg_catalog.char_length(
        pg_catalog.btrim(storage_path)
      ) > 0
    ),

  constraint produto_imagens_alt_text_limite
    check (
      alt_text is null
      or pg_catalog.char_length(alt_text) <= 200
    ),

  constraint produto_imagens_posicao_positiva
    check (posicao > 0),

  constraint produto_imagens_posicao_unica
    unique (produto_id, posicao)
    deferrable initially deferred
);


-- ============================================================
-- SEÇÕES DA PÁGINA INICIAL
-- ============================================================

create table public.secoes_home (
  id uuid primary key
    default gen_random_uuid(),

  titulo text not null,
  subtitulo text,
  slug text not null unique,

  ativa boolean not null
    default true,

  posicao integer not null,

  limite_produtos integer not null
    default 4,

  created_at timestamptz not null
    default pg_catalog.now(),

  updated_at timestamptz not null
    default pg_catalog.now(),

  constraint secoes_home_titulo_valido
    check (
      pg_catalog.char_length(
        pg_catalog.btrim(titulo)
      ) between 2 and 150
    ),

  constraint secoes_home_slug_valido
    check (
      slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'
    ),

  constraint secoes_home_subtitulo_limite
    check (
      subtitulo is null
      or pg_catalog.char_length(subtitulo) <= 300
    ),

  constraint secoes_home_posicao_positiva
    check (posicao > 0),

  constraint secoes_home_limite_produtos
    check (
      limite_produtos between 1 and 20
    ),

  constraint secoes_home_posicao_unica
    unique (posicao)
    deferrable initially deferred
);


-- ============================================================
-- PRODUTOS DAS SEÇÕES DA HOME
-- ============================================================

create table public.home_secao_produtos (
  secao_id uuid not null
    references public.secoes_home(id)
    on delete cascade,

  produto_id uuid not null
    references public.produtos(id)
    on delete cascade,

  posicao integer not null,

  created_at timestamptz not null
    default pg_catalog.now(),

  primary key (secao_id, produto_id),

  constraint home_secao_produtos_posicao_positiva
    check (posicao > 0),

  constraint home_secao_produtos_posicao_unica
    unique (secao_id, posicao)
    deferrable initially deferred
);


-- ============================================================
-- CONFIGURAÇÕES DO SITE
-- ============================================================

create table public.configuracoes_site (
  id smallint primary key
    default 1,

  nome_marca text not null,

  descricao_marca text,
  texto_sobre text,

  whatsapp text,
  instagram_url text,
  endereco text,

  hero_titulo text,
  hero_subtitulo text,

  logo_image_path text,
  hero_image_path text,

  updated_by uuid
    references auth.users(id)
    on delete set null,

  created_at timestamptz not null
    default pg_catalog.now(),

  updated_at timestamptz not null
    default pg_catalog.now(),

  constraint configuracoes_site_linha_unica
    check (id = 1),

  constraint configuracoes_site_nome_valido
    check (
      pg_catalog.char_length(
        pg_catalog.btrim(nome_marca)
      ) between 2 and 150
    ),

  constraint configuracoes_site_whatsapp_valido
    check (
      whatsapp is null
      or whatsapp ~ '^[1-9][0-9]{7,14}$'
    ),

  constraint configuracoes_site_hero_titulo_limite
    check (
      hero_titulo is null
      or pg_catalog.char_length(hero_titulo) <= 150
    ),

  constraint configuracoes_site_hero_subtitulo_limite
    check (
      hero_subtitulo is null
      or pg_catalog.char_length(hero_subtitulo) <= 300
    )
);


-- ============================================================
-- REGISTRO INICIAL DAS CONFIGURAÇÕES
-- ============================================================

insert into public.configuracoes_site (
  id,
  nome_marca
)
values (
  1,
  'Nome da Marca'
)
on conflict (id) do nothing;


-- ============================================================
-- TRIGGERS DE updated_at
-- ============================================================

create trigger categorias_set_updated_at
before update on public.categorias
for each row
execute function private.set_updated_at();

create trigger produtos_set_updated_at
before update on public.produtos
for each row
execute function private.set_updated_at();

create trigger secoes_home_set_updated_at
before update on public.secoes_home
for each row
execute function private.set_updated_at();

create trigger configuracoes_site_set_updated_at
before update on public.configuracoes_site
for each row
execute function private.set_updated_at();


-- ============================================================
-- ÍNDICES
-- ============================================================

create index produtos_categoria_id_idx
  on public.produtos (categoria_id);

create index produtos_status_idx
  on public.produtos (status);

create index produtos_categoria_status_idx
  on public.produtos (
    categoria_id,
    status
  );

create index produtos_created_by_idx
  on public.produtos (created_by);

create index produtos_updated_by_idx
  on public.produtos (updated_by);

create index home_secao_produtos_produto_id_idx
  on public.home_secao_produtos (produto_id);

create index configuracoes_site_updated_by_idx
  on public.configuracoes_site (updated_by);

create index logs_auditoria_actor_id_idx
  on private.logs_auditoria (actor_id);

create index logs_auditoria_created_at_idx
  on private.logs_auditoria (created_at);


-- ============================================================
-- ATIVAR ROW LEVEL SECURITY
-- ============================================================

alter table public.categorias
enable row level security;

alter table public.produtos
enable row level security;

alter table public.produto_imagens
enable row level security;

alter table public.secoes_home
enable row level security;

alter table public.home_secao_produtos
enable row level security;

alter table public.configuracoes_site
enable row level security;


-- ============================================================
-- REMOVER ACESSO ATÉ CRIARMOS AS POLÍTICAS
-- ============================================================

revoke all privileges
on table public.categorias
from anon, authenticated;

revoke all privileges
on table public.produtos
from anon, authenticated;

revoke all privileges
on table public.produto_imagens
from anon, authenticated;

revoke all privileges
on table public.secoes_home
from anon, authenticated;

revoke all privileges
on table public.home_secao_produtos
from anon, authenticated;

revoke all privileges
on table public.configuracoes_site
from anon, authenticated;