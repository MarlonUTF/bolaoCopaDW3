# GitHub Copilot instructions for Bolão da Copa 2026

- Responda sempre em Português do Brasil.
- Este projeto é uma API Node.js com **Fastify** e **PostgreSQL**.
- O padrão de arquitetura é **Vertical Slice**: cada feature tem `route.js`, `controller.js`, `service.js` e `repository.js`.

## Estrutura importante
- `src/server.js`: registra plugins Fastify, Swagger e todas as rotas de feature.
- `src/database/pool.js`: única conexão com PostgreSQL, use sempre `pool.query()` nesta camada.
- `src/shared/AppError.js`: erros de domínio lançados pelos serviços.
- `src/shared/errorHandler.js`: handler global do Fastify. Controllers não devem capturar erros, apenas lançar ou deixar propagar.

## Convenções de implementação
- `route.js` monta a cadeia: `new Repository()` → `new Service(repository)` → `new Controller(service)`.
- `controller.js` recebe `request` e `reply`, chama o service e retorna `reply.send(...)` ou `reply.status(...).send(...)`.
- `service.js` contém validações de negócio e deve lançar `new AppError(message, statusCode)` quando necessário.
- `repository.js` contém SQL puro e não deve acessar `request`/`reply` ou lógica de validação.
- Use `export default NomeDaClasse` em todos os arquivos de feature.

## Regras de camada
- Nunca colocar SQL em `controller.js` ou `service.js`.
- Nunca usar `new` dentro de `Controller` ou `Service` para criar dependências.
- Nunca tratar erros manualmente no controller; deixe o `errorHandler` global lidar com eles.
- Use `async/await` em todas as operações assíncronas.

## Rotas e documentação
- Todas as rotas devem ser documentadas com schema Swagger dentro do `route.js`.
- O Swagger UI está exposto em `/docs` depois de iniciar o servidor.
- Cada rota define `tags`, `params`, `body` e `response` quando aplicável.

## Execução
- Instalação: `npm install`
- Desenvolvimento: `npm run dev`
- Produção: `npm start`

## Dependências e ambiente
- Usa pacote `pg` e conexão via variável `DATABASE_URL` em `src/database/pool.js`.
- O projeto não possui scripts de teste atualmente.

## Fluxo típico
1. Request chega em `src/server.js`
2. `route.js` mapeia endpoint para controller
3. `controller.js` recebe dados e chama `service.js`
4. `service.js` aplica regras e chama `repository.js`
5. `repository.js` executa SQL no PostgreSQL
6. Resultado volta até o cliente via Fastify

## Commit e estilo de PR
- Para mensagens de commit, siga o padrão definido em `.github/instructions/commmit.instructions.md`.
- Use mensagens em Português com Conventional Commits e GitMoji.
