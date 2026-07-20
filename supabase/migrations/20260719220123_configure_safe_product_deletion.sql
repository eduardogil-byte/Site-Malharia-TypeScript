-- ============================================================
-- REMOVER EXCLUSÃO DIRETA DE PRODUTOS
-- ============================================================

drop policy if exists produtos_delete_admin
on public.produtos;

revoke delete
on table public.produtos
from authenticated;


-- ============================================================
-- EXCLUSÃO CONTROLADA DE PRODUTO ARQUIVADO
-- ============================================================

create or replace function public.excluir_produto_arquivado(
  p_produto_id uuid
)
returns void
language plpgsql
volatile
security definer
set search_path = ''
as $$
declare
  produto_status text;
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

  select produto.status
  into produto_status
  from public.produtos as produto
  where produto.id = p_produto_id
  for update;

  if not found then
    raise exception
      using
        errcode = 'P0002',
        message = 'Produto não encontrado.';
  end if;

  if produto_status <> 'arquivado' then
    raise exception
      using
        errcode = '22023',
        message = 'Somente produtos arquivados podem ser excluídos.';
  end if;

  if exists (
    select 1
    from public.produto_imagens as imagem
    where imagem.produto_id = p_produto_id
  ) then
    raise exception
      using
        errcode = '23503',
        message = 'Remova as imagens do produto antes da exclusão.';
  end if;

  delete from public.produtos
  where id = p_produto_id;
end;
$$;

revoke all
on function public.excluir_produto_arquivado(uuid)
from public, anon, authenticated;

grant execute
on function public.excluir_produto_arquivado(uuid)
to authenticated;