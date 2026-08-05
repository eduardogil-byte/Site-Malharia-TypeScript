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

- [x] Nenhuma tabela encontrada
- [ ] Foram encontrados problemas

### Acesso direto ao schema private

Resultado:

- [x] Nenhuma permissão indevida
- [ ] Foram encontrados problemas

### Funções RPC

Resultado:

- [x] RPCs administrativas bloqueadas para `anon`
- [x] RPCs administrativas disponíveis somente para usuários autenticados
- [ ] Foram encontrados problemas

### Funções security definer

Resultado:

- [x] Todas possuem `search_path` controlado
- [ ] Foram encontrados problemas

### Storage

Resultado:

- [x] Upload permitido somente para administradores
- [x] Exclusão permitida somente para administradores
- [x] Buckets com tamanho e MIME configurados
- [x] Não existem políticas de escrita para `anon`
- [ ] Foram encontrados problemas

## Correções necessárias

Nenhuma vulnerabilidade foi identificada nas consultas executadas.

Permanecem como verificações finais:

- corpo das funções `security definer`;
- permissões de criação nos schemas;
- ausência de `upsert` no Storage;
- variáveis de ambiente;
- cadastro público de usuários.

## Aprovação

- [x] Auditoria aprovada
- [ ] Auditoria requer correções
