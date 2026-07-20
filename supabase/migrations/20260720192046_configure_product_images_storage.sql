-- ============================================================
-- BUCKET PÚBLICO DAS IMAGENS
-- ============================================================

insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'catalogo-produtos',
  'catalogo-produtos',
  true,
  5242880,
  array[
    'image/jpeg',
    'image/png',
    'image/webp'
  ]::text[]
)
on conflict (id)
do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;


-- ============================================================
-- POLÍTICAS DO STORAGE
-- ============================================================

drop policy if exists catalogo_produtos_admin_select
on storage.objects;

drop policy if exists catalogo_produtos_admin_insert
on storage.objects;

drop policy if exists catalogo_produtos_admin_delete
on storage.objects;


-- Necessária para consultar metadados e também para exclusão.

create policy catalogo_produtos_admin_select
on storage.objects
for select
to authenticated
using (
  bucket_id = 'catalogo-produtos'
  and (storage.foldername(name))[1] = 'produtos'
  and (
    select private.usuario_e_admin()
  )
);


create policy catalogo_produtos_admin_insert
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'catalogo-produtos'
  and (storage.foldername(name))[1] = 'produtos'
  and (
    select private.usuario_e_admin()
  )
);


create policy catalogo_produtos_admin_delete
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'catalogo-produtos'
  and (storage.foldername(name))[1] = 'produtos'
  and (
    select private.usuario_e_admin()
  )
);


-- ============================================================
-- REGISTRAR IMAGEM E DEFINIR PRÓXIMA POSIÇÃO
-- ============================================================

create or replace function public.registrar_imagem_produto(
  p_produto_id uuid,
  p_storage_path text,
  p_alt_text text default null
)
returns uuid
language plpgsql
volatile
security invoker
set search_path = ''
as $$
declare
  nova_imagem_id uuid;
  nova_posicao integer;
  total_imagens integer;
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

  if p_storage_path is null
     or pg_catalog.char_length(
       pg_catalog.btrim(p_storage_path)
     ) = 0 then
    raise exception
      using
        errcode = '22023',
        message = 'O caminho da imagem é inválido.';
  end if;

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

  if not (
    p_storage_path like
      'produtos/'
      || p_produto_id::pg_catalog.text
      || '/%'
  ) then
    raise exception
      using
        errcode = '22023',
        message = 'O caminho da imagem não pertence ao produto.';
  end if;

  select pg_catalog.count(*)
  into total_imagens
  from public.produto_imagens
  where produto_id = p_produto_id;

  if total_imagens >= 8 then
    raise exception
      using
        errcode = '22023',
        message = 'O produto pode possuir no máximo 8 imagens.';
  end if;

  select
    coalesce(
      pg_catalog.max(posicao),
      0
    ) + 1
  into nova_posicao
  from public.produto_imagens
  where produto_id = p_produto_id;

  insert into public.produto_imagens (
    produto_id,
    storage_path,
    alt_text,
    posicao
  )
  values (
    p_produto_id,
    p_storage_path,
    p_alt_text,
    nova_posicao
  )
  returning id
  into nova_imagem_id;

  return nova_imagem_id;
end;
$$;

revoke all
on function public.registrar_imagem_produto(
  uuid,
  text,
  text
)
from public, anon, authenticated;

grant execute
on function public.registrar_imagem_produto(
  uuid,
  text,
  text
)
to authenticated;


-- ============================================================
-- EXCLUIR REGISTRO E COMPACTAR POSIÇÕES
-- ============================================================

create or replace function public.excluir_imagem_produto(
  p_imagem_id uuid
)
returns void
language plpgsql
volatile
security invoker
set search_path = ''
as $$
declare
  imagem_produto_id uuid;
  imagem_posicao integer;
begin
  if not (
    select private.usuario_e_admin()
  ) then
    raise exception
      using
        errcode = '42501',
        message = 'Acesso administrativo necessário.';
  end if;

  select
    imagem.produto_id,
    imagem.posicao
  into
    imagem_produto_id,
    imagem_posicao
  from public.produto_imagens as imagem
  where imagem.id = p_imagem_id
  for update;

  if not found then
    raise exception
      using
        errcode = 'P0002',
        message = 'Imagem não encontrada.';
  end if;

  perform 1
  from public.produtos
  where id = imagem_produto_id
  for update;

  delete from public.produto_imagens
  where id = p_imagem_id;

  update public.produto_imagens
  set posicao = posicao - 1
  where produto_id = imagem_produto_id
    and posicao > imagem_posicao;
end;
$$;

revoke all
on function public.excluir_imagem_produto(uuid)
from public, anon, authenticated;

grant execute
on function public.excluir_imagem_produto(uuid)
to authenticated;