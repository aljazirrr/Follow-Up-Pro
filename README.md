# Rebooker

Automated follow-ups for local service businesses.

Rebooker is a micro-SaaS that helps detailers, plumbers, electricians, cleaners, gardeners, salons, and repair shops stop losing leads to missed follow-ups. It's a **follow-up engine with a minimal CRM around it** — not a bloated generic CRM.

## What you get

- **Dashboard** — what to do today, overdue tasks, recent contacts, pipeline KPIs.
- **Contacts & jobs** — add leads and opportunities in seconds.
- **Automatic follow-ups** — quote sent → follow up in 2 days, job won → confirmation, job completed → review request.
- **Email templates** — pre-written with `{{customer_name}}`, `{{job_title}}` and other placeholders. Editable.
- **Email composer** — pick a task, send via Resend, the task becomes `SENT`.
- **Stripe billing** — Free plan (20 contacts, 20 tasks/month, 1 custom template) and Pro plan.

## Tech stack

- Next.js 14 (App Router, TypeScript)
- Tailwind CSS
- Prisma + PostgreSQL
- Auth.js (NextAuth v5) with credentials (email/password)
- Stripe (subscriptions + webhook)
- Resend (transactional email)
- Zod + React Hook Form, date-fns, sonner (toasts), lucide-react

## Prerequisites

- Node.js 20+
- A PostgreSQL database (local or hosted)
- Optional: a Resend account (for email), a Stripe account (for upgrades)

## Setup

```bash
# 1. Install
npm install

# 2. Configure environment
cp .env.example .env
# edit .env and set DATABASE_URL + NEXTAUTH_SECRET (required)

# 3. Database
npx prisma migrate dev --name init
npx prisma db seed

# 4. Run
npm run dev
```

Open http://localhost:3000.

### Demo credentials

After seeding:

- **Email:** `demo@rebooker.io`
- **Password:** `demo1234`

The seed creates 5 contacts, 5 jobs in various statuses, 7 follow-up tasks (some overdue, some done), and the four default email templates.

## Environment variables

See `.env.example` for the full list.

| Variable | Required | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | ✅ | Postgres connection string |
| `NEXTAUTH_SECRET` | ✅ | Session token secret (generate with `openssl rand -base64 32`) |
| `NEXTAUTH_URL` | ✅ | App URL (e.g. `http://localhost:3000`) |
| `RESEND_API_KEY` |  | Needed to actually send email (otherwise emails are logged to the console) |
| `RESEND_FROM_EMAIL` |  | Default: `Rebooker <onboarding@resend.dev>` |
| `STRIPE_SECRET_KEY` |  | Needed for upgrades |
| `STRIPE_WEBHOOK_SECRET` |  | Needed for the webhook handler |
| `NEXT_PUBLIC_STRIPE_PRICE_PRO` |  | Stripe price ID for the Pro plan |
| `NEXT_PUBLIC_APP_URL` | ✅ | Public URL for Stripe redirect URLs |

## Stripe setup (optional)

1. Create a product and recurring price in Stripe (test mode).
2. Copy the price ID into `NEXT_PUBLIC_STRIPE_PRICE_PRO`.
3. For local webhook testing:
   ```bash
   stripe login
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   ```
   Copy the printed webhook signing secret into `STRIPE_WEBHOOK_SECRET`.
4. Upgrade from `/billing` — the webhook will flip your subscription to Pro.

## Resend setup (optional)

1. Create an API key at https://resend.com.
2. Set `RESEND_API_KEY`.
3. Use a verified from address in `RESEND_FROM_EMAIL`, or keep `onboarding@resend.dev` for testing.

Without a Resend key set, email sends are logged to the server console (handy for local development) and the task is still marked as `SENT`.

## Scripts

```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run start        # Run the production build
npm run typecheck    # tsc --noEmit
npm run lint         # Next.js ESLint
npm run db:migrate   # Prisma migrate (dev)
npm run db:push      # Prisma db push (prototyping)
npm run db:seed      # Seed demo data
npm run db:studio    # Prisma Studio
```

## Project layout

```
app/
  (marketing)/        # Landing + pricing
  (auth)/             # Login + register
  (app)/              # Authenticated app (dashboard, contacts, jobs, follow-ups, templates, billing, settings)
  api/
    auth/             # NextAuth route handler
    stripe/webhook/   # Stripe webhook
actions/              # Server actions (contacts, jobs, follow-ups, templates, billing, auth)
components/
  ui/                 # Button, Card, Input, Table, Badge, Select, ...
  app/                # Sidebar, Topbar, UpgradeBanner
  dashboard/          # KPI card
  contacts/           # Contact form
  jobs/               # Job form, status select
  followups/          # Follow-up card, email composer
  templates/          # Template editor
  shared/             # Page header, empty state, status badges
lib/
  auth.ts             # Auth.js config + requireUser helper
  automation.ts       # THE follow-up generation rules (single source of truth)
  db.ts               # Prisma client
  email.ts            # Resend wrapper
  plan-limits.ts      # FREE vs PRO gating
  stripe.ts           # Stripe client + configured check
  templates.ts        # {{placeholder}} renderer
  utils.ts            # cn, formatDate, isOverdue, formatCurrency
  validators.ts       # Zod schemas
prisma/
  schema.prisma
  seed.ts
emails/
  defaults.ts         # Default email templates (source of truth for seeding + reset)
```

## Automation rules

All rules live in `lib/automation.ts`. There is no generic workflow builder — the rules are fixed and explicit:

| Job status change | Side effect |
| --- | --- |
| `NEW` → `QUOTED` | `quoteSentAt` set, create `QUOTE_FOLLOW_UP` task (due +2 days, EMAIL) |
| `* ` → `WON` | `wonAt` set, create `CONFIRMATION` task (due now, EMAIL) |
| `*` → `COMPLETED` | `completedAt` set, create `REVIEW_REQUEST` task (due +1 day, EMAIL) |
| `*` → `LOST` | `lostAt` set, no task |
| other | status updated, no side effect |

Overdue is computed at read time (`status === PENDING && dueDate < now`) — no cron required.

## Manual test plan

1. Log in as `demo@rebooker.io / demo1234`.
2. Dashboard shows KPIs, tasks due today, and overdue tasks.
3. Create a new contact → create a job → change the job status to `QUOTED` → a new `QUOTE_FOLLOW_UP` task appears in Follow-ups with a +2 day due date.
4. Open the task → email composer pre-fills subject and body from the template → send. With no `RESEND_API_KEY`, the email is logged to the server console. Task becomes `SENT`.
5. Change a job to `COMPLETED` → a `REVIEW_REQUEST` task appears.
6. As a Free user, try to add a 21st contact — the action is blocked with a plan-limit message.
7. Visit `/billing` → Upgrade → Stripe checkout (test mode) → webhook upgrades your plan to Pro.

## Roadmap (intentionally out of MVP scope)

- Forgot password flow
- SMS / WhatsApp follow-ups
- Team seats
- Tags, custom fields, file uploads
- Calendar integration
- Reporting beyond dashboard KPIs

## License

MIT
