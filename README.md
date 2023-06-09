[![Node.js CI](https://github.com/dan-santos/valoriza/actions/workflows/node.js.yml/badge.svg)](https://github.com/dan-santos/valoriza/actions/workflows/node.js.yml)
## Regras
- Cadastro de usuário

  [x] Não é permitido cadastrar mais de um usuário com o mesmo email

  [x] Não é permitido cadastrar usuário sem email

- Cadastro de Tag
  
  [x] Não é permitido cadastrar mais de uma tag com o mesmo nome

  [x] Não é permitido cadastrar tag sem nome

  [x] Não é permitido o cadastro por usuários que não sejam administradores

- Cadastro de elogios

  [x] Não é permitido um usuário cadastrar um elogio para si mesmo

  [x] Não é permitido cadastrar elogios para usuários inválidos ou inexistentes

  [x] O usuário precisa estar autenticado na aplicação

## Refatoração
  
  [x] CRUD de Tags

  [x] CRUD de Users

  [x] CRUD de Compliments

  [x] Somente Admins podem criar, deletar ou editar tags

  [x] Somente usuários autores (senders) de compliments podem editar elas

  [x] Somente usuários autores (senders) ou admins de compliments podem deletar elas

  [x] Users podem ser deletados ou editados por admins ou por eles próprios

  [x] Usuários devem ser por padrão criados com o admin=false

  [x] Deixar de user parametro Partial<T> na camada de service e usar interface no lugar

  [x] Alterar tabela e colocar a flag @OnDelete e @OnUpdate na tabela de compliments, users e tags

  [x] Mudar SQLite para postgres
  
  [x] Testes unitários com vitest

  [x] Testes de integração com prisma + vitest

  [x] Logger para requisições (morgan)

  [x] Subir na nuvem
