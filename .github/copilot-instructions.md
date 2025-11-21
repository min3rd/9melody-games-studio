# GitHub Copilot / AI Assistant Instructions for 9melody-games-studio

## Quick summary
- This is a minimal Next.js 13+ (App Router) TypeScript project scaffolded via create-next-app.
- Primary source code is in the `app/` folder (App Router): `layout.tsx`, `page.tsx`, `globals.css`.
- Tailwind CSS is configured through `postcss.config.mjs` and `globals.css` (Tailwind v4 style).

## What an AI helper should know (big picture)
- This repository follows Next.js App Router patterns (routes in `app/`). `layout.tsx` sets global fonts and `page.tsx` is the root page.
- The style system uses Tailwind CSS + global CSS variables (see `app/globals.css`). The project also loads Google fonts using `next/font/google` in `layout.tsx`.
- Metadata for the app root is exported via the `metadata` export in `layout.tsx` (Next 13+ pattern).
- `package.json` contains standard scripts: `dev`, `build`, `start`, `lint`.

## Development & build workflows (explicit commands)
- Start dev server: `npm run dev` (or `pnpm dev`, `yarn dev` depending on the user).
- Build for production (local): `npm run build`.
- Start production server after build: `npm run start`.
- Run linting: `npm run lint` (it uses the `eslint` package directly; see `eslint.config.mjs`).

Notes for the agent: When adding scripts or commands, follow the existing `package.json` conventions and keep notations minimal.

## Project-specific conventions & patterns
- Files under `app/` follow the Next.js App Router. Reusable components should follow stable conventions (e.g., move to `components/` if large or reused).
- No `pages/` API or routing is present — use `app/` routes and colocation.
- Fonts are defined with `next/font/google` and saved as CSS variables so they can be used across app components. Keep this pattern while adding fonts.
- Styling uses Tailwind and custom CSS variables (color tokens in `globals.css`). Keep tokens consistent and avoid re-defining layout-level tokens per-component.

### Localization / i18n (REQUIRED)
- All user-facing text must use an i18n/localization system — do not hardcode strings in components or pages.
- Default supported locales: `en` (English) and `vi` (Vietnamese). If you need more languages, request confirmation from a maintainer.
- Recommended structure: put translation files in a `locales/` directory using a namespace per page or feature:

	- `locales/en/common.json`
	- `locales/vi/common.json`
	- `locales/en/home.json` (component/page-specific)

- Use an App Router-friendly i18n library that supports server/edge-rendering and nested layouts (e.g., `next-intl`, `next-i18next`, or the built-in Next.js i18n routing). Keep the chosen package consistent across the repo.
- Prefer explicit translation hook usage in components (example with `next-intl`):

	```tsx
	// app/page.tsx
	import { useTranslations } from 'next-intl';

	export default function Home() {
		const t = useTranslations('home');
		return <h1>{t('title')}</h1>;
	}
	```

- When adding new strings, update all locale files with the same translation keys. Avoid creating duplicate string keys across different features; prefer nested keys by feature (e.g. `home.title`).
- For static metadata (title/description), use the i18n solution to localize `metadata` values exported from `layout.tsx` or each `page.tsx` file.


## Cross-component flows and integration points
- App Router: `layout.tsx` wraps every route; `props.children` is the slot for the content of each route.
- Image assets served from `public/`; see `app/page.tsx` for usage of `/next.svg` and `/vercel.svg`.
- Tailwind utility classes are used for layout; do not mix component-level CSS modules unless necessary — prefer Tailwind utilities.

## Files and sections AI agents should edit (and how)
- `app/layout.tsx`: modify metadata or fonts. Avoid changing signature of RootLayout — keep the Server component semantics.
- `app/page.tsx`: main entry page; keep existing sample layout or expand with components.
- `globals.css`: place global variables and Tailwind imports here. Prefer variable-driven theming.
	- Add locale-aware CSS or directionality styles in `globals.css` only if needed. Prefer localized text via translation files instead of CSS content overrides.
- `locales/`: If adding translations, create and edit files under this directory. (Create `locales/` root if it doesn't exist.)
- `next.config.ts` and `eslint.config.mjs`: update only for project-level configuration.

## Testing & CI
- No test framework or CI workflows are present in the repo. If adding test infra, prefer Jest + Testing Library or Vitest and add `test` and `ci` scripts in `package.json`.
- For CI, if adding workflows, target `node: '18.x'` or newer for Next v16+. Ensure `npm ci` and `npm run build` run in the workflow.

## Helpful patterns & examples (use these when generating code)
- Prefer the App Router structure: add a folder `app/routeName/page.tsx` when adding routes.
- Use `next/font/google` for font definitions and export CSS variables as in `layout.tsx`.
- Use `/public` assets via `src="/asset.svg"` inside `next/image`.
- Use `tailwind` utilities in JSX and keep `globals.css` for theming tokens.

## When to ask for human help
- If the change touches deployment (Vercel/other provider), confirm environment variables and build settings with maintainers.
- If adding or modifying TypeScript config, request human confirmation when major compiler options or strictness flags change.

## Short actionable rules for Copilot/Suggested PRs (Do / Don't)
- Do: Follow the `app/` App Router conventions; add routes under `app/`.
- Do: Use Tailwind and global CSS variables for theming and layout.
- Do: Use `next/image` for images stored in `public/`.
 - Do: Use the project's i18n system for all user-facing strings and metadata. Add new translation keys under `locales/<lang>/*.json` and update all supported languages.
- Don't: Add server-side APIs in `pages/api` — this repo uses `app/` routes only.
- Don't: Change runtime Node or Next major versions without approval.
 - Don't: Hardcode plain English strings or copy content directly into JSX — always use translation keys.


## Helpful file references
- `app/layout.tsx` — root layout, fonts, metadata.
- `app/page.tsx` — example root page.
- `app/globals.css` — tailwind import and root variables.
- `next.config.ts`, `eslint.config.mjs`, `package.json` — project config & scripts.

---

If any of these points are unclear, or if you want the agent to be stricter about naming, testing, or CI style, tell me and I will refine the instructions.  

(Generated by GitHub Copilot-style guidance generator.)
