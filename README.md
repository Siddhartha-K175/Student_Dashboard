# Student Dashboard

A full-stack progress tracker for placement prep: a 48-week roadmap tracker and a DSA
practice log, built with Next.js (App Router) + Supabase (Postgres + Auth), deployed on Vercel.

## Stack

- **Frontend/Backend:** Next.js 14 (App Router, Server Components, Server Actions), TypeScript, Tailwind CSS
- **UI:** shadcn-style components (Button, Card, Badge, Progress) — hand-rolled, no CLI needed
- **Database & Auth:** Supabase (Postgres, Row Level Security, email + GitHub OAuth)
- **Charts:** Recharts
- **Deploy:** Vercel

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Create a Supabase project

1. Go to [supabase.com](https://supabase.com) → New Project.
2. In the SQL editor, run the contents of `supabase/schema.sql` — this creates the tables
   (`roadmap_phases`, `roadmap_topics`, `dsa_problems`) and Row Level Security policies so
   each user only sees their own data.
3. Run the contents of `supabase/seed_new_users.sql` — this adds a database trigger that
   auto-populates a starter 48-week roadmap and a few demo DSA problems for every new
   signup, so anyone trying the app (not just you) sees something useful immediately
   instead of a blank dashboard. Fires on both email and GitHub sign-ups.
4. Go to Project Settings → API and copy your **Project URL** and **anon public key**.

### 4. Configure environment variables

```bash
cp .env.local.example .env.local
```

Fill in `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

### 5. (Optional) Enable GitHub OAuth

In Supabase: Authentication → Providers → GitHub. You'll need a GitHub OAuth App
(Settings → Developer settings → OAuth Apps) with the callback URL Supabase gives you.
Email/password auth works out of the box without this step.

### 6. Run locally

```bash
npm run dev
```

Visit `http://localhost:3000` — you'll be redirected to `/login`. Sign up, and you'll
land straight in a dashboard that's already pre-filled with a starter roadmap and a
few demo DSA problems (thanks to the trigger from step 3) — no empty-state friction.

### 7. Deploy

Push to GitHub, import the repo in [Vercel](https://vercel.com), and add the same two
environment variables in the Vercel project settings.

## Project structure

```
app/
  login/          — auth page (email/password + GitHub OAuth)
  auth/callback/   — OAuth redirect handler
  dashboard/       — overview: stats + charts
  roadmap/         — phases + topics, with server actions for CRUD
  dsa/             — problem log table, with server actions for CRUD
components/
  ui/              — Button, Card, Badge, Progress (shadcn-style, hand-written)
  nav.tsx          — top nav with active-link highlighting + sign out
  progress-charts.tsx — Recharts bar/line charts
  topic-row.tsx / problem-row.tsx — interactive row components
lib/
  supabase/        — browser + server Supabase clients
  types.ts         — shared TS types matching the DB schema
supabase/
  schema.sql          — run this once in the Supabase SQL editor
  seed_new_users.sql  — run this once too; auto-seeds a starter roadmap +
                         demo DSA problems for every new signup
middleware.ts      — protects /dashboard, /roadmap, /dsa behind auth
```

## Notes / next steps

- **Going public to other users:** if you deploy this for classmates to use, turn
  **"Confirm email"** back ON in Supabase (Authentication → Providers → Email) — it's
  fine to leave off for solo local testing, but real strangers signing up should verify
  their email address first.
- **Customize the starter template:** edit `supabase/seed_new_users.sql` and re-run it
  in the SQL editor to change what phases/topics/demo problems new users get by default.
- **Seed your roadmap:** the trigger in `seed_new_users.sql` gives you (and every new
  signup) a starter template automatically. Add, edit, or delete phases/topics from
  there using the "Add a new phase" form on `/roadmap`.
- **Current week:** the dashboard currently shows the first phase's start week as a
  placeholder. For an accurate "you are in week N" calculation, add a `roadmap_start_date`
  column to your profile and compute the week from `today - start_date`.
- **Resume line:** "Built a full-stack progress-tracking dashboard with Next.js Server
  Actions, Supabase (Postgres + RLS + Auth), and Recharts visualizations, deployed on Vercel."
