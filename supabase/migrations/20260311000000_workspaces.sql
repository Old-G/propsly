-- Workspaces table
create table public.workspaces (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  logo_url text,
  brand_primary_color text,
  brand_secondary_color text,
  company_address text,
  company_phone text,
  company_website text,
  industry text,
  stripe_account_id text,
  settings jsonb default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Workspace members table
create table public.workspace_members (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'member' check (role in ('owner', 'admin', 'member', 'viewer')),
  invited_at timestamptz default now(),
  joined_at timestamptz,
  unique (workspace_id, user_id)
);

-- Indexes
create index workspace_members_workspace_id_idx on public.workspace_members(workspace_id);
create index workspace_members_user_id_idx on public.workspace_members(user_id);

-- Updated_at trigger function (reusable)
create or replace function public.update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Apply trigger to workspaces
create trigger workspaces_updated_at
  before update on public.workspaces
  for each row execute function public.update_updated_at();

-- RLS
alter table public.workspaces enable row level security;
alter table public.workspace_members enable row level security;

-- Workspaces: members can view their workspaces
create policy "Members can view their workspaces"
  on public.workspaces for select
  using (
    id in (
      select workspace_id from public.workspace_members
      where user_id = auth.uid()
    )
  );

-- Workspaces: owners and admins can update
create policy "Owners and admins can update workspaces"
  on public.workspaces for update
  using (
    id in (
      select workspace_id from public.workspace_members
      where user_id = auth.uid() and role in ('owner', 'admin')
    )
  );

-- Workspaces: authenticated users can create
create policy "Authenticated users can create workspaces"
  on public.workspaces for insert
  with check (auth.uid() is not null);

-- Workspaces: only owners can delete
create policy "Owners can delete workspaces"
  on public.workspaces for delete
  using (
    id in (
      select workspace_id from public.workspace_members
      where user_id = auth.uid() and role = 'owner'
    )
  );

-- Workspace members: members can view members of their workspaces
create policy "Members can view workspace members"
  on public.workspace_members for select
  using (
    workspace_id in (
      select workspace_id from public.workspace_members
      where user_id = auth.uid()
    )
  );

-- Workspace members: owners and admins can manage members
create policy "Owners and admins can manage members"
  on public.workspace_members for insert
  with check (
    workspace_id in (
      select workspace_id from public.workspace_members
      where user_id = auth.uid() and role in ('owner', 'admin')
    )
  );

create policy "Owners and admins can update members"
  on public.workspace_members for update
  using (
    workspace_id in (
      select workspace_id from public.workspace_members
      where user_id = auth.uid() and role in ('owner', 'admin')
    )
  );

create policy "Owners and admins can remove members"
  on public.workspace_members for delete
  using (
    workspace_id in (
      select workspace_id from public.workspace_members
      where user_id = auth.uid() and role in ('owner', 'admin')
    )
  );
