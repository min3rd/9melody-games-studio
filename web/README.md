# 9Melody Games Studio - Next.js Fullstack Scaffold

This is a minimal Next.js + TypeScript + Prisma scaffold for the 9Melody Game Studio website. It includes:

- Next.js (React) app
- Prisma schema and client
- Tailwind CSS + Dark/Light theme (next-themes)
- next-i18next for i18n
- Sample pages: Home, Posts (list + detail)
- Sample API: `GET /api/posts`

## Quick start

1. Copy `.env.example` to `.env` and set `DATABASE_URL` and other env vars.

```bash
npm install
cp .env.example .env
npx prisma migrate dev --name init
npx prisma db seed
npm run dev
```

## Scripts

- `npm run dev` — run Next.js dev server
- `npm run build` — build Next.js app
- `npm run start` — start production server (after build)
- `npm run lint` — run ESLint
- `npm run type-check` — run TypeScript check

## Next steps
- Add more API endpoints (jobs, applications, forum routes)
- Setup auth (NextAuth or JWT cookie-based)
- Add admin/moderation panel and RBAC
- Create seed script to add initial posts and jobs

Please refer to `.github/copilot-instructions.md` for conventions used in the project.
