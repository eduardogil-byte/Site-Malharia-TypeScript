-- ============================================================
-- VALIDAÇÕES ADICIONAIS DOS PRODUTOS
-- ============================================================

alter table public.produtos
add constraint produtos_slug_limite
check (
  pg_catalog.char_length(slug) <= 180
);

alter table public.produtos
add constraint produtos_descricao_limite
check (
  descricao is null
  or pg_catalog.char_length(descricao) <= 5000
);

alter table public.produtos
add constraint produtos_mensagem_whatsapp_limite
check (
  mensagem_whatsapp is null
  or pg_catalog.char_length(mensagem_whatsapp) <= 500
);


-- Evita dois produtos com o mesmo nome dentro da mesma categoria.
-- A comparação não diferencia maiúsculas de minúsculas.

create unique index produtos_categoria_nome_unico_ci
on public.produtos (
  categoria_id,
  pg_catalog.lower(nome)
);


-- Ajuda na listagem administrativa, que mostra os produtos
-- alterados mais recentemente primeiro.

create index produtos_updated_at_idx
on public.produtos (
  updated_at desc
);