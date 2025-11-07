# Plataforma de Gestão para Grupos de Networking

## 📝 Descrição do Projeto

Esta é uma plataforma fullstack desenvolvida como solução para o teste técnico de Desenvolvedor Fullstack. O objetivo é simular um desafio real de desenvolvimento de software, criando uma **Plataforma de Gestão para Grupos de Networking** focada em geração de negócios.

A aplicação foi construída do zero, seguindo as melhores práticas de desenvolvimento, incluindo **Test-Driven Development (TDD)**, código limpo, componentização, testes automatizados e integração contínua (CI/CD).

### Funcionalidades Implementadas

#### Módulo Obrigatório: Fluxo de Admissão de Membros

1.  **Página de Intenção (Pública)**: Um formulário público onde interessados podem manifestar seu interesse em participar do grupo, fornecendo nome, email, empresa e motivação.
2.  **Área do Administrador (Privada)**: Uma área protegida onde um administrador pode visualizar todas as intenções submetidas, aprovar ou recusar cada uma delas.
3.  **Cadastro Completo (Token-based)**: Ao aprovar uma intenção, o sistema gera um convite com um token único. O novo membro utiliza esse token para acessar uma página de cadastro completo e finalizar sua inscrição.

#### Módulo Opcional: Sistema de Indicações

1.  **Criação de Indicações**: Membros logados podem criar indicações de negócio para outros membros do grupo.
2.  **Listagem de Indicações**: Uma página onde os membros podem visualizar as indicações que fizeram e as que receberam, separadas por abas.
3.  **Atualização de Status**: O membro que recebeu a indicação pode atualizar o status da mesma (Nova, Em Contato, Fechada, Recusada).

## ✨ Tecnologias Utilizadas

| Categoria | Tecnologia | Versão/Descrição |
| :--- | :--- | :--- |
| **Frontend** | Next.js | 14 (com App Router) |
| | React | 18 |
| | TypeScript | 5 |
| | Tailwind CSS | 4 |
| **Backend** | Next.js API Routes | Integrado ao Next.js |
| **Banco de Dados** | PostgreSQL | Banco de dados relacional |
| **ORM** | Prisma | 6.18 |
| **Testes** | Jest | 30 |
| | React Testing Library | 16 |
| **Validação** | Zod | 4 |
| **Formulários** | React Hook Form | 7 |
| **CI/CD** | GitHub Actions | Automação de testes e build |
| **Linting** | ESLint | 9 |
| **Formatação** | Prettier | 3 |

## 🚀 Como Executar o Projeto

### Pré-requisitos

-   [Node.js](https://nodejs.org/en/) (versão 22.x ou superior)
-   [npm](https://www.npmjs.com/) (geralmente vem com o Node.js)
-   [Docker](https://www.docker.com/) (para rodar o banco de dados PostgreSQL facilmente)

### 1. Clonar o Repositório

```bash
git clone https://github.com/seu-usuario/networking-platform.git
cd networking-platform
```

### 2. Configurar Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto, copiando o exemplo `.env.example`:

```bash
cp .env.example .env
```

O arquivo `.env` terá a seguinte estrutura:

```env
# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/networking_platform?schema=public"

# Admin Key (para proteção de rotas administrativas)
ADMIN_KEY="admin_secret_key_123"

# Next.js
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 3. Instalar Dependências

```bash
npm install
```

### 4. Configurar o Banco de Dados com Docker

Você pode rodar uma instância do PostgreSQL usando Docker com o seguinte comando:

```bash
docker run --name networking-db -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=networking_platform -p 5432:5432 -d postgres
```

### 5. Aplicar as Migrations do Prisma

Com o banco de dados rodando, aplique as migrations para criar as tabelas:

```bash
npm run prisma:migrate
```

### 6. Gerar o Cliente Prisma

```bash
npm run prisma:generate
```

### 7. Rodar a Aplicação

Agora, inicie o servidor de desenvolvimento:

```bash
npm run dev
```

A aplicação estará disponível em [http://localhost:3000](http://localhost:3000).

## 🧪 Testes

O projeto foi desenvolvido utilizando TDD e possui uma suíte de testes para garantir a qualidade e o funcionamento correto das funcionalidades.

Para rodar todos os testes:

```bash
npm test
```

Para rodar os testes em modo *watch*:

```bash
npm run test:watch
```

Para gerar o relatório de cobertura de testes:

```bash
npm run test:coverage
```

## 📂 Estrutura do Projeto

A estrutura de pastas segue as convenções do Next.js 14 com App Router, organizando os arquivos de forma lógica e escalável.

```
networking-platform/
├── app/                         # Rotas e páginas da aplicação
│   ├── (public)/                # Rotas públicas
│   ├── (admin)/                 # Rotas administrativas
│   ├── (member)/                # Rotas de membros
│   └── api/                     # API Routes (backend)
├── components/                  # Componentes React
│   ├── ui/                      # Componentes UI reutilizáveis
│   ├── forms/                   # Componentes de formulários
│   └── layouts/                 # Componentes de layout
├── lib/                         # Funções e utilitários
│   ├── db/                      # Configuração do Prisma
│   ├── validations/             # Schemas de validação Zod
│   └── utils/                   # Utilitários gerais
├── prisma/                      # Configurações do Prisma ORM
│   ├── schema.prisma          # Schema do banco de dados
│   └── migrations/              # Migrations do banco
├── __tests__/                   # Arquivos de teste
├── .github/workflows/         # Workflows de CI/CD
├── ARQUITETURA.md             # Documento de arquitetura
└── README.md                  # Este arquivo
```

## 🔗 Documentação da Arquitetura

Para uma visão detalhada da arquitetura do sistema, componentes, modelo de dados e decisões de design, consulte o documento [ARQUITETURA.md](./ARQUITETURA.md).

## 🤖 CI/CD

O projeto utiliza **GitHub Actions** para integração e entrega contínua. O workflow, definido em `.github/workflows/ci.yml`, é acionado a cada `push` ou `pull_request` nas branches `main` e `develop`.

O pipeline executa os seguintes jobs:

1.  **Lint**: Verifica a formatação e a qualidade do código com ESLint e Prettier.
2.  **Test**: Roda todos os testes unitários e de integração, e envia o relatório de cobertura para o Codecov.
3.  **Type Check**: Verifica a tipagem de todo o projeto com o compilador TypeScript.
4.  **Build**: Compila a aplicação para produção para garantir que não há erros de build.

## Comunicação e Engajamento

Aviso {id, titulo, conteudo, publicoAlvo(enum: TODOS|ADMIN|MEMBROS), publicadoEm}

Endpoints:

POST /api/avisos (admin)

GET /api/avisos?audiencia=MEMBROS

Check-in {id, membroId, reuniaoId, status(enum: PRESENTE|FALTOU), timestamp}

POST /api/checkins (membro)

GET /api/checkins?reuniaoId=... (admin)

## Acompanhamento e Performance

Reuniao1a1 {id, membroAId, membroBId, data, objetivo, notas}

POST /api/1a1 | GET /api/1a1?membroId=...

## Dashboards/Relatórios (visão)

KPIs: membros ativos, indicações por mês, “obrigados” por mês

Estratégia: endpoints agregadores (GET /api/metrics?periodo=mensal), consultas Prisma (GROUP BY) ou materialização simples.

## Financeiro

Mensalidade {id, membroId, competencia(YYYY-MM), valor, status(enum: PENDENTE|PAGO|ATRASADO), vencimento}

POST /api/mensalidades (admin gera)

PATCH /api/mensalidades/:id (atualiza status)

GET /api/mensalidades?membroId=...&periodo=...


## 👨‍💻 Desenvolvedor

-   **Luiz Felipe Apolinário**
