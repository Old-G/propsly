-- Contacts table
create table public.contacts (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  name text not null,
  email text,
  company text,
  phone text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index contacts_workspace_id_idx on public.contacts(workspace_id);
create index contacts_email_idx on public.contacts(email);

-- Updated_at trigger
create trigger contacts_updated_at
  before update on public.contacts
  for each row execute function public.update_updated_at();

-- Add FK from proposals.contact_id to contacts (deferred because contacts table didn't exist when proposals was created)
alter table public.proposals
  add constraint proposals_contact_id_fkey
  foreign key (contact_id) references public.contacts(id) on delete set null;

-- RLS
alter table public.contacts enable row level security;

-- Members can view contacts
create policy "Members can view contacts"
  on public.contacts for select
  using (
    workspace_id in (
      select workspace_id from public.workspace_members
      where user_id = auth.uid()
    )
  );

-- Members can create contacts
create policy "Members can create contacts"
  on public.contacts for insert
  with check (
    workspace_id in (
      select workspace_id from public.workspace_members
      where user_id = auth.uid() and role in ('owner', 'admin', 'member')
    )
  );

-- Members can update contacts
create policy "Members can update contacts"
  on public.contacts for update
  using (
    workspace_id in (
      select workspace_id from public.workspace_members
      where user_id = auth.uid() and role in ('owner', 'admin', 'member')
    )
  );

-- Owners and admins can delete contacts
create policy "Owners and admins can delete contacts"
  on public.contacts for delete
  using (
    workspace_id in (
      select workspace_id from public.workspace_members
      where user_id = auth.uid() and role in ('owner', 'admin')
    )
  );
