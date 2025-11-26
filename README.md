This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Styling rules

- **Tailwind-first:** Use Tailwind CSS utility classes for styling components and layouts by default.
- **No ad-hoc CSS in components:** Avoid adding one-off CSS rules inside component files; prefer composing Tailwind utilities or extracting small reusable utility classes.
- **Global exceptions:** If you must add a special-case style that Tailwind can't express reasonably (very rare), declare the value as a theme/global token in `app/globals.css` with a clear comment explaining why.
- **Where to add new tokens:** Add new CSS variables under the `:root` block in `app/globals.css` and document the reason for the exception directly above the token.

Following these rules helps keep styles consistent, maintainable, and themeable across the project.

### Using Prisma with Postgres

If you'd like to use Postgres as the datasource for Prisma, add a Postgres-style `DATABASE_URL` to your `.env` (example provided in `.env.example`). This repo includes a `prisma.config.ts` which Prisma v7 uses to read the `DATABASE_URL` from the environment.

Example development environment setup (Postgres):

```bash
cp .env.example .env
# Update .env to use a postgres URL e.g.
# DATABASE_URL="postgresql://username:password@localhost:5432/mydb?schema=public"
npm run prisma:generate
npm run prisma:migrate
```

If you want me to create a `prisma/schema.prisma` tailored for Postgres (provider: `postgresql`) — or update the Prisma client usage — tell me and I’ll follow up in a separate change, step by step.

### Quick start: Docker (Postgres + App)

This repo includes a minimal `docker-compose.yml` for a local dev environment using Postgres and a Node container running your Next app. It provides a quick way to bring up Postgres and your app without changing your local environment.

**Start**:
```bash
docker compose up --build
```

The app runs on port 3000 in the container and Postgres on port 5432 on your machine. `DATABASE_URL` inside the container is set to:
`postgresql://prisma:prisma@db:5432/devdb?schema=public`

When the containers are running, you can run Prisma migrations from inside the app container:
```bash
docker compose exec app npx prisma migrate dev --name init
```

