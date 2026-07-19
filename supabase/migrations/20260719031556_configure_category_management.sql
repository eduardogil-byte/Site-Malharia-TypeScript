-- ============================================================
-- VALIDAÇÕES ADICIONAIS
-- ============================================================

alter table public.categorias
add constraint categorias_slug_limite
check (
  pg_catalog.char_length(slug) <= 120
);

alter table public.categorias
add constraint categorias_descricao_limite
check (
  descricao is null
  or pg_catalog.char_length(descricao) <= 500
);


-- ============================================================
-- SEQUÊNCIA PARA NOVAS CATEGORIAS
-- ============================================================

create sequence public.categorias_posicao_seq;

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
  from public.categorias;

  perform pg_catalog.setval(
    'public.categorias_posicao_seq',
    proxima_posicao,
    false
  );
end;
$$;

alter sequence public.categorias_posicao_seq
owned by public.categorias.posicao;

alter table public.categorias
alter column posicao
set default pg_catalog.nextval(
  'public.categorias_posicao_seq'
);

revoke all
on sequence public.categorias_posicao_seq
from public, anon, authenticated;

grant usage
on sequence public.categorias_posicao_seq
to authenticated;


-- ============================================================
-- FUNÇÃO PARA REORDENAR CATEGORIAS
-- ============================================================

create or replace function public.reordenar_categorias(
  p_categoria_ids uuid[]
)
returns void
language plpgsql
volatile
security invoker
set search_path = ''
as $$
declare
  total_categorias integer;
  total_ids_distintos integer;
begin
  if not (
    select private.usuario_e_admin()
  ) then
    raise exception
      using
        errcode = '42501',
        message = 'Acesso administrativo necessário.';
  end if;

  if p_categoria_ids is null
     or pg_catalog.cardinality(p_categoria_ids) = 0 then
    raise exception
      using
        errcode = '22023',
        message = 'A lista de categorias não pode estar vazia.';
  end if;

  select pg_catalog.count(*)
  into total_categorias
  from public.categorias;

  select pg_catalog.count(distinct item.id)
  into total_ids_distintos
  from pg_catalog.unnest(
    p_categoria_ids
  ) as item(id);

  if total_ids_distintos
     <> pg_catalog.cardinality(p_categoria_ids) then
    raise exception
      using
        errcode = '22023',
        message = 'A lista contém categorias duplicadas.';
  end if;

  if pg_catalog.cardinality(p_categoria_ids)
     <> total_categorias then
    raise exception
      using
        errcode = '22023',
        message = 'A lista deve conter todas as categorias.';
  end if;

  if exists (
    select 1
    from pg_catalog.unnest(
      p_categoria_ids
    ) as item(id)
    left join public.categorias as categoria
      on categoria.id = item.id
    where categoria.id is null
  ) then
    raise exception
      using
        errcode = '22023',
        message = 'A lista contém uma categoria inexistente.';
  end if;

  update public.categorias as categoria
  set posicao = categoria_ordenada.posicao
  from (
    select
      item.id,
      item.ordem::pg_catalog.int4 as posicao -- ALTERAÇÃO 2: Mudado de ::integer para ::pg_catalog.int4 devido ao search_path vazio
    from pg_catalog.unnest(
      p_categoria_ids
    ) with ordinality as item(id, ordem)
  ) as categoria_ordenada
  where categoria.id = categoria_ordenada.id;
end;
$$;

revoke all
on function public.reordenar_categorias(uuid[])
from public, anon, authenticated;

grant execute
on function public.reordenar_categorias(uuid[])
to authenticated;
