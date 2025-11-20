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
npx prisma migrate dev --name init
npx prisma db seed
npm run dev
```

See `web/README.md` for frontend-specific instructions.
