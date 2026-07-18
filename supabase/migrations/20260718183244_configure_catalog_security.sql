-- ============================================================
-- FUNÇÃO PRIVADA: VERIFICAR SE O USUÁRIO É ADMINISTRADOR
-- ============================================================

create or replace function private.usuario_e_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from private.administradores as administrador
    where administrador.user_id = (
      select auth.uid()
    )
  );
$$;

revoke all
on function private.usuario_e_admin()
from public, anon, authenticated;

-- O schema continua fora dos schemas expostos pela API.
-- O authenticated recebe somente o necessário para que
-- as políticas consigam executar a função.
grant usage
on schema private
to authenticated;

grant execute
on function private.usuario_e_admin()
to authenticated;


-- ============================================================
-- FUNÇÃO PÚBLICA: FRONTEND CONSULTAR O PRÓPRIO ACESSO
-- ============================================================

create or replace function public.usuario_atual_e_admin()
returns boolean
language sql
stable
security invoker
set search_path = ''
as $$
  select private.usuario_e_admin();
$$;

revoke all
on function public.usuario_atual_e_admin()
from public, anon, authenticated;

grant execute
on function public.usuario_atual_e_admin()
to authenticated;


-- ============================================================
-- AUTORIA DOS PRODUTOS
-- ============================================================

create or replace function private.set_produto_autoria()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  if tg_op = 'INSERT' then
    new.created_by := (
      select auth.uid()
    );
  else
    -- Impede que o created_by seja alterado durante uma edição.
    new.created_by := old.created_by;
  end if;

  new.updated_by := (
    select auth.uid()
  );

  return new;
end;
$$;

revoke all
on function private.set_produto_autoria()
from public, anon, authenticated;

create trigger produtos_set_autoria
before insert or update
on public.produtos
for each row
execute function private.set_produto_autoria();


-- ============================================================
-- AUTORIA DAS CONFIGURAÇÕES
-- ============================================================

create or replace function private.set_configuracao_autoria()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_by := (
    select auth.uid()
  );

  return new;
end;
$$;

revoke all
on function private.set_configuracao_autoria()
from public, anon, authenticated;

create trigger configuracoes_site_set_autoria
before update
on public.configuracoes_site
for each row
execute function private.set_configuracao_autoria();


-- ============================================================
-- PRIVILÉGIOS DO VISITANTE
-- ============================================================

grant select
on table public.categorias
to anon;

grant select
on table public.produtos
to anon;

grant select
on table public.produto_imagens
to anon;

grant select
on table public.secoes_home
to anon;

grant select
on table public.home_secao_produtos
to anon;

grant select
on table public.configuracoes_site
to anon;


-- ============================================================
-- PRIVILÉGIOS DOS USUÁRIOS AUTENTICADOS
-- ============================================================

grant select, insert, update, delete
on table public.categorias
to authenticated;

grant select, insert, update, delete
on table public.produtos
to authenticated;

grant select, insert, update, delete
on table public.produto_imagens
to authenticated;

grant select, insert, update, delete
on table public.secoes_home
to authenticated;

grant select, insert, update, delete
on table public.home_secao_produtos
to authenticated;

grant select, update
on table public.configuracoes_site
to authenticated;


-- ============================================================
-- POLÍTICAS: CATEGORIAS
-- ============================================================

create policy categorias_select_anon
on public.categorias
for select
to anon
using (
  ativa = true
);

create policy categorias_select_authenticated
on public.categorias
for select
to authenticated
using (
  ativa = true
  or (
    select private.usuario_e_admin()
  )
);

create policy categorias_insert_admin
on public.categorias
for insert
to authenticated
with check (
  (
    select private.usuario_e_admin()
  )
);

create policy categorias_update_admin
on public.categorias
for update
to authenticated
using (
  (
    select private.usuario_e_admin()
  )
)
with check (
  (
    select private.usuario_e_admin()
  )
);

create policy categorias_delete_admin
on public.categorias
for delete
to authenticated
using (
  (
    select private.usuario_e_admin()
  )
);


-- ============================================================
-- POLÍTICAS: PRODUTOS
-- ============================================================

create policy produtos_select_anon
on public.produtos
for select
to anon
using (
  status = 'publicado'
  and exists (
    select 1
    from public.categorias as categoria
    where categoria.id = produtos.categoria_id
      and categoria.ativa = true
  )
);

create policy produtos_select_authenticated
on public.produtos
for select
to authenticated
using (
  (
    status = 'publicado'
    and exists (
      select 1
      from public.categorias as categoria
      where categoria.id = produtos.categoria_id
        and categoria.ativa = true
    )
  )
  or (
    select private.usuario_e_admin()
  )
);

create policy produtos_insert_admin
on public.produtos
for insert
to authenticated
with check (
  (
    select private.usuario_e_admin()
  )
);

create policy produtos_update_admin
on public.produtos
for update
to authenticated
using (
  (
    select private.usuario_e_admin()
  )
)
with check (
  (
    select private.usuario_e_admin()
  )
);

create policy produtos_delete_admin
on public.produtos
for delete
to authenticated
using (
  (
    select private.usuario_e_admin()
  )
);


-- ============================================================
-- POLÍTICAS: IMAGENS DOS PRODUTOS
-- ============================================================

create policy produto_imagens_select_anon
on public.produto_imagens
for select
to anon
using (
  exists (
    select 1
    from public.produtos as produto
    join public.categorias as categoria
      on categoria.id = produto.categoria_id
    where produto.id = produto_imagens.produto_id
      and produto.status = 'publicado'
      and categoria.ativa = true
  )
);

create policy produto_imagens_select_authenticated
on public.produto_imagens
for select
to authenticated
using (
  exists (
    select 1
    from public.produtos as produto
    join public.categorias as categoria
      on categoria.id = produto.categoria_id
    where produto.id = produto_imagens.produto_id
      and produto.status = 'publicado'
      and categoria.ativa = true
  )
  or (
    select private.usuario_e_admin()
  )
);

create policy produto_imagens_insert_admin
on public.produto_imagens
for insert
to authenticated
with check (
  (
    select private.usuario_e_admin()
  )
);

create policy produto_imagens_update_admin
on public.produto_imagens
for update
to authenticated
using (
  (
    select private.usuario_e_admin()
  )
)
with check (
  (
    select private.usuario_e_admin()
  )
);

create policy produto_imagens_delete_admin
on public.produto_imagens
for delete
to authenticated
using (
  (
    select private.usuario_e_admin()
  )
);


-- ============================================================
-- POLÍTICAS: SEÇÕES DA PÁGINA INICIAL
-- ============================================================

create policy secoes_home_select_anon
on public.secoes_home
for select
to anon
using (
  ativa = true
);

create policy secoes_home_select_authenticated
on public.secoes_home
for select
to authenticated
using (
  ativa = true
  or (
    select private.usuario_e_admin()
  )
);

create policy secoes_home_insert_admin
on public.secoes_home
for insert
to authenticated
with check (
  (
    select private.usuario_e_admin()
  )
);

create policy secoes_home_update_admin
on public.secoes_home
for update
to authenticated
using (
  (
    select private.usuario_e_admin()
  )
)
with check (
  (
    select private.usuario_e_admin()
  )
);

create policy secoes_home_delete_admin
on public.secoes_home
for delete
to authenticated
using (
  (
    select private.usuario_e_admin()
  )
);


-- ============================================================
-- POLÍTICAS: PRODUTOS DAS SEÇÕES
-- ============================================================

create policy home_secao_produtos_select_anon
on public.home_secao_produtos
for select
to anon
using (
  exists (
    select 1
    from public.secoes_home as secao
    where secao.id = home_secao_produtos.secao_id
      and secao.ativa = true
  )
  and exists (
    select 1
    from public.produtos as produto
    join public.categorias as categoria
      on categoria.id = produto.categoria_id
    where produto.id = home_secao_produtos.produto_id
      and produto.status = 'publicado'
      and categoria.ativa = true
  )
);

create policy home_secao_produtos_select_authenticated
on public.home_secao_produtos
for select
to authenticated
using (
  (
    exists (
      select 1
      from public.secoes_home as secao
      where secao.id = home_secao_produtos.secao_id
        and secao.ativa = true
    )
    and exists (
      select 1
      from public.produtos as produto
      join public.categorias as categoria
        on categoria.id = produto.categoria_id
      where produto.id = home_secao_produtos.produto_id
        and produto.status = 'publicado'
        and categoria.ativa = true
    )
  )
  or (
    select private.usuario_e_admin()
  )
);

create policy home_secao_produtos_insert_admin
on public.home_secao_produtos
for insert
to authenticated
with check (
  (
    select private.usuario_e_admin()
  )
);

create policy home_secao_produtos_update_admin
on public.home_secao_produtos
for update
to authenticated
using (
  (
    select private.usuario_e_admin()
  )
)
with check (
  (
    select private.usuario_e_admin()
  )
);

create policy home_secao_produtos_delete_admin
on public.home_secao_produtos
for delete
to authenticated
using (
  (
    select private.usuario_e_admin()
  )
);


-- ============================================================
-- POLÍTICAS: CONFIGURAÇÕES DO SITE
-- ============================================================

create policy configuracoes_site_select_public
on public.configuracoes_site
for select
to anon, authenticated
using (
  id = 1
);

create policy configuracoes_site_update_admin
on public.configuracoes_site
for update
to authenticated
using (
  (
    select private.usuario_e_admin()
  )
)
with check (
  id = 1
  and (
    select private.usuario_e_admin()
  )
);