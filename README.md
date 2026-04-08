# Unitforge

Production-oriented pnpm monorepo scaffold for a vertical SaaS studio.

## Workspace

- `apps/web`: Next.js App Router application with a landing page and dashboard shell.
- `packages/ui`: Shared Tailwind + shadcn-style UI primitives.
- `packages/core`: Shared navigation and product-surface definitions.
- `packages/db`: Drizzle ORM schema and PostgreSQL client factory.
- `packages/billing`: Billing plan definitions and formatting helpers.
- `packages/analytics`: Lightweight analytics event contract.
- `packages/config`: App metadata and Zod-based environment schema.

## Getting Started

1. `pnpm install`
2. Copy `.env.example` to `.env`
3. `pnpm dev`

