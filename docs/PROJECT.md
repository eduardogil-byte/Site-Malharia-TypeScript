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

## Etapa atual

Configuração do Git, documentação e estrutura inicial do frontend.
