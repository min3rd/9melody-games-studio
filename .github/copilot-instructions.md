## GitHub Copilot / AI Agent Instructions for 9Melody Games Studio

Project summary:
- Frontend: Next.js + React + TypeScript (recommended; app lives in `web/`). Vite+React is also supported for separate SPA apps but the default scaffolded app uses Next.js. Backend/API: Node.js + TypeScript (monorepo style) or Next.js API routes. PostgreSQL database via Prisma. This site hosts posts (devlog/blog), company info, job board and in-house forum.

Target goals for the AI agent:
- Be productive: implement features, update docs, scaffold pages & API routes, and create PRs that pass CI and follow project conventions.
- Ask clarifying questions before making design decisions that would change architecture or cross-cutting behavior (auth, DB models, infra).

Quick architecture overview (what to expect):
- Frontend: Next.js + React + TypeScript (default; app lives in `web/`). Use `src/` and React components in `src/components`.
- Backend/API: Next.js API routes under `web/src/pages/api/*` (serverless) or Node.js services under `server/` for non-serverless.
- Note: If you prefer a separate SPA setup, you can use Vite + React for client-only apps, but this repo scaffolds a Next.js fullstack app by default.
- Database: `prisma/schema.prisma`. Use Prisma Client from `lib/prisma.ts` or `server/db.ts`.
- Auth: Expect NextAuth or JWT cookie-based auth; `lib/auth` or `pages/api/auth/*`.

 - Developer workflows & commands (standardized):
 - Local dev (Node.js v18+, pnpm/npm/yarn):
```
npm install
cp .env.example .env    # populate env vars
npx prisma migrate dev --name init
npx prisma db seed       # if seed script exists
# In a Next.js monorepo using `web/` as app root:
cd web
npm install
npm run dev
```
- Build & test:
```
# Frontend (Next.js `web/`):
# From project root
cd web
npm install
npm run dev          # next dev
npm run build        # next build
npm run start        # next start

# Backend (if you maintain a separate server package or build artifacts):
# e.g., server build may be `npm run build:server` in that package. In this repo we use Next.js API routes under `web/src/pages/api`, so there is no separate server build step.
npm run test
npm run lint
```
TypeScript & Linting (enforcement):
```
// package.json example scripts (Next.js web project under `web/`)
{
	"scripts": {
		"dev": "next dev",
		"build": "next build",
		"start": "next start",
		"lint": "eslint --ext .ts,.tsx src",
		"type-check": "tsc --noEmit",
		"prisma:migrate": "prisma migrate dev",
		"prisma:seed": "ts-node prisma/seed.ts",
		"test": "vitest"
	}
}
```

ESLint config snippet (TypeScript-aware linting & rules):
```
{
	"extends": [
		"eslint:recommended",
		"plugin:react/recommended",
		"plugin:@typescript-eslint/recommended",
		"plugin:jsx-a11y/recommended"
	],
	"parser": "@typescript-eslint/parser",
	"plugins": ["@typescript-eslint", "react", "jsx-a11y"],
	"rules": {
		"@typescript-eslint/no-explicit-any": "warn",
		"@typescript-eslint/explicit-module-boundary-types": "off",
		"react/react-in-jsx-scope": "off",
		"jsx-a11y/anchor-is-valid": "off"
	}
}
```

CI steps (example) for `web/` Next.js app:
```
- name: Install Dependencies
	run: npm ci
- name: Type check
	run: npm run type-check
- name: Lint
	run: npm run lint -- --max-warnings=0
- name: Build
	run: npm run build
- name: Run Tests
	run: npm run test
```
- DB migrations: `npx prisma migrate dev --name <desc>` and `npx prisma migrate deploy` in CI for deployments.

Code & API conventions (project-specific):
- Responses: API handlers should return a consistent envelope, e.g.
```
{ success: true|false, data: ..., error?: { code, message } }
```
- Use `slug` fields for posts/jobs/threads. Keep slugs lowercase, `kebab-case`, and generated via `slugify(title)` helper located at `lib/slug.ts`.
- Business logic belongs in `lib/services/*` or `server/services/*`. API routes are thin wrappers that validate input, call services, and return the envelope.
- Use Prisma transactions for multi-step DB updates (e.g., creating a post & tags or an application + notification).

Testing patterns:
- Unit tests in `__tests__` co-located with modules or under `tests/` (Vitest or Jest + React Testing Library). Use `vitest` for frontend components where possible.
- Integration tests using Supertest for API endpoints; e2e with Playwright/Cypress for critical flows (auth, post creation, apply job).

Security & infra notes (must-follow):
- Hash passwords with bcrypt or argon2; SECRET and DB credentials must be stored in environment variables declared in `.env.example`.
- File uploads: Use S3 signed URLs (`lib/s3.ts`) or remote CDNs. Do not accept raw base64 uploads in requests.
- Rate limit public endpoints (login, register, apply job, forum creation). Add server-side checks to prevent spam.

 - Patterns worth following:
 - Keep UI components small & pure; put shared hooks in `src/hooks/`.
 - Use `useSWR` or React Query for caching/fetching; avoid direct fetch in componentDidMount.
 - Use `lib/` for utility functions; `server/` for backend-only business logic.
 - For PRs, include unit tests and API test for any behavioral change.
 - TypeScript rules: All new code must be TypeScript. Add `tsconfig.json` with `"strict": true` and run `tsc --noEmit` in CI via `npm run type-check`.
 - Prefer typed helper utilities, e.g., typed translation helper generation, typed RPC/resolvers, and avoid `any` wherever possible.

Styling policy (MANDATORY):
- Tailwind CSS is mandatory for all new UI work. Use Tailwind utility classes and variants for layout, spacing, colors, and responsiveness.
- Do NOT create or import raw `.css` files for component styling. The only allowed exception is a global CSS file (e.g., `styles/globals.css`) that contains Tailwind directives (`@tailwind base; @tailwind components; @tailwind utilities;`) and project-wide resets only.
- Do NOT use inline `style` attributes (e.g., `style={{ marginTop: 8 }}`) in React components — prefer Tailwind classes.
- If a rare exception requires custom CSS, open a PR and request approval from a lead developer; document the reason in the PR description.

Theming: Light/Dark mode support (MANDATORY):
- All new UI work must support both light and dark themes.
- Preference strategy: Prefer Tailwind's `class` dark mode strategy (recommended) or configure `media` with a server-side fallback for SSR.
- Provide a theme toggle in the UI that persists user choice (localStorage, cookie or account preference); respect `prefers-color-scheme` as the initial default.
- Avoid hardcoded colors in components; use Tailwind theme tokens (e.g., `text-primary`, `bg-surface`) and extend `tailwind.config.js` for app color tokens, with light/dark variants.
- Use accessible contrast ratios for both themes (WCAG AA minimum for text and UI elements). Test color contrast in both themes.

Implementation examples:
```
// tailwind.config.js
module.exports = {
	darkMode: 'class', // or 'media' depending on SSR needs
	theme: {
		extend: {
			colors: {
				primary: { DEFAULT: '#2563EB', dark: '#1E40AF' },
				surface: { DEFAULT: '#FFFFFF', dark: '#111827' }
			}
		}
	}
}

// In _app.tsx or RootProvider
function App({ Component, pageProps }) {
	// Reactively set `document.documentElement.classList` to 'dark' if theme === 'dark'
	return <Component {...pageProps} />;
}

// Theme toggle example
<button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} aria-label="Switch theme">Toggle</button>
```

SSR support & FOUC prevention:
- When SSR is used, set the initial theme class on the `<html>` element during server render, using cookie/user preference or `prefers-color-scheme` detection to avoid flash of incorrect theme.

Testing & acceptance criteria:
- Manually test components in both light and dark themes with a theme toggle.
- Run color contrast checks for large and normal text (WCAG AA). Tools: Lighthouse, axe, or https://contrast-ratio.com/
- All new components must have Tailwind tokens (not HEX literals) so theme swapping works automatically.
- Snapshots should be taken in both themes if visual regression testing is used (Chromatic or Playwright snapshot testing in dark/light modes).

Exceptions:
- Very specific marketing pages with unique designs may propose a themed exception — document reasons in a PR and obtain approval from a lead.

Enforcement — Lint and CI checks (examples):
- ESLint rule example to disallow inline `style` attributes (add to `.eslintrc`):
```
{
	"rules": {
		"no-restricted-syntax": [
			"error",
			{
				"selector": "JSXAttribute[name.name='style']",
				"message": "Inline style attributes are forbidden. Use Tailwind utility classes instead."
			}
		]
	}
}
```
- ESLint example to block `.css` imports (allow only `styles/globals.css`):
```
{
	"rules": {
		"no-restricted-imports": [
			"error",
			{
				"patterns": [
					"*.css",
					"**/*.css"
				]
			}
		]
	}
}
```
Note: The rule above will block all `.css` imports; you may configure a small override in the linter for `styles/globals.css` if needed.

- CI check snippet (GitHub Actions step) to prevent accidental CSS imports and inline styles:
```
- name: Check CSS imports and inline styles
	run: |
		# Any import of .css outside of styles/globals.css
		if git grep -n --line-number "import .*\.css" -- src | grep -v "styles/globals.css"; then
			echo "CSS imports other than styles/globals.css are forbidden";
			git grep -n --line-number "import .*\.css" -- src | grep -v "styles/globals.css";
			exit 1;
		fi
		# Inline style attributes
		if git grep -n "style={{" -- src; then
			echo "Inline style attributes found. Use Tailwind classes instead.";
			git grep -n "style={{" -- src;
			exit 1;
		fi
```

💡 Tip: Use `clsx` or `classnames` for conditional Tailwind classes and create small utility classes via `@apply` in `styles/globals.css` cautiously (prefer Tailwind utilities directly).

Internationalization & No hardcoded strings (MANDATORY):
- All visible, user-facing text in the UI must use an i18n library. Do not hardcode strings in JSX, metadata, or component output.
- Recommended library for Next.js: `next-i18next` or `next-intl` (choose one and be consistent across the repo). Keep translations in `locales/{lang}/{namespace}.json` (e.g., `locales/vi/common.json`, `locales/en/common.json`).
- Translation keys should be used everywhere visible strings appear (buttons, labels, error messages, alt text, placeholders, meta titles/descriptions).
- Do NOT rely on database content to localize UI text; DB content (like posts from users) is free text and should be treated as-is (not forced through i18n).

Examples:
```
// locales/vi/common.json
{
	"login": "Đăng nhập",
	"signup": "Đăng ký",
	"apply": "Ứng tuyển"
}

// In a component
import { useTranslation } from 'next-i18next';

export default function LoginButton() {
	const { t } = useTranslation('common');
	return <button>{t('login')}</button>;
}
```

Server-side rendering with `next-i18next`:
```
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export const getStaticProps = async ({ locale }) => ({
	props: {
		...(await serverSideTranslations(locale, ['common']))
	}
});
```

ESLint: enforce no literal strings in JSX
- Add `eslint-plugin-i18next` and enable the rule `i18next/no-literal-string` to block string literals in markup while allowing attribute whitelists like `data-testid` or `aria-*`:
```
{
	"plugins": ["i18next"],
	"rules": {
		"i18next/no-literal-string": ["error", {
			"markupOnly": true,
			"ignoreAttribute": ["data-testid", "aria-label", "aria-labelledby", "title"],
			"markupComponents": ["Trans"]
		}]
	}
}
```

CI enforcement:
```
- name: Run ESLint
	run: npm run lint -- --max-warnings=0
```

Exceptions & notes:
- Test files and snapshot fixtures can use literal strings.
- Console logs, internal server errors and debug messages may be non-localized.
- UI strings loaded from an external CMS are considered content (not hardcoded), but their presentation strings should still be translated in the UI templates/shells (e.g., labels).
- If a component receives text as children (from parent) that's not translated, verify the parent component uses `t()` or a translation pipeline.
- For `dangerouslySetInnerHTML` content, ensure content is sanitized and translated at the source if it's UI text.

Tip: Use typed translation helper generation where possible (e.g., `next-i18next` with types or manual TS types from translation keys) to avoid misspellings and missing translations.

- Database: `DATABASE_URL`
- JWT/NextAuth secret: `JWT_SECRET` / `NEXTAUTH_SECRET`
- SMTP for emails: `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS`
- S3/Cloudinary keys for media: `S3_BUCKET`, `S3_KEY`, `S3_SECRET`
Integration points and environment variables:
- Database: `DATABASE_URL`
- JWT/NextAuth secret: `JWT_SECRET` / `NEXTAUTH_SECRET`
- SMTP for emails: `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS`
- S3/Cloudinary keys for media: `S3_BUCKET`, `S3_KEY`, `S3_SECRET`
- Next.js env vars: use `NEXT_PUBLIC_` prefix for public client-side environment variables (e.g., `NEXT_PUBLIC_API_URL`). If using Vite for a separate SPA, keep `VITE_` prefix for that package.

What to do when making changes:
1. Run tests & lint locally. Fix any issues before committing.
2. Update `prisma/schema.prisma` and run `npx prisma migrate dev` if schema changed.
3. Add/Update API contract examples in `docs/` or OpenAPI spec (if present).
4. Add migration/seed steps in PR description.
5. Provide a short, clear PR description with the problem and the solution; link any relevant issue.

When to ask a human:
- If a requested change affects authentication flows, DB schema, infra (e.g., storage provider), or cross-component contracts, stop and ask for confirmation.
- If there is no clear guideline for a style or hook name, follow the nearest existing example in `web/src/` and mention the pattern in the PR.

Files to examine for project-specific patterns:
- `README.md` (root) for project overview & commands
 - `web/package.json` (and root `package.json`) for scripts
 - `prisma/schema.prisma` for DB models
 - `web/src/pages/api/*` or `server/*` for API structure
 - `web/src/components/` and `web/styles/` for UI patterns
- `.github/workflows/*` for CI

Post-PR checklist:
- Tests pass in CI and locally ✅
- Lint passes ✅
- DB migrations included if needed ✅
- Changes are documented (README, docs/opinionated) ✅

If the repository already contains an existing `.github/copilot-instructions.md`, merge the above content keeping any valid, up-to-date lines; otherwise add the file and raise a PR describing the change.

---
Feedback: If anything here is unclear or this repo contains files that differ from the above assumptions, reply with the specific file paths and I will update the instructions accordingly.
