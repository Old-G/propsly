-- Add default workspace to profiles
alter table public.profiles
  add column if not exists default_workspace_id uuid references public.workspaces(id) on delete set null;
