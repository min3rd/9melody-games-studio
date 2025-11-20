# 9Melody Games Studio (mono-repo)

This workspace contains the website for 9Melody Games Studio. It's a fullstack Next.js app with Prisma.

Top-level layout:
- `web/` - Next.js + TypeScript frontend + API routes
- `prisma/` - Prisma schema and migrations
- `.github/copilot-instructions.md` - Copilot/AI guidance for this repo

Start developing:
```bash
cd web
npm install
cp .env.example .env
# Run migrations (from repository root - `prisma/schema.prisma` is at repo root):
npx prisma migrate dev --schema=../prisma/schema.prisma --name init
# Or if you prefer to run the migration from the repo root instead of from `web/`:
# npx prisma migrate dev --name init
npx prisma db seed --schema=../prisma/schema.prisma
npm run dev

Alternatively, run the repo-level helper which will run migrations & seed and start the web dev server from the root folder:
```bash
npm run dev    # from repo root, runs prisma migrate, seed, and web dev server
```
```

Run with Docker (development):
```
# Default development compose (general)
docker compose up --build

# Or the dedicated development compose (recommended for local development):
docker compose -f docker-compose.dev.yml up --build
```
This will start Postgres, the Next.js app (on port 3000), and other services (mailhog, prisma migration/seed runner).

See `web/README.md` for frontend-specific instructions.
