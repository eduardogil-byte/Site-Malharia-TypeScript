-- ============================================================
-- SALVAR OS PRODUTOS DE UMA SEÇÃO DA HOME
-- ============================================================

create or replace function public.salvar_produtos_secao_home(
  p_secao_id uuid,
  p_produto_ids uuid[]
)
returns void
language plpgsql
volatile
security invoker
set search_path = ''
as $$
declare
  limite_da_secao integer;
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

  if p_secao_id is null then
    raise exception
      using
        errcode = '22023',
        message = 'A seção informada é inválida.';
  end if;

  if p_produto_ids is null then
    raise exception
      using
        errcode = '22023',
        message = 'A lista de produtos é inválida.';
  end if;

  -- Bloqueia a seção durante a alteração e obtém seu limite.
  select secao.limite_produtos
  into limite_da_secao
  from public.secoes_home as secao
  where secao.id = p_secao_id
  for update;

  if not found then
    raise exception
      using
        errcode = 'P0002',
        message = 'Seção não encontrada.';
  end if;

  if pg_catalog.cardinality(p_produto_ids)
     > limite_da_secao then
    raise exception
      using
        errcode = '22023',
        message = 'A quantidade de produtos ultrapassa o limite da seção.';
  end if;

  select pg_catalog.count(distinct item.id)
  into total_ids_distintos
  from pg_catalog.unnest(
    p_produto_ids
  ) as item(id);

  if total_ids_distintos
     <> pg_catalog.cardinality(p_produto_ids) then
    raise exception
      using
        errcode = '22023',
        message = 'A lista contém produtos duplicados.';
  end if;

  if exists (
    select 1
    from pg_catalog.unnest(
      p_produto_ids
    ) as item(id)
    left join public.produtos as produto
      on produto.id = item.id
    where produto.id is null
  ) then
    raise exception
      using
        errcode = '22023',
        message = 'A lista contém um produto inexistente.';
  end if;

  /*
   * Remove a configuração anterior.
   * Como tudo ocorre na mesma função, qualquer erro reverte
   * a operação completa.
   */
  delete from public.home_secao_produtos
  where secao_id = p_secao_id;

  if pg_catalog.cardinality(p_produto_ids) > 0 then
    insert into public.home_secao_produtos (
      secao_id,
      produto_id,
      posicao
    )
    select
      p_secao_id,
      item.id,
      item.ordem::pg_catalog.int4
    from pg_catalog.unnest(
      p_produto_ids
    ) with ordinality as item(id, ordem);
  end if;
end;
$$;

revoke all
on function public.salvar_produtos_secao_home(
  uuid,
  uuid[]
)
from public, anon, authenticated;

grant execute
on function public.salvar_produtos_secao_home(
  uuid,
  uuid[]
)
to authenticated;