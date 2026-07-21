# Catálogo da Marca

## Objetivo

Desenvolver um catálogo digital para divulgação de malhas, sabonetes, velas, aromatizadores e outros produtos da marca.

O site não realizará vendas diretamente. Cada produto terá um botão que direcionará o cliente para o WhatsApp.

## Tecnologias

- React
- TypeScript
- Tailwind CSS
- Vite
- Supabase PostgreSQL
- Supabase Auth
- Supabase Storage
- Git e GitHub

## Áreas do sistema

### Site público

- Página inicial
- Catálogo
- Categorias
- Detalhes do produto
- Sobre a marca
- Contato
- Redirecionamento para o WhatsApp

### Painel administrativo

- Login
- Cadastro de categorias
- Cadastro de produtos
- Upload de imagens
- Publicação e arquivamento de produtos
- Organização das imagens
- Organização dos produtos em destaque
- Configurações gerais do site

## Regras principais

- Apenas produtos publicados aparecem no catálogo.
- Produtos podem ser arquivados sem serem apagados.
- A imagem na posição 1 será a capa do produto.
- Produtos podem aparecer em diferentes seções da página inicial.
- A ordem dos produtos será controlada pelo banco.
- Visitantes terão apenas acesso de leitura.
- Somente administradores poderão alterar informações.
- Nenhuma chave secreta será armazenada no frontend.

## Estrutura do banco planejada

- categorias
- produtos
- produto_imagens
- secoes_home
- home_secao_produtos
- configuracoes_site
- administradores
- logs_auditoria

## Segurança do banco

- RLS habilitado em todas as tabelas públicas.
- Visitantes podem consultar somente conteúdo publicado.
- Usuários autenticados comuns não podem modificar dados.
- Administradores são armazenados em private.administradores.
- A verificação administrativa é realizada por função security definer.
- O schema private não está exposto pela Data API.
- Cadastros públicos do Supabase Auth estão desativados.
- created_by e updated_by não são controlados pelo frontend.

## Primeiro administrador

O administrador inicial é criado no Supabase Auth e vinculado
manualmente à tabela private.administradores.

## Autenticação administrativa

- Login com e-mail e senha pelo Supabase Auth.
- A sessão é recuperada automaticamente ao iniciar o React.
- Todas as rotas /admin são protegidas.
- Após o login, o banco verifica private.administradores.
- Usuários autenticados sem permissão são desconectados.
- O logout encerra somente a sessão atual.
- O frontend controla a navegação, mas a segurança real fica no RLS.

## CRUD de categorias

- Categorias podem ser cadastradas e editadas pelo painel.
- O slug é gerado automaticamente e pode ser alterado.
- Categorias podem ser ativadas ou desativadas.
- Categorias são ordenadas por posição.
- A reordenação é realizada por uma Database Function.
- Categorias relacionadas a produtos não podem ser excluídas.
- A validação existe no frontend e no PostgreSQL.
- Visitantes visualizam apenas categorias ativas.

## Listagem administrativa de produtos

- Produtos são carregados do Supabase.
- A categoria é consultada pelo relacionamento do banco.
- A listagem aceita filtros por nome, categoria e status.
- Produtos são ordenados pela última atualização.
- A página apresenta status e disponibilidade.
- O cadastro e a edição serão adicionados na próxima etapa.

## Página inicial

A página inicial é formada por seções administráveis.

Cada seção possui:

- título;
- subtítulo;
- slug;
- posição;
- status ativo ou inativo;
- limite de produtos;
- produtos selecionados e ordenados.

A Home pública exibe somente:

- seções ativas;
- produtos publicados;
- produtos selecionados para cada seção;
- produtos dentro do limite configurado.

## Etapa atual

Estrutura principal do banco criada.

## Tabelas públicas

- categorias
- produtos
- produto_imagens
- secoes_home
- home_secao_produtos
- configuracoes_site

## Tabelas privadas

- administradores
- logs_auditoria

## Segurança atual

- RLS ativado em todas as tabelas públicas
- Nenhuma política pública criada
- Nenhum CRUD liberado
