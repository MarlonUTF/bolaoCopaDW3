<p align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" width="72" alt="Node.js" />
<<<<<<< Updated upstream

  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://cdn.simpleicons.org/fastify/FFFFFF" />
    <source media="(prefers-color-scheme: light)" srcset="https://cdn.simpleicons.org/fastify/000000" />
    <img src="https://cdn.simpleicons.org/fastify/000000" width="60" alt="Fastify" />
  </picture>

  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg" width="72" alt="PostgreSQL" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" width="72" alt="React" />
</p>


<h1 align="center">⚽ Bolão da Copa 2026</h1>



<p align="center">

  <b>API RESTful para organização de bolões da Copa do Mundo FIFA 2026</b><br>

  <sub>Grupos, jogos, resultados, chaveamento, palpites e pontuação em tempo real</sub>

</p>



<p align="center">

  <img src="https://img.shields.io/badge/Node.js-22-339933?style=flat&logo=node.js&logoColor=white" alt="Node.js">

  <img src="https://img.shields.io/badge/Fastify-5.x-000000?style=flat&logo=fastify&logoColor=white" alt="Fastify">

  <img src="https://img.shields.io/badge/PostgreSQL-16-4169E1?style=flat&logo=postgresql&logoColor=white" alt="PostgreSQL">

  <img src="https://img.shields.io/badge/React-19-61DAFB?style=flat&logo=react&logoColor=white" alt="React">

  <img src="https://img.shields.io/badge/Swagger-OpenAPI-85EA2D?style=flat&logo=swagger&logoColor=black" alt="Swagger">

  <br>

  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-yellow?style=flat" alt="License"></a>

  <a href="https://github.com/seu-usuario/bolao-copa"><img src="https://img.shields.io/badge/GitHub-Repo-181717?style=flat&logo=github" alt="GitHub"></a>

</p>



---



## 📖 Sobre o Projeto



O **Bolão da Copa 2026** é um sistema completo para criação e gerenciamento de bolões durante a Copa do Mundo FIFA 2026. A aplicação oferece uma API RESTful robusta, modelagem relacional completa (PostgreSQL), importação automática de dados reais via ESPN, e está preparada para receber um frontend React.



O projeto foi desenvolvido como trabalho prático da disciplina de **Desenvolvimento Web 3**, aplicando **Vertical Slice**, **Orientação a Objetos**, **Injeção de Dependência** e documentação com **Swagger/OpenAPI**.



---



## 📚 Índice



- [🎯 API – Visão Geral](#-api--visão-geral)

- [🗄️ Banco de Dados](#-banco-de-dados)

- [🏗️ Backend – Arquitetura](#-backend--arquitetura)

- [🖥️ Frontend (em breve)](#-frontend-em-breve)

- [⚡ Funcionalidades](#-funcionalidades)

- [🚀 Como Executar Localmente](#-como-executar-localmente)

- [📡 Endpoints e Documentação](#-endpoints-e-documentação)

- [📊 Modelagem Relacional](#-modelagem-relacional)

- [📌 Scripts e Importação de Dados](#-scripts-e-importação-de-dados)

- [📄 Licença](#-licença)

- [🙏 Agradecimentos](#-agradecimentos)



---



## 🎯 API – Visão Geral



A API do Bolão da Copa expõe todos os recursos necessários para um bolão completo:



- **Países e Grupos** – 48 seleções classificadas, distribuídas nos 12 grupos (A a L).

- **Jogos** – 100 partidas da fase de grupos até as quartas (dados reais da ESPN), com **chaveamento** automático das fases eliminatórias.

- **Resultados** – placares reais (gols, vencedor) importados automaticamente.

- **Perfis** – cadastro dos participantes do bolão.

- **Bolões** – criação de bolões com nome, descrição e criador.

- **Palpites** – cada participante pode registrar palpites (gols da casa e fora) para qualquer jogo, desde que ainda não encerrado.

- **Chaveamento inteligente** – ao cadastrar um resultado, o sistema **propaga automaticamente** o time vencedor para os jogos seguintes da eliminatória.



Todas as rotas seguem o padrão REST e estão documentadas com Swagger (disponível em `/docs` quando o servidor está rodando).



---



## 🗄️ Banco de Dados

O banco de dados foi modelado em **PostgreSQL** e é composto por **8 tabelas**:

| Tabela                 | Descrição                                                               |
|-------------------------|-------------------------------------------------------------------------|
| `grupos`                | Grupos da Copa do Mundo (A a L).                                        |
| `paises`                | Seleções participantes, com bandeira, sigla FIFA e grupo.               |
| `jogos`                 | Partidas da competição, incluindo fase, estádio e chaveamento.          |
| `resultados`            | Resultados oficiais dos jogos (relação 1:1 com `jogos`).                |
| `perfis`                | Perfis dos participantes do bolão.                                      |
| `boloes`                | Bolões criados por um perfil.                                           |
| `participantes_bolao`   | Relação N:N entre perfis e bolões, com pontuação acumulada.             |
| `palpites`              | Palpites registrados pelos participantes para cada jogo de um bolão.    |



### Relacionamentos



- **1:1** – `resultados` ↔ `jogos` (`UNIQUE` + FK).

- **1:N** – `grupos` → `paises`; `paises` → `jogos` (casa/fora); `perfis` → `boloes` (criador).

- **N:N** – `participantes_bolao` (perfil ↔ bolão) com atributos extras.



O script `database.sql` na raiz do projeto contém todas as instruções `CREATE TABLE` com constraints, índices e tipos ENUM necessários.



---



## 🏗️ Backend – Arquitetura



O backend segue uma arquitetura limpa e modular, utilizando **Fastify** como servidor HTTP e aplicando rigorosamente os princípios de **Vertical Slice**, **OOP** e **Injeção de Dependência**.



### Estrutura de Diretórios (Vertical Slice)



=======
  <img src="https://cdn.simpleicons.org/fastify/000000" width="60" alt="Fastify" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg" width="72" alt="PostgreSQL" />
</p>

<h1 align="center">⚽ Bolão da Copa 2026</h1>

<p align="center">
  <b>API RESTful para organização de bolões da Copa do Mundo FIFA 2026</b><br>
  <sub>Grupos, jogos, resultados, chaveamento e palpites</sub>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-18%2B-339933?style=flat&logo=node.js&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/Fastify-5.x-000000?style=flat&logo=fastify&logoColor=white" alt="Fastify">
  <img src="https://img.shields.io/badge/PostgreSQL-16-4169E1?style=flat&logo=postgresql&logoColor=white" alt="PostgreSQL">
  <img src="https://img.shields.io/badge/Swagger-OpenAPI-85EA2D?style=flat&logo=swagger&logoColor=black" alt="Swagger">
  <br>
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-yellow?style=flat" alt="License"></a>
</p>

---

## 📖 Sobre o Projeto

O **Bolão da Copa 2026** é uma API RESTful para criação e gerenciamento de bolões de palpites da Copa do Mundo FIFA 2026. O projeto foi desenvolvido como trabalho prático da disciplina de Arquitetura de Software, aplicando **Vertical Slice**, **Orientação a Objetos**, **Injeção de Dependência** e modelagem relacional em **PostgreSQL**, além de documentação automática com **Swagger/OpenAPI**.

Um script auxiliar importa dados reais da Copa (seleções, grupos, calendário e resultados) a partir da API pública da ESPN.

---

## 📚 Índice

- [🗄️ Banco de Dados](#-banco-de-dados)
- [🏗️ Arquitetura](#-arquitetura)
- [⚡ Funcionalidades e Regras de Negócio](#-funcionalidades-e-regras-de-negócio)
- [🚀 Como Executar Localmente](#-como-executar-localmente)
- [📡 Documentação da API](#-documentação-da-api)
- [📌 Script de Importação](#-script-de-importação)
- [📄 Licença](#-licença)

---

## 🗄️ Banco de Dados

Modelado em **PostgreSQL**, com **8 tabelas**:

| Tabela                 | Descrição                                                          |
|-------------------------|---------------------------------------------------------------------|
| `grupos`                | Grupos da Copa do Mundo (A a L).                                    |
| `paises`                | Seleções participantes, com bandeira, sigla FIFA e grupo.           |
| `jogos`                 | Partidas da competição, incluindo fase, estádio e chaveamento.      |
| `resultados`            | Resultados oficiais dos jogos.                                      |
| `perfis`                | Participantes do bolão.                                             |
| `boloes`                | Bolões criados por um perfil.                                       |
| `participantes_bolao`   | Tabela pivô entre perfis e bolões, com pontuação acumulada.         |
| `palpites`              | Palpites registrados por participantes para cada jogo de um bolão.  |

### Relacionamentos exigidos pela atividade

- **1:1** — `resultados` ↔ `jogos` (`UNIQUE` em `jogo_id` + FK).
- **1:N** — `grupos` → `paises`; `perfis` → `boloes` (criador); `paises` → `jogos` (casa/fora).
- **N:N** — `participantes_bolao` (tabela associativa entre `perfis` e `boloes`, com atributos extras como `pontuacao_total`). `palpites` também representa uma relação N:N "resolvida" entre `perfis`/`boloes` e `jogos`.

O arquivo `database.sql`, na raiz do projeto, contém todos os `CREATE TABLE` com PKs, FKs e constraints necessárias para recriar o banco do zero.

---

## 🏗️ Arquitetura

O backend usa **Fastify**, seguindo rigorosamente **Vertical Slice**, **OOP** e **Injeção de Dependência**.

```
backend/
├── database.sql
├── package.json
├── .env
├── scripts/
│   ├── importarCopa.js      # busca dados reais da Copa na API da ESPN
│   └── runImport.js         # roda a importação e encerra o processo
└── src/
    ├── server.js            # Fastify, CORS, Swagger e registro das rotas
    ├── database/
    │   └── pool.js           # única fonte de conexão com o pg
    ├── shared/
    │   ├── AppError.js       # classe de erro customizada
    │   ├── errorHandler.js   # Error Handler Global
    │   └── errorSchema.js    # schema de erro reutilizável no Swagger
    └── features/
        ├── perfis/
        │   ├── controller.js
        │   ├── service.js
        │   ├── repository.js
        │   └── route.js
        ├── paises/      (mesma estrutura)
        ├── boloes/      (mesma estrutura)
        ├── jogos/       (mesma estrutura)
        ├── resultados/  (mesma estrutura)
        └── palpites/    (mesma estrutura)
```

Cada feature segue exatamente as mesmas camadas, implementadas como **Classes**:

- **Controller** — só recebe `req`/`reply`, extrai dados e devolve a resposta. Não contém lógica de negócio.
- **Service** — regras de negócio e validações. Lança `throw new AppError(mensagem, statusCode)` quando algo é inválido. **Nunca** importa `pg` nem conhece `req`/`reply`.
- **Repository** — única camada autorizada a importar `pg` (via `Pool`) e rodar SQL.
- **`route.js`** — monta as instâncias com `new` e injeta as dependências via construtor (`new Service(repository)`, `new Controller(service)`). É o único lugar onde `new` aparece fora do Repository.

### Regras de negócio implementadas

1. Não é possível cadastrar um resultado para um jogo que já possui resultado.
2. Não é possível excluir um jogo já encerrado.
3. Não é possível criar, atualizar ou remover um palpite de um jogo já encerrado.
4. Um perfil não pode participar do mesmo bolão duas vezes.
5. Um perfil não pode registrar dois palpites para o mesmo jogo dentro do mesmo bolão.
6. Um palpite só pode ser criado se o perfil for participante do bolão informado.
7. Ao cadastrar um bolão, o `criador_perfil_id` precisa corresponder a um perfil existente.
8. Ao cadastrar/atualizar um resultado com `vencedor_id`, o time vencedor é propagado automaticamente para os jogos seguintes do chaveamento (ex: um jogo de oitavas que depende do "vencedor do jogo 49").

### Tratamento de erros

Toda exceção de negócio é lançada como `AppError` e capturada pelo **Error Handler Global** (`src/shared/errorHandler.js`), registrado via `server.setErrorHandler(...)`. Ele também traduz erros nativos do driver `pg` (violação de `UNIQUE`, `FOREIGN KEY` e `CHECK`) para o mesmo formato de resposta, sem nenhum `if/else` de tratamento de erro nos Controllers:

```json
{ "status": "error", "message": "Descrição do erro" }
>>>>>>> Stashed changes
```

src/

├── database/

│   └── pool.js              # Conexão com PostgreSQL (pg Pool)

├── features/

│   ├── boloes/

│   │   ├── controller.js

│   │   ├── service.js

│   │   ├── repository.js

│   │   └── routes.js

│   ├── jogos/

│   ├── paises/

│   ├── palpites/

│   ├── perfis/

│   └── resultados/

├── shared/

│   ├── AppError.js          # Classe de erro customizada

│   ├── errorHandler.js      # Tratamento global de erros

│   └── errorSchema.js       # Schema reutilizável para Swagger

└── server.js                # Configuração do Fastify, CORS, Swagger e rotas

```



Cada feature (`jogos`, `boloes`, etc.) possui exatamente as mesmas camadas:



- **Controller** – recebe a requisição HTTP, extrai parâmetros e delega ao Service.

- **Service** – implementa as regras de negócio, validações e exceções (`AppError`).

- **Repository** – única camada que acessa o banco de dados (importa `pg`), executando queries SQL.

- **Routes** – monta as instâncias (injeção de dependência) e registra as rotas no Fastify com schemas de validação e resposta (Swagger).



### Regras de Negócio Implementadas



- Não é possível cadastrar um resultado para um jogo que já possui resultado.

- Não é possível criar/atualizar/remover um palpite de um jogo já encerrado.

- Não é possível excluir um jogo encerrado.

- Ao remover um resultado, o jogo volta ao estado "aberto" (encerrado = false).

- Ao cadastrar/atualizar um resultado com vencedor, o time é propagado automaticamente para os jogos seguintes (chaveamento).

- Um perfil só pode participar de um bolão uma única vez.

- Ao criar um bolão, o criador deve existir como perfil.

- Palpites exigem que o perfil seja participante do bolão e que o jogo ainda não esteja encerrado.



### Tratamento de Erros



Toda exceção lançada nos Services com `throw new AppError(mensagem, statusCode)` é capturada por um **Error Handler Global** registrado no Fastify. A resposta padronizada tem o formato:



```json

{ "status": "error", "message": "Descrição do erro" }

```

<<<<<<< Updated upstream


---



## 🖥️ Frontend (em breve)



O frontend será desenvolvido em **React 19 + Vite** e consumirá a API através de um proxy de desenvolvimento. A estrutura já está preparada:



- A pasta `frontend/` está pronta para receber o projeto Vite.

- O arquivo `vite.config.js` será configurado para redirecionar chamadas `/api` para o backend na porta 3000.

- O Swagger fornece uma documentação interativa que servirá de guia para a integração.



Atualmente, a API pode ser testada diretamente via Swagger UI em `http://localhost:3000/docs`.



---



## ⚡ Funcionalidades

| Recurso | Rotas | Descrição |
|----------|--------|-----------|
| **Países** | `GET /paises`<br>`GET /paises/:id` | Consulta das seleções participantes e seus respectivos grupos. |
| **Perfis** | `GET /perfis`<br>`POST /perfis`<br>`PATCH /perfis/:id`<br>`DELETE /perfis/:id` | CRUD completo de perfis dos participantes. |
| **Bolões** | `GET /boloes`<br>`POST /boloes`<br>`PATCH /boloes/:id`<br>`DELETE /boloes/:id`<br>`POST /boloes/:id/participantes` | Gerenciamento de bolões e inclusão de participantes. |
| **Jogos** | `GET /jogos`<br>`GET /jogos/:id`<br>`POST /jogos`<br>`PATCH /jogos/:id`<br>`DELETE /jogos/:id` | CRUD de partidas, incluindo chaveamento e controle de resultados. |
| **Resultados** | `GET /resultados`<br>`GET /resultados/:id`<br>`POST /resultados`<br>`PATCH /resultados/:id`<br>`DELETE /resultados/:id` | Gerenciamento dos resultados oficiais com propagação automática dos vencedores. |
| **Palpites** | `GET /palpites`<br>`GET /palpites/:id`<br>`POST /palpites`<br>`PATCH /palpites/:id`<br>`DELETE /palpites/:id` | CRUD de palpites, validando participação no bolão e status da partida. |
| **Documentação** | `/docs` | Interface interativa do Swagger/OpenAPI para teste e exploração da API. |

---



## 🚀 Como Executar Localmente



### Pré‑requisitos



- Node.js 18 ou superior

- PostgreSQL (pode ser local ou via [Neon](https://neon.tech))

- Um banco de dados criado (use o script `database.sql`)



### 1. Clone o repositório e instale as dependências



```bash

git clone https://github.com/seu-usuario/bolao-copa-2026.git

cd bolao-copa-2026/backend

npm install

```



### 2. Configure as variáveis de ambiente



Crie um arquivo `.env` na pasta `backend/` com o seguinte conteúdo:



```env

DATABASE_URL=postgresql://usuario:senha@host:5432/nome_do_banco?sslmode=require

PORT=3000

```



Se estiver usando o Neon, a URL já virá com SSL. Exemplo:



```env

DATABASE_URL=postgresql://neondb_owner:xxxx@ep-xxx.us-east-1.aws.neon.tech/neondb?sslmode=require&uselibpqcompat=true

```



### 3. Execute o script de criação do banco



Conecte-se ao PostgreSQL e execute o arquivo `database.sql` (localizado na raiz do repositório):



```bash

psql $DATABASE_URL -f database.sql

```



### 4. Importe os dados da Copa (times, jogos e resultados)



```bash

node scripts/importarCopa.js

```



Este script buscará os dados reais da ESPN (grupos, seleções, calendário e placares) e preencherá todas as tabelas. Ele pode ser executado periodicamente para manter os dados atualizados.



### 5. Inicie o servidor



```bash

node src/server.js

```



A API estará disponível em `http://localhost:3000` e a documentação Swagger em `http://localhost:3000/docs`.



### (Opcional) Frontend



```bash

cd ../frontend

npm install

npm run dev

```



O frontend React (quando implementado) estará em `http://localhost:5173`.



---



## 📡 Endpoints e Documentação



Com o servidor rodando, acesse `http://localhost:3000/docs` para explorar todos os endpoints, testar requisições e visualizar os schemas de entrada e saída.



A documentação inclui:



- Métodos (`GET`, `POST`, `PATCH`, `DELETE`)

- Parâmetros de rota (`/jogos/:id`)

- Corpo das requisições (JSON)

- Respostas de sucesso (`200`, `201`)

- Respostas de erro (`400`, `404`) com o formato padrão



---



## 📊 Modelagem Relacional



O diagrama abaixo representa a estrutura do banco (todas as constraints e relacionamentos):



```

┌───────────┐       ┌───────────┐

│  grupos   │1    N │  paises   │

│───────────│───────│───────────│

│ id (PK)   │       │ id (PK)   │

│ nome      │       │ nome      │

└───────────┘       │ sigla_fifa│

                    │ grupo_id  │ (FK)

                    └───────────┘

                          │1

                          │

                          │N

┌──────────────────────────────────────────────┐

│                   jogos                      │

│──────────────────────────────────────────────│

│ id (PK)                                      │

│ numero_jogo (UNIQUE)                         │

│ fase (ENUM)                                  │

│ data_hora                                    │

│ pais_casa_id (FK → paises)                   │

│ pais_fora_id (FK → paises)                   │

│ origem_casa_jogo_id (FK → jogos)             │

│ ... (outros campos de chaveamento)            │

└──────────────────────────────────────────────┘

         │1                           │1

         │                            │

         │1                           │1

┌──────────────────┐     ┌──────────────────┐

│   resultados     │     │     palpites     │

│──────────────────│     │──────────────────│

│ id (PK)          │     │ id (PK)          │

│ jogo_id (UNIQUE) │     │ perfil_id (FK)   │

│ gols_casa        │     │ bolao_id (FK)    │

│ vencedor_id (FK) │     │ jogo_id (FK)     │

└──────────────────┘     └──────────────────┘

                                 │

                                 │

┌───────────┐       ┌───────────────┐

│  perfis   │1    N │   boloes      │

│───────────│───────│───────────────│

│ id (PK)   │       │ id (PK)       │

│ nome      │       │ nome          │

└───────────┘       │ criador_id(FK)│

                    └───────────────┘

                         │N          │N

                         │    participantes_bolao

                         └────┼────────────────┘

                              │ perfil_id (FK)

                              │ bolao_id (FK)

```



---



## 📌 Scripts e Importação de Dados



O script `scripts/importarCopa.js` é responsável por:



- Buscar as 48 seleções via API da ESPN e associá‑las aos 12 grupos.

- Importar todos os jogos do calendário oficial (11/06 a 19/07/2026), incluindo fase de grupos e mata‑mata.

- Preencher automaticamente as origens do chaveamento (ex.: `Winner 49` → ID real do jogo).

- Registrar resultados reais (placares) dos jogos já encerrados.



**Atenção:** como a Copa ainda não aconteceu, os dados são carregados conforme a ESPN os publica. Jogos sem times definidos (ex.: `TBD vs TBD`) aparecerão com `pais_casa_id` e `pais_fora_id` nulos, sendo atualizados automaticamente quando os confrontos forem definidos.



Execute periodicamente para manter o banco sincronizado:



```bash

node backend/scripts/importarCopa.js

```



---


## 🙏 Agradecimentos

Os dados utilizados para alimentar automaticamente o banco de dados (seleções, grupos, calendário e resultados da Copa do Mundo FIFA 2026) são obtidos por meio da API pública da ESPN.

Este projeto utiliza a documentação mantida pela comunidade:

- **ESPN Public API Documentation**
  https://github.com/pseudo-r/Public-ESPN-API

A documentação é um projeto independente e não possui afiliação oficial com a ESPN.

Agradecimentos ao mantenedor da documentação por disponibilizar e manter este excelente trabalho para a comunidade open source.
=======
## ⚡ Funcionalidades e Regras de Negócio

| Recurso | Rotas | Descrição |
|----------|--------|-----------|
| **Países** | `GET /paises`<br>`GET /paises/:id` | Consulta das seleções e seus grupos (JOIN com `grupos`). |
| **Perfis** | `GET /perfis`<br>`POST /perfis`<br>`PATCH /perfis/:id`<br>`DELETE /perfis/:id` | CRUD completo dos participantes. |
| **Bolões** | `GET /boloes`<br>`GET /boloes/:id`<br>`POST /boloes`<br>`PATCH /boloes/:id`<br>`DELETE /boloes/:id`<br>`GET /boloes/:id/participantes`<br>`POST /boloes/:id/participantes` | CRUD de bolões (JOIN com `perfis` para trazer o nome do criador) e gestão de participantes. |
| **Jogos** | `GET /jogos`<br>`GET /jogos/:id`<br>`POST /jogos`<br>`PATCH /jogos/:id`<br>`DELETE /jogos/:id` | CRUD de partidas. `GET` faz `LEFT JOIN` com `paises` (times da casa/fora) e `resultados`, trazendo nomes e placares — não apenas IDs. |
| **Resultados** | `GET /resultados`<br>`GET /resultados/:id`<br>`POST /resultados`<br>`PATCH /resultados/:id`<br>`DELETE /resultados/:id` | Registro de placares com propagação automática do chaveamento. |
| **Palpites** | `GET /palpites`<br>`GET /palpites/:id`<br>`POST /palpites`<br>`PATCH /palpites/:id`<br>`DELETE /palpites/:id` | CRUD de palpites, com `JOIN` trazendo nome do perfil, do bolão e dos países do confronto. |
| **Documentação** | `/docs` | Interface interativa do Swagger/OpenAPI. |

---

## 🚀 Como Executar Localmente

### Pré-requisitos

- Node.js 18 ou superior
- Um banco PostgreSQL acessível (local ou serviço como [Neon](https://neon.tech))

### 1. Clone o repositório e instale as dependências

```bash
git clone https://github.com/seu-usuario/bolao-copa-2026.git
cd bolao-copa-2026/backend
npm install
```

### 2. Configure as variáveis de ambiente

Crie um arquivo `.env` na pasta `backend/` (use `.env.example` como base):

```env
DATABASE_URL="postgresql://usuario:senha@host:5432/nome_do_banco?sslmode=require"
PORT=3000
```

### 3. Execute o script de criação do banco

```bash
psql "$DATABASE_URL" -f database.sql
```

### 4. (Opcional) Importe os dados reais da Copa

```bash
npm run importar
```

Busca seleções, calendário e placares na API pública da ESPN e preenche `grupos`, `paises`, `jogos` e `resultados`. Pode ser executado novamente a qualquer momento para atualizar os dados — o script usa `ON CONFLICT` para não duplicar registros.

> Como a Copa ainda não aconteceu, jogos com confronto ainda não definido (`TBD vs TBD`) ficam com `pais_casa_id`/`pais_fora_id` nulos até serem definidos pela ESPN.

### 5. Inicie o servidor

```bash
npm start
```

A API estará em `http://localhost:3000` e a documentação Swagger em `http://localhost:3000/docs`.

Para desenvolvimento com recarregamento automático:

```bash
npm run dev
```

---

## 📡 Documentação da API

Com o servidor rodando, acesse **`http://localhost:3000/docs`**.

A documentação Swagger cobre, para cada endpoint:

- Método HTTP (`GET`, `POST`, `PATCH`, `DELETE`);
- Parâmetros de rota (ex: `/jogos/:id`);
- Formato do corpo (`body`) esperado em `POST`/`PATCH`;
- Ao menos uma resposta de sucesso (`200`/`201`) e uma de erro (`400`/`404`) no formato padronizado do Error Handler Global.

---

## 📌 Script de Importação

`scripts/importarCopa.js` exporta a função `importarDadosESPN()`, responsável por:

- Criar os 12 grupos (A–L) e importar as 48 seleções via API da ESPN;
- Importar o calendário oficial de jogos (fase de grupos e mata-mata);
- Resolver automaticamente as origens do chaveamento (ex: converter `"Winner 49"` no ID real do jogo 49);
- Registrar os placares dos jogos já encerrados.

`scripts/runImport.js` apenas chama essa função e encerra o processo — é o que roda quando você executa `npm run importar`.

---

## 🙏 Créditos dos Dados

Os dados de seleções, grupos, calendário e resultados são obtidos da API pública da ESPN, com base na documentação mantida pela comunidade em [pseudo-r/Public-ESPN-API](https://github.com/pseudo-r/Public-ESPN-API) (projeto independente, sem afiliação oficial com a ESPN).
>>>>>>> Stashed changes

---

## 📄 Licença

<<<<<<< Updated upstream


Este projeto está licenciado sob a Licença MIT – veja o arquivo [LICENSE](LICENSE) para mais detalhes.



---



<p align="center">

  Feito com ⚽ e muito JavaScript puro<br>

  <sub>API Bolão da Copa 2026 – Trabalho Prático de Arquitetura de Software</sub>

=======
Este projeto está licenciado sob a Licença MIT — veja o arquivo [LICENSE](LICENSE) para mais detalhes.

<p align="center">
  Feito com ⚽ e Node.js<br>
  <sub>API Bolão da Copa 2026 — Trabalho Prático de Arquitetura de Software</sub>
>>>>>>> Stashed changes
</p>
