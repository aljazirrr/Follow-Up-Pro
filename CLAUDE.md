# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start dev server
npm run build        # prisma generate + next build
npm run typecheck    # tsc --noEmit
npm run lint         # Next.js ESLint

npm run db:migrate   # Prisma migrate dev
npm run db:push      # Prisma db push (prototyping, no migration file)
npm run db:seed      # Seed demo data (demo@rebooker.io / demo1234)
npm run db:studio    # Prisma Studio UI
```

## Architecture

**Follow-Up Pro** (package name: rebooker) is a Next.js 14 App Router micro-SaaS for local service businesses. It manages contacts, jobs, and automated follow-up email tasks.

### Key Layer Responsibilities

- **`app/(app)/`** — Protected routes (dashboard, contacts, jobs, followups, templates, billing, settings). All pages call server actions directly — no client-side fetching.
- **`app/(auth)/`** — Login/register pages.
- **`app/(marketing)/`** — Public landing + pricing pages.
- **`actions/`** — Server actions handle all mutations. Each file corresponds to a domain (contacts, jobs, followups, templates, billing, auth). Actions call `requireUser()` at the top for auth, then validate with Zod, then call Prisma.
- **`lib/`** — Core business logic and utilities. Not called from client components.
- **`components/ui/`** — Headless Tailwind primitives (Button, Card, Table, etc.). All other components import from here.
- **`middleware.ts`** — Redirects unauthenticated users away from `/(app)` routes.

### Data Model (Prisma / PostgreSQL)

7 main models: `User`, `Contact`, `Job`, `FollowUpTask`, `MessageTemplate`, `Subscription`, plus Auth.js session tables.

Key enums:
- `JobStatus`: NEW → QUOTED → WON → COMPLETED (also REVIEW_REQUESTED, LOST)
- `TaskType`: QUOTE_FOLLOW_UP, CONFIRMATION, REVIEW_REQUEST, REACTIVATION, MANUAL
- `TaskStatus`: PENDING, SENT, DONE, SKIPPED, OVERDUE
- `PlanType`: FREE, PRO

### Automation Engine (`lib/automation.ts`)

This is the core business logic. When `actions/jobs.ts` changes a job's status, it calls `triggerAutomation()`, which creates `FollowUpTask` records based on the transition:

| Transition | Task Created | Due |
|---|---|---|
| any → QUOTED | QUOTE_FOLLOW_UP (EMAIL) | +2 days |
| any → WON | CONFIRMATION (EMAIL) | now |
| any → COMPLETED | REVIEW_REQUEST (EMAIL) | +1 day |
| any → LOST | none | — |

Overdue status is computed at read time (no cron job needed).

### Email System

- `lib/email.ts` wraps Resend. If `RESEND_API_KEY` is absent, emails are skipped silently.
- `lib/templates.ts` renders `{{placeholder}}` syntax in `MessageTemplate` bodies.
- Default templates are seeded from `emails/defaults.ts`.

### Plan Gating (`lib/plan-limits.ts`)

FREE plan caps: 25 contacts, 10 active jobs. `checkContactLimit()` / `checkJobLimit()` are called inside the relevant server actions before creating records.

### Authentication

NextAuth v5 (beta) with credentials provider. `lib/auth.ts` exports `auth` (the NextAuth handler) and `requireUser()` — a helper used at the top of every server action to get the current user or throw.

### Styling

Tailwind with HSL custom properties for theming. Colors are defined as CSS variables in `app/globals.css` and mapped in `tailwind.config.ts`. Dark mode uses the `class` strategy. All custom semantic colors (primary, muted, destructive, success, warning, etc.) must be referenced by their CSS-variable-backed names, not raw Tailwind colors.

## Environment Variables

Required: `DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `NEXT_PUBLIC_APP_URL`

Optional (features degrade gracefully without them): `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_STRIPE_PRICE_PRO`

## Path Aliases

`@/*` maps to the repository root (tsconfig `baseUrl: "."`).
