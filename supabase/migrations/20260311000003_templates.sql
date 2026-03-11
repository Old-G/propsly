-- Templates table
create table public.templates (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid references public.workspaces(id) on delete cascade,
  name text not null,
  description text,
  category text,
  content jsonb,
  preview_image_url text,
  is_system boolean not null default false,
  created_at timestamptz not null default now()
);

create index templates_workspace_id_idx on public.templates(workspace_id);
create index templates_category_idx on public.templates(category);

-- RLS
alter table public.templates enable row level security;

-- System templates are viewable by everyone
create policy "Anyone can view system templates"
  on public.templates for select
  using (is_system = true);

-- Workspace members can view their templates
create policy "Members can view workspace templates"
  on public.templates for select
  using (
    workspace_id in (
      select workspace_id from public.workspace_members
      where user_id = auth.uid()
    )
  );

-- Members can create templates in their workspace
create policy "Members can create templates"
  on public.templates for insert
  with check (
    workspace_id in (
      select workspace_id from public.workspace_members
      where user_id = auth.uid() and role in ('owner', 'admin', 'member')
    )
  );

-- Members can update their workspace templates
create policy "Members can update templates"
  on public.templates for update
  using (
    workspace_id in (
      select workspace_id from public.workspace_members
      where user_id = auth.uid() and role in ('owner', 'admin', 'member')
    )
  );

-- Owners and admins can delete templates
create policy "Owners and admins can delete templates"
  on public.templates for delete
  using (
    workspace_id in (
      select workspace_id from public.workspace_members
      where user_id = auth.uid() and role in ('owner', 'admin')
    )
  );
