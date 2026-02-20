# Event Insights Platform — Initialization Tasks

## Phase 1: Project Scaffolding (Monorepo) ✅
- [x] Initialize pnpm workspace monorepo structure
- [x] Set up `apps/api` (NestJS) with all backend dependencies
- [x] Set up `apps/web` (Next.js) with frontend dependencies
- [x] Set up `packages/shared-types` for shared TypeScript interfaces
- [x] Configure `.env`, `docker-compose.yml` (PostgreSQL, MongoDB, Redis)

## Phase 2: Canonical Directory Structure ✅
- [x] Create modular-core domain folders (`events`, `analytics`, `organizations`, `auth`, `users`)
- [x] Create shared folder (`shared/interfaces`, `shared/guards`, `shared/pipes`, `shared/decorators`, `shared/launchers`)
- [x] Create `infrastructure/` folder for database config (Prisma, Mongoose)

## Phase 3: Database & Schema Design ✅
- [x] Write Prisma schema for PostgreSQL (Organization, User, Event, AggregatedMetric)
- [x] Write Mongoose schemas for MongoDB (RawEventStream)
- [x] Configure Prisma client and Mongoose connection modules

## Phase 4: Global Middlewares & Shared Layer ✅
- [x] Implement JWT Auth Guard (Passport)
- [x] Implement Multi-Tenant Guard (org_id context extraction)
- [x] Implement Zod Validation Pipe
- [x] Create shared decorators (`@CurrentUser`, `@OrgId`, `@Public`)
- [x] Create Internal Launcher interfaces for cross-module communication

## Phase 5: Domain Module Implementation ✅
- [x] Implement `auth` module (Controller → Service → Repository)
- [x] Implement `organizations` module (Controller → Service → Repository)
- [x] Implement `users` module (Controller → Service → Repository)
- [x] Implement `events` module (Controller → Service → Repository)
- [x] Implement `analytics` module (Controller → Service → Repository)

## Phase 5b: Next.js Dashboard Frontend ✅
- [x] Create root layout with dark theme and sidebar shell
- [x] Implement auth pages (login, register)
- [x] Implement dashboard overview page (KPI cards + charts)
- [x] Implement events management page
- [x] Implement analytics deep-dive page
- [x] Create reusable UI components (button, card, sidebar, data-table)
- [x] Create chart components (metric-card, line-chart, bar-chart)
- [x] Implement API client, auth provider, and React Query provider
- [x] Implement custom hooks (use-auth, use-metrics)

## Phase 6: Analytics Pipeline ✅
- [x] Implement event ingestion endpoint (tracking pixel → MongoDB)
- [x] Implement BullMQ aggregation job (every 10 minutes)
- [x] Implement aggregated storage to PostgreSQL
- [x] Implement dashboard query service (reads from PostgreSQL)

## Phase 7: Verification ✅
- [x] Install dependencies via pnpm (597 packages)
- [x] Prisma generate — ✅ passed
- [x] NestJS build — ✅ passed (after fixing Mongoose schema TS assertions)
- [x] No circular dependencies (verified via module structure)
