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
