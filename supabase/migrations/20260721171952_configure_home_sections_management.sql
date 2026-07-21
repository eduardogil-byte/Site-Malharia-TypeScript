-- ============================================================
-- VALIDAÇÕES ADICIONAIS
-- ============================================================

alter table public.secoes_home
add constraint secoes_home_slug_limite
check (
  pg_catalog.char_length(slug) <= 150
);


-- ============================================================
-- SEQUÊNCIA PARA A POSIÇÃO DAS NOVAS SEÇÕES
-- ============================================================

create sequence public.secoes_home_posicao_seq;

do $$
declare
  proxima_posicao bigint;
begin
  select
    (
      coalesce(
        pg_catalog.max(posicao),
        0
      ) + 1
    )::bigint
  into proxima_posicao
  from public.secoes_home;

  perform pg_catalog.setval(
    'public.secoes_home_posicao_seq',
    proxima_posicao,
    false
  );
end;
$$;

alter sequence public.secoes_home_posicao_seq
owned by public.secoes_home.posicao;

alter table public.secoes_home
alter column posicao
set default pg_catalog.nextval(
  'public.secoes_home_posicao_seq'
);

revoke all
on sequence public.secoes_home_posicao_seq
from public, anon, authenticated;

grant usage
on sequence public.secoes_home_posicao_seq
to authenticated;


-- ============================================================
-- REORDENAR AS SEÇÕES DA HOME
-- ============================================================

create or replace function public.reordenar_secoes_home(
  p_secao_ids uuid[]
)
returns void
language plpgsql
volatile
security invoker
set search_path = ''
as $$
declare
  total_secoes bigint;
  total_ids_distintos bigint;
begin
  if not (
    select private.usuario_e_admin()
  ) then
    raise exception
      using
        errcode = '42501',
        message = 'Acesso administrativo necessário.';
  end if;

  if p_secao_ids is null
     or pg_catalog.cardinality(p_secao_ids) = 0 then
    raise exception
      using
        errcode = '22023',
        message = 'A lista de seções não pode estar vazia.';
  end if;

  select pg_catalog.count(*)
  into total_secoes
  from public.secoes_home;

  select pg_catalog.count(distinct item.id)
  into total_ids_distintos
  from pg_catalog.unnest(
    p_secao_ids
  ) as item(id);

  if total_ids_distintos
     <> pg_catalog.cardinality(p_secao_ids) then
    raise exception
      using
        errcode = '22023',
        message = 'A lista contém seções duplicadas.';
  end if;

  if pg_catalog.cardinality(p_secao_ids)
     <> total_secoes then
    raise exception
      using
        errcode = '22023',
        message = 'A lista deve conter todas as seções.';
  end if;

  if exists (
    select 1
    from pg_catalog.unnest(
      p_secao_ids
    ) as item(id)
    left join public.secoes_home as secao
      on secao.id = item.id
    where secao.id is null
  ) then
    raise exception
      using
        errcode = '22023',
        message = 'A lista contém uma seção inexistente.';
  end if;

  update public.secoes_home as secao
  set posicao = secao_ordenada.posicao
  from (
    select
      item.id,
      item.ordem::pg_catalog.int4 as posicao
    from pg_catalog.unnest(
      p_secao_ids
    ) with ordinality as item(id, ordem)
  ) as secao_ordenada
  where secao.id = secao_ordenada.id;
end;
$$;

revoke all
on function public.reordenar_secoes_home(uuid[])
from public, anon, authenticated;

grant execute
on function public.reordenar_secoes_home(uuid[])
to authenticated;