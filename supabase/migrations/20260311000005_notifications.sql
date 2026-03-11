-- Notifications table
create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type text not null,
  proposal_id uuid references public.proposals(id) on delete cascade,
  message text,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

create index notifications_user_id_idx on public.notifications(user_id);
create index notifications_user_read_idx on public.notifications(user_id, read);

-- RLS
alter table public.notifications enable row level security;

-- Users can view their own notifications
create policy "Users can view own notifications"
  on public.notifications for select
  using (user_id = auth.uid());

-- System can create notifications (via service role)
create policy "Service role can create notifications"
  on public.notifications for insert
  with check (true);

-- Users can update their own notifications (mark as read)
create policy "Users can update own notifications"
  on public.notifications for update
  using (user_id = auth.uid());

-- Users can delete their own notifications
create policy "Users can delete own notifications"
  on public.notifications for delete
  using (user_id = auth.uid());
