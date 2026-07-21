-- ============================================================
-- NOVAS CONFIGURAÇÕES DO SITE
-- ============================================================

alter table public.configuracoes_site
add column if not exists slogan text,
add column if not exists instagram text,
add column if not exists email text,
add column if not exists endereco text,
add column if not exists texto_sobre text,
add column if not exists texto_contato text,
add column if not exists logo_path text,
add column if not exists banner_path text;


-- ============================================================
-- LIMITES E VALIDAÇÕES
-- ============================================================

alter table public.configuracoes_site
drop constraint if exists configuracoes_site_nome_marca_limite;

alter table public.configuracoes_site
add constraint configuracoes_site_nome_marca_limite
check (
  pg_catalog.char_length(nome_marca) <= 120
);


alter table public.configuracoes_site
drop constraint if exists configuracoes_site_slogan_limite;

alter table public.configuracoes_site
add constraint configuracoes_site_slogan_limite
check (
  slogan is null
  or pg_catalog.char_length(slogan) <= 200
);


alter table public.configuracoes_site
drop constraint if exists configuracoes_site_instagram_limite;

alter table public.configuracoes_site
add constraint configuracoes_site_instagram_limite
check (
  instagram is null
  or pg_catalog.char_length(instagram) <= 200
);


alter table public.configuracoes_site
drop constraint if exists configuracoes_site_email_limite;

alter table public.configuracoes_site
add constraint configuracoes_site_email_limite
check (
  email is null
  or pg_catalog.char_length(email) <= 254
);


alter table public.configuracoes_site
drop constraint if exists configuracoes_site_endereco_limite;

alter table public.configuracoes_site
add constraint configuracoes_site_endereco_limite
check (
  endereco is null
  or pg_catalog.char_length(endereco) <= 500
);


alter table public.configuracoes_site
drop constraint if exists configuracoes_site_texto_sobre_limite;

alter table public.configuracoes_site
add constraint configuracoes_site_texto_sobre_limite
check (
  texto_sobre is null
  or pg_catalog.char_length(texto_sobre) <= 5000
);


alter table public.configuracoes_site
drop constraint if exists configuracoes_site_texto_contato_limite;

alter table public.configuracoes_site
add constraint configuracoes_site_texto_contato_limite
check (
  texto_contato is null
  or pg_catalog.char_length(texto_contato) <= 2000
);


alter table public.configuracoes_site
drop constraint if exists configuracoes_site_logo_path_valido;

alter table public.configuracoes_site
add constraint configuracoes_site_logo_path_valido
check (
  logo_path is null
  or (
    pg_catalog.char_length(logo_path) <= 500
    and logo_path like 'marca/%'
  )
);


alter table public.configuracoes_site
drop constraint if exists configuracoes_site_banner_path_valido;

alter table public.configuracoes_site
add constraint configuracoes_site_banner_path_valido
check (
  banner_path is null
  or (
    pg_catalog.char_length(banner_path) <= 500
    and banner_path like 'marca/%'
  )
);


-- ============================================================
-- GARANTIR O REGISTRO ÚNICO DAS CONFIGURAÇÕES
-- ============================================================

insert into public.configuracoes_site (
  id,
  nome_marca
)
values (
  1,
  'Minha Marca'
)
on conflict (id) do nothing;


-- ============================================================
-- BUCKET DAS IMAGENS INSTITUCIONAIS
-- ============================================================

insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'site-assets',
  'site-assets',
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

drop policy if exists site_assets_admin_select
on storage.objects;

drop policy if exists site_assets_admin_insert
on storage.objects;

drop policy if exists site_assets_admin_delete
on storage.objects;


create policy site_assets_admin_select
on storage.objects
for select
to authenticated
using (
  bucket_id = 'site-assets'
  and (storage.foldername(name))[1] = 'marca'
  and (
    select private.usuario_e_admin()
  )
);


create policy site_assets_admin_insert
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'site-assets'
  and (storage.foldername(name))[1] = 'marca'
  and (
    select private.usuario_e_admin()
  )
);


create policy site_assets_admin_delete
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'site-assets'
  and (storage.foldername(name))[1] = 'marca'
  and (
    select private.usuario_e_admin()
  )
);