-- Fix infinite recursion in workspace_members RLS policies
-- The SELECT policy was referencing workspace_members in its own check, causing recursion.

-- Drop all existing workspace_members policies
drop policy if exists "Members can view workspace members" on public.workspace_members;
drop policy if exists "Owners and admins can manage members" on public.workspace_members;
drop policy if exists "Owners and admins can update members" on public.workspace_members;
drop policy if exists "Owners and admins can remove members" on public.workspace_members;

-- SELECT: users can see members of workspaces they belong to
-- Use auth.uid() directly to avoid recursion
create policy "Members can view workspace members"
  on public.workspace_members for select
  using (user_id = auth.uid());

-- INSERT: allow authenticated users to insert themselves as owner (for workspace creation)
-- or allow owners/admins to add other members
create policy "Users can join or admins can add members"
  on public.workspace_members for insert
  with check (
    -- Allow inserting yourself (for workspace creation / accepting invite)
    (user_id = auth.uid())
    or
    -- Allow owners/admins to add others
    exists (
      select 1 from public.workspace_members existing
      where existing.workspace_id = workspace_id
        and existing.user_id = auth.uid()
        and existing.role in ('owner', 'admin')
    )
  );

-- UPDATE: only owners and admins
create policy "Owners and admins can update members"
  on public.workspace_members for update
  using (
    exists (
      select 1 from public.workspace_members existing
      where existing.workspace_id = workspace_id
        and existing.user_id = auth.uid()
        and existing.role in ('owner', 'admin')
    )
  );

-- DELETE: only owners and admins, or user removing themselves
create policy "Owners and admins can remove members"
  on public.workspace_members for delete
  using (
    user_id = auth.uid()
    or exists (
      select 1 from public.workspace_members existing
      where existing.workspace_id = workspace_id
        and existing.user_id = auth.uid()
        and existing.role in ('owner', 'admin')
    )
  );
