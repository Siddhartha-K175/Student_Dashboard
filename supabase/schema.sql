-- Run this in your Supabase project's SQL editor.
-- Enables row-level security so each authenticated user only sees their own data.

create extension if not exists "uuid-ossp";

-- ── Roadmap phases (e.g. "Foundation", "DSA", "AI/ML", "Interview Prep") ──
create table if not exists roadmap_phases (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  week_start int not null,
  week_end int not null,
  order_index int not null default 0,
  created_at timestamptz default now()
);

-- ── Topics within a phase ──
create table if not exists roadmap_topics (
  id uuid primary key default uuid_generate_v4(),
  phase_id uuid references roadmap_phases(id) on delete cascade not null,
  title text not null,
  status text not null default 'todo' check (status in ('todo', 'in_progress', 'done')),
  notes text,
  created_at timestamptz default now()
);

-- ── DSA problem log ──
create table if not exists dsa_problems (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  platform text not null default 'LeetCode',
  difficulty text not null default 'medium' check (difficulty in ('easy', 'medium', 'hard')),
  pattern_tag text not null default '',
  status text not null default 'todo' check (status in ('todo', 'attempted', 'solved')),
  link text,
  notes text,
  solved_at timestamptz,
  created_at timestamptz default now()
);

-- ── Row Level Security ──
alter table roadmap_phases enable row level security;
alter table roadmap_topics enable row level security;
alter table dsa_problems enable row level security;

create policy "Users manage their own phases"
  on roadmap_phases for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users manage topics in their own phases"
  on roadmap_topics for all
  using (
    exists (
      select 1 from roadmap_phases
      where roadmap_phases.id = roadmap_topics.phase_id
      and roadmap_phases.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from roadmap_phases
      where roadmap_phases.id = roadmap_topics.phase_id
      and roadmap_phases.user_id = auth.uid()
    )
  );

create policy "Users manage their own dsa problems"
  on dsa_problems for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ── Seed: 48-week roadmap phases (edit freely) ──
-- Replace 'YOUR_USER_ID' after creating your account, or run this later from the app.
-- insert into roadmap_phases (user_id, name, week_start, week_end, order_index) values
--   ('YOUR_USER_ID', 'Foundation', 1, 8, 1),
--   ('YOUR_USER_ID', 'DSA Core', 9, 24, 2),
--   ('YOUR_USER_ID', 'AI/ML', 25, 36, 3),
--   ('YOUR_USER_ID', 'Interview Prep', 37, 48, 4);
