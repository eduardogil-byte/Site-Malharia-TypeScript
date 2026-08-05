# Auditoria de segurança

Data da auditoria: 2026-08-05

## Escopo

A auditoria verificou:

- RLS das tabelas públicas;
- acesso às tabelas privadas;
- políticas para `anon`;
- políticas para `authenticated`;
- permissões das funções RPC;
- funções `security definer`;
- configuração do Storage;
- arquivos órfãos;
- variáveis de ambiente;
- exposição de chaves privadas;
- criação pública de usuários.

## Resultados

### Tabelas públicas sem RLS

Resultado:

- [ ] Nenhuma tabela encontrada
- [ ] Foram encontrados problemas

Observações:

### Acesso direto ao schema private

Resultado:

- [ ] Nenhuma permissão indevida
- [ ] Foram encontrados problemas

Observações:

### Funções RPC

Resultado:

- [ ] RPCs administrativas bloqueadas para `anon`
- [ ] RPCs validam se o usuário é administrador
- [ ] Foram encontrados problemas

Observações:

### Funções security definer

Resultado:

- [ ] Todas possuem `search_path` controlado
- [ ] Foram encontrados problemas

Observações:

### Storage

Resultado:

- [ ] Upload permitido somente para administradores
- [ ] Exclusão permitida somente para administradores
- [ ] Buckets com tamanho e MIME configurados
- [ ] Não existem políticas de escrita para `anon`
- [ ] Foram encontrados problemas

Observações:

### Arquivos órfãos

Resultado:

- [ ] Nenhum arquivo órfão
- [ ] Existem arquivos para revisar

Observações:

### Variáveis de ambiente

Resultado:

- [ ] `.env.local` está ignorado
- [ ] `.env.local` não está versionado
- [ ] Nenhuma chave privada foi encontrada
- [ ] Foram encontrados problemas

Observações:

### Autenticação

Resultado:

- [ ] Cadastro público está desativado
- [ ] Usuário autenticado comum não é administrador
- [ ] Administração depende de `private.administradores`
- [ ] Foram encontrados problemas

Observações:

## Correções necessárias

Nenhuma correção registrada até o momento.

## Aprovação

- [ ] Auditoria aprovada
- [ ] Auditoria requer correções
