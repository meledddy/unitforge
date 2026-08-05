# Unitforge

Public price pages and inquiry management for service businesses.

Unitforge turns a service catalog into one bilingual link: customers see clear prices and business details, while the operator manages pages and incoming inquiries from one workspace.

![Unitforge marketing page](docs/assets/unitforge-home.png)

## Product tour

| Public price page                                                              | Operator workspace                                                   |
| ------------------------------------------------------------------------------ | -------------------------------------------------------------------- |
| ![Arev Dental public price page](docs/assets/unitforge-public-price-sheet.png) | ![Unitforge operator dashboard](docs/assets/unitforge-dashboard.png) |

- Publish structured service catalogs in Russian and English.
- Share a branded public page with light, stone, or dark presentation.
- Collect validated inquiries without exposing the operator workspace.
- Manage price sheets, publication state, duplicates, and inquiry history.

The repository includes three fictional Armenia-focused demo businesses with 21 services and 7 sample inquiries. Demo public forms are intentionally disabled.

## Demo walkthrough

After local setup:

1. Open `http://localhost:3000` for the product story and pricing.
2. Open the Arev Dental demo at `/price-sheets/demo-arev-dental-yerevan`.
3. Compare the Lumen Beauty and Northline Auto Care demos:
   - `/price-sheets/demo-lumen-beauty-yerevan`
   - `/price-sheets/demo-northline-auto-care-yerevan`
4. Switch between Russian and English on a public page.
5. Sign in and open `/app` to review the operator dashboard and seeded inquiries.

## Run locally

Requirements:

- Node.js 20.9+
- pnpm 10
- PostgreSQL 16 or a compatible hosted PostgreSQL database

Install dependencies and create the local environment file:

```powershell
corepack enable
corepack prepare pnpm@10.0.0 --activate
pnpm install --frozen-lockfile
Copy-Item .env.example .env
```

Set a local `DATABASE_URL` and add a demo password to `.env`:

```dotenv
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/unitforge
SALES_DEMO_PASSWORD=choose-a-local-password-with-12-characters
```

Keep `.env.local` absent during demo setup so the migration, seed scripts, and web app use the same database.

Prepare the isolated database and start Unitforge:

```powershell
pnpm db:migrate
pnpm db:check:sales-demo
pnpm db:seed:sales-demo
pnpm dev
```

Sign in at `http://localhost:3000/login`:

- Email: `showcase@unitforge.example`
- Password: the value of `SALES_DEMO_PASSWORD`

The sales-demo seeder only updates its dedicated showcase tenant and fixed demo records. Never run `db:reset:demo` against a shared or hosted database.

For a production-style local preview:

```powershell
pnpm build
pnpm start
```

## Quality checks

```powershell
pnpm lint
pnpm typecheck
pnpm db:check:sales-demo
pnpm verify:access-requests
pnpm build
```

Database integration verification uses a disposable database:

```powershell
pnpm verify:auth
pnpm verify:price-sheets
pnpm verify:onboarding
```

## Stack

- Next.js App Router and React
- TypeScript, Tailwind CSS, and Zod
- PostgreSQL and Drizzle ORM
- pnpm workspaces with shared UI, core, config, billing, analytics, and database packages

## Repository map

- `apps/web` — marketing pages, authentication, public price sheets, and operator workspace
- `packages/db` — schema, migrations, onboarding, and deterministic demo data
- `packages/ui` — shared UI primitives
- `packages/core` — shared product contracts and navigation
- `packages/config` — runtime configuration and environment validation

Unitforge is an active pre-launch portfolio project. A hosted demo and production domain are the next release milestone.
