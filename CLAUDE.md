# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development
pnpm dev          # Start dev server (localhost:3000)
pnpm build        # Production build
pnpm typecheck    # tsc --noEmit

# Testing
pnpm test                 # Vitest unit tests
pnpm test:ui              # Vitest with UI dashboard
pnpm test:coverage        # Coverage report (V8 provider)
pnpm test:e2e             # Open Cypress interactively
pnpm test:e2e:headless    # Run Cypress headless

# Linting / Formatting (Biome)
pnpm lint         # Check
pnpm lint:fix     # Auto-fix
pnpm format       # Format with --write

# Database (Drizzle + Neon PostgreSQL)
pnpm db:generate  # Generate migrations
pnpm db:migrate   # Apply migrations
pnpm db:seed      # Seed initial data
```

To run a single Vitest test file: `pnpm vitest run <path/to/test.ts>`

## Architecture

WikiMasters is an AI-powered blog publishing platform built on Next.js App Router with server actions, RTK Query, and multiple external services.

### Request Flow

```
Client (React + Redux) → RTK Query or Server Action
       ↓
Server Action (app/actions/) or API Route (app/api/)
       ↓
Cache Layer (Upstash Redis, 60s TTL on `articles:all`)
       ↓
Drizzle ORM → Neon PostgreSQL
```

Mutations via server actions invalidate Redis cache; reads go through `lib/data/articles.ts` which checks cache first.

### Authentication (Stack Auth)

- `stack/client.tsx` — client-side Stack app (cookie-based tokens)
- `stack/server.tsx` — server-side Stack app (inherits client config)
- `app/middleware.ts` — protects `/protected/*` routes, redirects to `/handler/sign-in`
- `db/sync-user.ts` — syncs authenticated users to the local `usersSync` table on first access
- `db/authz.ts` — `authorizeUserToEditArticle()` enforces ownership before edit/delete

### State Management

Redux Toolkit + RTK Query lives in `lib/redux/`:
- `store.ts` — configures store with `articlesApi`
- `features/articles/articlesApiSlice.ts` — RTK Query endpoints (getArticles, getArticleById, CRUD mutations with tag-based cache invalidation)
- `provider.tsx` — client-side Redux Provider in root layout

### Key Integrations

| Service | Purpose | Config/Entry |
|---------|---------|--------------|
| Stack Auth | Authentication + sessions | `stack/` directory |
| Neon PostgreSQL | Primary database | `db/index.ts`, `db/schema.ts` |
| Upstash Redis | Read-through cache | `cache/index.ts` |
| AWS S3 | Image uploads (max 10MB, images only) | `app/actions/upload.ts` |
| Resend | Milestone emails (page view thresholds) | `app/actions/pageViews.ts` + `email/` |
| OpenRouter | AI text completion + summarization | `app/api/ai/` |

### Database Schema

Two tables defined in `db/schema.ts`:
- `articles` — blog posts (id, title, content, authorId, views, timestamps)
- `usersSync` — mirrors Stack Auth users locally for foreign key relations

### UI Layer

- Tailwind CSS v4 + shadcn/ui components in `components/ui/`
- Feature components in `components/features/` (Navbar, WikiEditor, etc.)
- `@uiw/react-md-editor` for the markdown editor with AI suggestion integration
- Toast notifications via `sonner`
- Animations via GSAP and Motion.js

### Environment Variables

Required in `.env`:
```
NEXT_PUBLIC_STACK_PROJECT_ID, NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY, STACK_SECRET_SERVER_KEY
DATABASE_URL
AWS_S3_BUCKET_NAME, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION, BLOB_BASE_URL
UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN
RESEND_API_KEY
AI_GATEWAY_API_KEY
```

## Tooling Notes

- **Linter**: Biome (not ESLint/Prettier) — use `pnpm lint:fix` and `pnpm format`
- **Test environment**: `happy-dom` (not jsdom) — configured in `vitest.config.ts`
- **E2E specs**: `cypress/e2e/**/*.cy.{ts,tsx}`, base URL `http://localhost:3000`
- **Path alias**: `@/*` maps to the repository root (not `src/`)
