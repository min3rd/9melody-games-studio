# 9melody-games-studio

Next.js + TypeScript + Prisma starter scaffold with Prisma located inside `src/prisma`.

## Scripts
- `npm run dev` — run the dev server
- `npm run build` — build production assets
- `npm run start` — start production server
- `npm run prisma:generate` — generate Prisma client (uses `src/prisma/schema.prisma`)
- `npm run prisma:migrate` — run migrations and seed DB using `src/prisma/schema.prisma`
- `npm run prisma:seed` — run Prisma seed using `src/prisma/schema.prisma`
- `npm run test` — run tests (vitest)

## Setup
1) Install dependencies
```bash
npm install
```

2) Copy and edit env variables
```bash
cp .env.example .env
# set DATABASE_URL and other secrets
```

3) Run migrations & seed database
```bash
npm run prisma:migrate
```

4) Start development server
```bash
npm run dev
```
## Docker Compose

This repo includes two Docker Compose files:

- `docker-compose.dev.yml` — for local development tooling (Postgres + Adminer + MailHog). The `web` (Next.js) service is intentionally not included because the code should be run locally with `npm run dev` during development.
- `docker-compose.deploy.yml` — for full stack deployment. This will include `db` and `web` services, and will also run a one-shot `prisma_migrate` container that applies migrations and seeds the DB.

### Dev usage (only supporting services)
1) Start postgres and adminer locally for dev:
```bash
docker compose -f docker-compose.dev.yml up -d
```

2) Configure `.env` to point at the DB started by docker:
```bash
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/appdb"
```

3) Run the app locally (web is not in dev compose):
```bash
npm run dev
```

4) Adminer UI is available on http://localhost:8080 and MailHog on http://localhost:8025

### Deploy usage (build and run web + DB)
This file builds your `web` Dockerfile and runs it alongside a Postgres instance. It also includes a one-shot `prisma_migrate` service to apply migrations and seed the DB in the cluster.

1) Create `.env.docker` or set environment variables for `DATABASE_URL`, `NEXTAUTH_SECRET`.
2) Build & start the stack:
```bash
docker compose -f docker-compose.deploy.yml up --build -d
```

3) If you need to run migrations manually at any point instead of `prisma_migrate`, run:
```bash
docker compose -f docker-compose.deploy.yml run --rm prisma_migrate
```

4) Stop the stack:
```bash
docker compose -f docker-compose.deploy.yml down
```

Notes:
- The deploy compose file is intentionally minimal — add reverse proxy, TLS termination (Traefik/Nginx) and environment management as required for your infra.
- If you prefer to run `prisma migrate dev`, do it locally before starting the web service in dev mode and ensure `DATABASE_URL` points to the docker Postgres.

