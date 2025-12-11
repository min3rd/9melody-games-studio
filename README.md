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

## Component Library

This project includes a standardized component library in `components/ui/` with a consistent API and pixel-art aesthetic. See [`COMPONENTS.md`](./COMPONENTS.md) for detailed documentation.

### Key Features

- **Consistent Props API**: All components support standard props: `size`, `preset`, `color`, `rounded`, `withEffects`
- **Pattern Backgrounds**: Interactive components support 4 pattern backgrounds:
  - `pixel`: Classic pixel grid with animated wave
  - `pixel3d`: 3D falling pixel blocks effect  
  - `neon`: Neon glow particles with flicker
  - `bubble`: Floating bubble particles
- **Dark Mode**: All components support light and dark themes
- **TypeScript**: Fully typed with exported prop interfaces
- **Accessible**: ARIA attributes and keyboard navigation

### Quick Example

```tsx
import { Button, Card, Alert } from '@/components/ui';

export default function Page() {
  return (
    <div className="p-4">
      {/* Button with pixel pattern background */}
      <Button pattern="pixel" preset="primary" size="lg">
        Click Me
      </Button>

      {/* Card with neon pattern */}
      <Card pattern="neon" preset="info">
        <CardBody>
          Card content goes here
        </CardBody>
      </Card>

      {/* Alert with bubble pattern */}
      <Alert 
        pattern="bubble" 
        preset="success"
        title="Success!"
        description="Your action completed successfully."
      />
    </div>
  );
}
```

### Available Components

**Form Inputs**: TextInput, TextArea, Select, Checkbox, Radio, Toggle, Range, Rating, FileInput  
**Display**: Badge, Avatar, Indicator, Loading, Progress, RadialProgress  
**Layout**: Card, Modal, Drawer, Accordion, Tabs, Timeline  
**Navigation**: Button, Dropdown, Menu, Navbar, Breadcrumbs, Pagination, Dock  
**Feedback**: Alert, Loading, Progress

For complete documentation, see [`COMPONENTS.md`](./COMPONENTS.md).

## 3D Editor

This project includes a powerful 3D Editor for creating and managing 3D scenes that are displayed on the homepage.

### Quick Access

- **Editor**: `/private/admin/3d-editor` (requires admin authentication)
- **Homepage Display**: `/` (shows the saved 3D scene)

### Key Features

- **Scene Hierarchy**: Add, delete, rename, and organize 3D objects
- **Interactive Viewport**: Real-time 3D rendering with camera controls
- **Properties Panel**: Edit position, rotation, scale, color, and more
- **Asset Library**: Browse and add primitives and 3D components
- **Save/Load**: Persist scenes to localStorage (upgradable to API/DB)

### Quick Start

1. Navigate to `/private/admin/3d-editor`
2. Add objects using the `+ 📦` button or click assets in the library
3. Select and edit objects using the Properties panel
4. Click **💾 Save** to save your scene
5. View the result on the homepage at `/`

### Documentation

- **English Guide**: [`docs/3D_EDITOR_GUIDE.md`](./docs/3D_EDITOR_GUIDE.md)
- **Vietnamese Guide**: [`docs/3D_EDITOR_GUIDE_VI.md`](./docs/3D_EDITOR_GUIDE_VI.md)
- **Implementation Details**: [`IMPLEMENTATION_SUMMARY.md`](./IMPLEMENTATION_SUMMARY.md)

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
### API Error handling and i18n

API endpoints now return structured error responses in JSON with a standardized `code` field. Use the `errors` translation namespace in `locales/*/errors.json` to localize messages on the client.

Server example (error response):
```json
{ "code": "INVALID_CREDENTIALS" }
```

Client example (JS):
```js
const res = await fetch('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
if (!res.ok) {
	const body = await res.json();
	const message = body?.code ? t(`errors.${body.code}`) : body?.message;
	// display message to user
}
```

Register endpoint example (server):
```js
// POST /api/auth/register
// Required: email, password
const res = await fetch('/api/auth/register', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ email, username, password, name }) });
if (!res.ok) {
	const body = await res.json();
	const message = body?.code ? t(`errors.${body.code}`) : body?.message;
}
```

```

