-- Proposals table
create table public.proposals (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  created_by uuid not null references auth.users(id),
  title text not null,
  slug text not null unique,
  content jsonb,
  client_name text,
  client_email text,
  client_company text,
  contact_id uuid,
  status text not null default 'draft' check (status in ('draft', 'sent', 'viewed', 'signed', 'expired', 'declined')),
  currency text default 'USD',
  total_amount numeric(12, 2),
  password_hash text,
  expires_at timestamptz,
  sent_at timestamptz,
  viewed_at timestamptz,
  signed_at timestamptz,
  signed_pdf_url text,
  signature_data jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Indexes
create index proposals_workspace_id_idx on public.proposals(workspace_id);
create index proposals_slug_idx on public.proposals(slug);
create index proposals_status_idx on public.proposals(status);
create index proposals_created_by_idx on public.proposals(created_by);

-- Updated_at trigger
create trigger proposals_updated_at
  before update on public.proposals
  for each row execute function public.update_updated_at();

-- RLS
alter table public.proposals enable row level security;

-- Members can view proposals in their workspaces
create policy "Members can view workspace proposals"
  on public.proposals for select
  using (
    workspace_id in (
      select workspace_id from public.workspace_members
      where user_id = auth.uid()
    )
  );

-- Members can create proposals
create policy "Members can create proposals"
  on public.proposals for insert
  with check (
    workspace_id in (
      select workspace_id from public.workspace_members
      where user_id = auth.uid() and role in ('owner', 'admin', 'member')
    )
    and created_by = auth.uid()
  );

-- Creator, owners and admins can update
create policy "Authorized users can update proposals"
  on public.proposals for update
  using (
    (created_by = auth.uid())
    or workspace_id in (
      select workspace_id from public.workspace_members
      where user_id = auth.uid() and role in ('owner', 'admin')
    )
  );

-- Owners and admins can delete
create policy "Owners and admins can delete proposals"
  on public.proposals for delete
  using (
    workspace_id in (
      select workspace_id from public.workspace_members
      where user_id = auth.uid() and role in ('owner', 'admin')
    )
  );
