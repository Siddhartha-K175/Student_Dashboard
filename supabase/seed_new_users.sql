-- Run this AFTER schema.sql in the Supabase SQL editor.
-- Auto-seeds every new signup with a starter 48-week roadmap + a few demo
-- DSA problems, so strangers trying the app see something useful immediately
-- instead of a blank dashboard. Fires on both email and OAuth (GitHub) signups.

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  foundation_id uuid;
  dsa_id uuid;
  aiml_id uuid;
  interview_id uuid;
begin
  -- ── Phase 1: Foundation (weeks 1-8) ──
  insert into roadmap_phases (user_id, name, week_start, week_end, order_index)
  values (new.id, 'Foundation', 1, 8, 1)
  returning id into foundation_id;

  insert into roadmap_topics (phase_id, title) values
    (foundation_id, 'C Language'),
    (foundation_id, 'Python Basics'),
    (foundation_id, 'Git & GitHub'),
    (foundation_id, 'OOP Concepts'),
    (foundation_id, 'DBMS Basics');

  -- ── Phase 2: DSA Core (weeks 9-24) ──
  insert into roadmap_phases (user_id, name, week_start, week_end, order_index)
  values (new.id, 'DSA Core', 9, 24, 2)
  returning id into dsa_id;

  insert into roadmap_topics (phase_id, title) values
    (dsa_id, 'Arrays & Strings'),
    (dsa_id, 'Linked Lists'),
    (dsa_id, 'Stacks & Queues'),
    (dsa_id, 'Trees & Graphs'),
    (dsa_id, 'Dynamic Programming'),
    (dsa_id, 'Sorting & Searching'),
    (dsa_id, 'Recursion & Backtracking');

  -- ── Phase 3: AI/ML (weeks 25-36) ──
  insert into roadmap_phases (user_id, name, week_start, week_end, order_index)
  values (new.id, 'AI/ML', 25, 36, 3)
  returning id into aiml_id;

  insert into roadmap_topics (phase_id, title) values
    (aiml_id, 'NumPy & Pandas'),
    (aiml_id, 'Linear & Logistic Regression'),
    (aiml_id, 'Classification Algorithms'),
    (aiml_id, 'Neural Network Basics'),
    (aiml_id, 'Model Evaluation Metrics'),
    (aiml_id, 'MLOps Basics');

  -- ── Phase 4: Interview Prep (weeks 37-48) ──
  insert into roadmap_phases (user_id, name, week_start, week_end, order_index)
  values (new.id, 'Interview Prep', 37, 48, 4)
  returning id into interview_id;

  insert into roadmap_topics (phase_id, title) values
    (interview_id, 'Resume Building'),
    (interview_id, 'System Design Basics'),
    (interview_id, 'Mock Interviews'),
    (interview_id, 'Behavioral Questions'),
    (interview_id, 'Aptitude & Reasoning');

  -- ── Demo DSA problems (a few solved, one attempted, one todo) ──
  -- solved_at dates are spread over the last week so the dashboard's
  -- "solved over time" chart has something to show right away.
  insert into dsa_problems
    (user_id, title, platform, difficulty, pattern_tag, status, solved_at, link)
  values
    (new.id, 'Two Sum', 'LeetCode', 'easy', 'hashing', 'solved',
      now() - interval '6 days', 'https://leetcode.com/problems/two-sum/'),
    (new.id, 'Valid Parentheses', 'LeetCode', 'easy', 'stack', 'solved',
      now() - interval '4 days', 'https://leetcode.com/problems/valid-parentheses/'),
    (new.id, 'Reverse Linked List', 'LeetCode', 'easy', 'linked list', 'solved',
      now() - interval '1 day', 'https://leetcode.com/problems/reverse-linked-list/'),
    (new.id, 'Binary Search', 'LeetCode', 'easy', 'binary search', 'attempted',
      null, 'https://leetcode.com/problems/binary-search/'),
    (new.id, 'Merge Intervals', 'LeetCode', 'medium', 'sorting', 'todo',
      null, 'https://leetcode.com/problems/merge-intervals/');

  return new;
end;
$$;

-- Fire the function every time a new row is inserted into auth.users
-- (i.e. every signup, whether email/password or OAuth).
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
