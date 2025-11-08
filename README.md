# Plataforma de Gestão para Grupos de Networking

## 📝 Descrição do Projeto

Esta é uma plataforma fullstack desenvolvida como solução para um teste técnico de Desenvolvedor Fullstack. O objetivo é simular um desafio real de desenvolvimento de software, criando uma **Plataforma de Gestão para Grupos de Networking** focada em geração de negócios.

A aplicação foi construída do zero, seguindo as melhores práticas de desenvolvimento, incluindo **Test-Driven Development (TDD)**, código limpo, componentização, testes automatizados e integração contínua (CI/CD).

### Funcionalidades Implementadas

#### Módulo Obrigatório: Fluxo de Admissão de Membros

1.  **Página de Intenção (Pública)**: Um formulário público onde interessados podem manifestar seu interesse em participar do grupo.
2.  **Área do Administrador (Privada)**: Uma área protegida onde um administrador pode visualizar, aprovar ou recusar as intenções submetidas.
3.  **Cadastro Completo (Token-based)**: Ao aprovar uma intenção, o sistema gera um convite com um token único para o novo membro finalizar seu cadastro.

#### Módulo Opcional: Sistema de Indicações

1.  **Criação de Indicações**: Membros podem criar indicações de negócio para outros membros.
2.  **Listagem de Indicações**: Visualização das indicações feitas e recebidas.
3.  **Atualização de Status**: O membro que recebeu a indicação pode atualizar o status da mesma.

## ✨ Tecnologias Utilizadas

| Categoria | Tecnologia |
| :--- | :--- |
| **Frontend** | Next.js, React, TypeScript, Tailwind CSS |
| **Backend** | Next.js API Routes, Node.js |
| **Banco de Dados** | PostgreSQL, Prisma ORM |
| **Testes** | Jest, React Testing Library |
| **Validação** | Zod, React Hook Form |
| **CI/CD** | GitHub Actions |
| **Linting** | ESLint, Prettier |

## 🚀 Como Executar o Projeto

### Pré-requisitos

-   [Node.js](https://nodejs.org/en/) (versão 22.x ou superior)
-   [npm](https://www.npmjs.com/)
-   [Docker](https://www.docker.com/) (para o banco de dados)

### 1. Clonar o Repositório

```bash
git clone https://github.com/lfelipeapo/networking-platform.git
cd networking-platform
```

### 2. Configurar Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto, copiando o exemplo `.env.example`:

```bash
cp .env.example .env
```

### 3. Instalar Dependências

```bash
npm install
```

### 4. Configurar o Banco de Dados com Docker

```bash
docker run --name networking-db -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=networking_platform -p 5432:5432 -d postgres
```

### 5. Aplicar as Migrations do Prisma

Com o banco de dados rodando, aplique as migrations para criar as tabelas:

```bash
npx prisma migrate deploy
```

Este comando irá executar os arquivos de migração existentes na pasta `prisma/migrations`.

### 6. Rodar a Aplicação

```bash
npm run dev
```

A aplicação estará disponível em [http://localhost:3000](http://localhost:3000).

## 🧪 Testes

Para rodar todos os testes:

```bash
npm test
```

## 📂 Estrutura do Projeto

```
networking-platform/
├── app/             # Rotas e páginas
├── components/      # Componentes React
├── lib/             # Funções e utilitários
├── prisma/          # Configurações do Prisma ORM
├── __tests__/       # Arquivos de teste
├── .github/         # Workflows de CI/CD
├── ARQUITETURA.md # Documento de arquitetura
└── README.md      # Este arquivo
```

## 🔗 Documentação da Arquitetura

Para uma visão detalhada da arquitetura, consulte o documento [ARQUITETURA.md](./ARQUITETURA.md).

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
