<p align="center">

  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/fastify/fastify-original.svg" width="80" alt="Fastify Logo"/>

  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postgresql/postgresql-original.svg" width="80" alt="PostgreSQL Logo"/>

  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg" width="80" alt="React Logo"/>

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



| Tabela               | Descrição                                                                 |

|----------------------|---------------------------------------------------------------------------|

| `grupos`             | Grupos da Copa (A a L)                                                    |

| `paises`             | Seleções participantes, com bandeira e grupo                              |

| `jogos`              | Partidas, com fase, estádio e chaveamento (origens para mata‑mata)        |

| `resultados`         | Placar dos jogos encerrados (1:1 com jogos)                               |

| `perfis`             | Jogadores do bolão                                                        |

| `boloes`             | Bolões criados por um perfil                                              |

| `participantes_bolao`| Relacionamento N:N entre bolões e perfis (com pontuação acumulada)        |

| `palpites`           | Palpites de um perfil para um jogo dentro de um bolão                     |



### Relacionamentos



- **1:1** – `resultados` ↔ `jogos` (`UNIQUE` + FK).

- **1:N** – `grupos` → `paises`; `paises` → `jogos` (casa/fora); `perfis` → `boloes` (criador).

- **N:N** – `participantes_bolao` (perfil ↔ bolão) com atributos extras.



O script `database.sql` na raiz do projeto contém todas as instruções `CREATE TABLE` com constraints, índices e tipos ENUM necessários.



---



## 🏗️ Backend – Arquitetura



O backend segue uma arquitetura limpa e modular, utilizando **Fastify** como servidor HTTP e aplicando rigorosamente os princípios de **Vertical Slice**, **OOP** e **Injeção de Dependência**.



### Estrutura de Diretórios (Vertical Slice)



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



---



## 🖥️ Frontend (em breve)



O frontend será desenvolvido em **React 19 + Vite** e consumirá a API através de um proxy de desenvolvimento. A estrutura já está preparada:



- A pasta `frontend/` está pronta para receber o projeto Vite.

- O arquivo `vite.config.js` será configurado para redirecionar chamadas `/api` para o backend na porta 3000.

- O Swagger fornece uma documentação interativa que servirá de guia para a integração.



Atualmente, a API pode ser testada diretamente via Swagger UI em `http://localhost:3000/docs`.



---



## ⚡ Funcionalidades



| Recurso               | Rotas                                    | Descrição                                                                                     |

|-----------------------|------------------------------------------|-----------------------------------------------------------------------------------------------|

| **Países**            | `GET /paises`, `GET /paises/:id`         | Lista todos os países com seus grupos (JOIN)                                                  |

| **Perfis**            | `GET /perfis`, `POST /perfis`, `PATCH /perfis/:id`, `DELETE /perfis/:id` | CRUD completo de perfis de jogadores                                                          |

| **Bolões**            | `GET /boloes`, `POST /boloes`, `PATCH /boloes/:id`, `DELETE /boloes/:id`, `POST /boloes/:id/participantes` | CRUD de bolões + adição de participantes                                                      |

| **Jogos**             | `GET /jogos`, `GET /jogos/:id`, `POST /jogos`, `PATCH /jogos/:id`, `DELETE /jogos/:id` | CRUD completo de jogos (inclui chaveamento e resultados)                                     |

| **Resultados**        | `GET /resultados`, `GET /resultados/:id`, `POST /resultados`, `PATCH /resultados/:id`, `DELETE /resultados/:id` | CRUD de resultados com propagação automática de vencedor                                       |

| **Palpites**          | `GET /palpites`, `GET /palpites/:id`, `POST /palpites`, `PATCH /palpites/:id`, `DELETE /palpites/:id` | CRUD de palpites, validando participação no bolão e status do jogo                             |

| **Documentação**      | `/docs`                                  | Swagger UI interativa                                                                         |



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



## 📄 Licença



Este projeto está licenciado sob a Licença MIT – veja o arquivo [LICENSE](LICENSE) para mais detalhes.



---



<p align="center">

  Feito com ⚽ e muito JavaScript puro<br>

  <sub>API Bolão da Copa 2026 – Trabalho Prático de Arquitetura de Software</sub>

</p>
