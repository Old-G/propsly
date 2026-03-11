-- Proposal views (tracking)
create table public.proposal_views (
  id uuid primary key default gen_random_uuid(),
  proposal_id uuid not null references public.proposals(id) on delete cascade,
  viewer_ip text,
  viewer_location text,
  viewer_device text,
  viewer_ua text,
  viewed_at timestamptz not null default now()
);

create index proposal_views_proposal_id_idx on public.proposal_views(proposal_id);

-- Section views (time tracking per block)
create table public.section_views (
  id uuid primary key default gen_random_uuid(),
  proposal_id uuid not null references public.proposals(id) on delete cascade,
  view_id uuid not null references public.proposal_views(id) on delete cascade,
  block_id text,
  block_type text,
  time_spent_ms integer,
  created_at timestamptz not null default now()
);

create index section_views_proposal_id_idx on public.section_views(proposal_id);
create index section_views_view_id_idx on public.section_views(view_id);

-- RLS
alter table public.proposal_views enable row level security;
alter table public.section_views enable row level security;

-- Anyone can insert views (public proposal viewing)
create policy "Anyone can track views"
  on public.proposal_views for insert
  with check (true);

-- Workspace members can view tracking data
create policy "Members can view proposal tracking"
  on public.proposal_views for select
  using (
    proposal_id in (
      select p.id from public.proposals p
      join public.workspace_members wm on wm.workspace_id = p.workspace_id
      where wm.user_id = auth.uid()
    )
  );

-- Anyone can insert section views
create policy "Anyone can track section views"
  on public.section_views for insert
  with check (true);

-- Members can view section tracking
create policy "Members can view section tracking"
  on public.section_views for select
  using (
    proposal_id in (
      select p.id from public.proposals p
      join public.workspace_members wm on wm.workspace_id = p.workspace_id
      where wm.user_id = auth.uid()
    )
  );
