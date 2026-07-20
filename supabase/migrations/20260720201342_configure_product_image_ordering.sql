-- ============================================================
-- REORDENAR IMAGENS DE UM PRODUTO
-- ============================================================

create or replace function public.reordenar_imagens_produto(
  p_produto_id uuid,
  p_imagem_ids uuid[]
)
returns void
language plpgsql
volatile
security invoker
set search_path = ''
as $$
declare
  total_imagens bigint;
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

  if p_produto_id is null then
    raise exception
      using
        errcode = '22023',
        message = 'O produto informado é inválido.';
  end if;

  if p_imagem_ids is null
     or pg_catalog.cardinality(p_imagem_ids) = 0 then
    raise exception
      using
        errcode = '22023',
        message = 'A lista de imagens não pode estar vazia.';
  end if;

  -- Bloqueia alterações concorrentes relacionadas ao produto.
  perform 1
  from public.produtos
  where id = p_produto_id
  for update;

  if not found then
    raise exception
      using
        errcode = 'P0002',
        message = 'Produto não encontrado.';
  end if;

  select pg_catalog.count(*)
  into total_imagens
  from public.produto_imagens
  where produto_id = p_produto_id;

  if pg_catalog.cardinality(p_imagem_ids)
     <> total_imagens then
    raise exception
      using
        errcode = '22023',
        message = 'A lista deve conter todas as imagens do produto.';
  end if;

  select pg_catalog.count(distinct item.id)
  into total_ids_distintos
  from pg_catalog.unnest(
    p_imagem_ids
  ) as item(id);

  if total_ids_distintos
     <> pg_catalog.cardinality(p_imagem_ids) then
    raise exception
      using
        errcode = '22023',
        message = 'A lista contém imagens duplicadas.';
  end if;

  if exists (
    select 1
    from pg_catalog.unnest(
      p_imagem_ids
    ) as item(id)
    left join public.produto_imagens as imagem
      on imagem.id = item.id
      and imagem.produto_id = p_produto_id
    where imagem.id is null
  ) then
    raise exception
      using
        errcode = '22023',
        message = 'A lista contém uma imagem inválida.';
  end if;

  update public.produto_imagens as imagem
  set posicao = imagem_ordenada.posicao
  from (
    select
      item.id,
      item.ordem::pg_catalog.int4 as posicao
    from pg_catalog.unnest(
      p_imagem_ids
    ) with ordinality as item(id, ordem)
  ) as imagem_ordenada
  where imagem.id = imagem_ordenada.id
    and imagem.produto_id = p_produto_id;
end;
$$;

revoke all
on function public.reordenar_imagens_produto(
  uuid,
  uuid[]
)
from public, anon, authenticated;

grant execute
on function public.reordenar_imagens_produto(
  uuid,
  uuid[]
)
to authenticated;