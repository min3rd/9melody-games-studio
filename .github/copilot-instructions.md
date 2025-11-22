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

### Styling policy (Tailwind-first)
- Use Tailwind utility classes for styling UI components and layouts by default. Keep utility composition in JSX whenever possible.
- Avoid adding one-off CSS rules inside component files. If a reusable pattern emerges, extract it as a small utility using Tailwind's `@apply` in `app/globals.css`.
- If a very special-case style is required that cannot reasonably be expressed with Tailwind utilities (rare), declare the value as a theme/global token in `app/globals.css` (under `:root`) and add a short comment above the token explaining the reason for the exception.
- Keep global exceptions minimal and documented so styles remain consistent and themeable.

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

## In-house component library (REQUIRED)
- Purpose: Provide a consistent set of UI building blocks and style tokens (pixel-art look & feel) across the app. Avoid ad-hoc UI markup in page code.
- Location: Add components under `components/ui/` (or `packages/ui` if converting to monorepo later). Follow the same naming convention as Next's App Router (one component per folder, export `index.tsx`).
- Required primitives (examples): `Button`, `Input`, `Label`, `Select`, `Modal`, `Card`, `Icon`, `Avatar`, `Typography`, `Grid`.
- Theme support: All components MUST be theme-aware and use the color variables defined in `app/globals.css` (`--background`, `--foreground`) or Tailwind `dark:` variants to support light/dark mode.
- Pixel-art style: Components should adopt a pixel-art look by default. Use low-res pixel assets or CSS rules for pixelation where applicable (e.g., `image-rendering: pixelated`), maintain crisp 1px borders, and use a pixel-style font when appropriate (define as a CSS variable like `--font-pixel` if needed).
- Accessibility & i18n: Components must be accessible (ARIA attributes, focus outline) and accept translation keys or `children` props. Avoid putting localized strings inside the component (use props to pass strings so the page can pass `t('key')`).
- Reusability rules: If a piece of UI is repeated more than once or can be reused, add it to the component library; do not duplicate markup across pages.

- Component options: All components in the library MUST expose standard, configurable props for color/variant, size, and an effects toggle to enable/disable visual/interaction effects (for example hover/active transforms, shadows, or transitions). The effects toggle should be a boolean prop (e.g. `withEffects?: boolean`) and must default to `true` (effects enabled). Keep prop names consistent across components — prefer `variant`/`preset` for named color variants, `size` for size variants (e.g., `sm`, `md`, `lg`) and `withEffects` for the boolean toggle. Use theme color tokens where possible and accept a CSS color/string for overrides.
 - Component options: All components in the library MUST expose standard, configurable props for color/variant, size, and an effects toggle to enable/disable visual/interaction effects (for example hover/active transforms, shadows, or transitions) and a `rounded` boolean to control border radius. The effects toggle should be a boolean prop (e.g. `withEffects?: boolean`) and must default to `true` (effects enabled). Keep prop names consistent across components — prefer `variant`/`preset` for named color variants, `size` for size variants (e.g., `sm`, `md`, `lg`), `rounded` for border radius control, and `withEffects` for the boolean toggle. Use theme color tokens where possible and accept a CSS color/string for overrides.

 - Preset mappings: To keep colors consistent across components, use the shared `PRESET_MAP` mapping exported from `components/ui/presets.ts`. Import as `import { PRESET_MAP, type Preset } from '@/components/ui/presets'` and prefer using `Preset` for component `preset` types (you may alias to a component-specific `*Preset` if desired, e.g. `export type ButtonPreset = Preset`).

 - Size & rounding tokens: To keep sizing consistent across components, use the shared size and rounding mappings exported from `components/ui/presets.ts` such as `BUTTON_SIZE_CLASSES`, `INDICATOR_SIZE_CLASSES`, `PILL_PADDING_MAP`, `ROUND_CLASSES`, and `TOGGLE_SIZE_MAP`. Import them as:

```ts
import { BUTTON_SIZE_CLASSES, INDICATOR_SIZE_CLASSES, PILL_PADDING_MAP, ROUND_CLASSES, TOGGLE_SIZE_MAP, type UISize } from '@/components/ui/presets'
```

Prefer to standardize on `sm` / `md` / `lg` sizes across components and use the shared mappings rather than duplicating class strings. The mappings provide consistent Tailwind class tokens for padding, text sizes, and dimensions.

Examples:

```tsx
// components/ui/Button/index.tsx
import clsx from 'clsx';
import React from 'react';

export default function Button({ children, className, withEffects = true, rounded = true, ...rest }: React.ButtonHTMLAttributes<HTMLButtonElement> & { withEffects?: boolean; rounded?: boolean }) {
	// Use CSS vars and tailwind for light/dark, and accept className for overrides
	return (
		<button
			{...rest}
			className={clsx(
				'rounded-sm px-3 py-2 text-sm leading-none',
				'bg-foreground text-background dark:bg-background dark:text-foreground',
				className
			)}
		>
			{children}
		</button>
	);
}
```

```css
/* Example pixel-art helper (globals or component CSS) */
.pixel-art-image {
	image-rendering: pixelated;
	image-rendering: -moz-crisp-edges;
	image-rendering: crisp-edges;
}
```

Notes for agents: When creating or editing components, prefer building theme-aware primitives that are small, composable and tested across both light & dark themes.

### Example usage (Button)
When using built-in components prefer to import from `components/ui` (the alias `@` is configured):

```tsx
import { Button } from '@/components/ui';
import { useTranslations } from 'next-intl';

export default function Home() {
	const t = useTranslations('home');
	return <Button>{t('cta.deploy')}</Button>;
}
```

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
 - We expose a public component preview at `/components` for quick visual checks and interactive testing. Add new component preview pages under `app/components/<component>`.

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
