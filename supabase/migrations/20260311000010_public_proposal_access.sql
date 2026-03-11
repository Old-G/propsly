-- Allow anonymous users to read non-draft proposals by slug (for public viewer)
create policy "Public can view non-draft proposals"
  on public.proposals for select
  using (status != 'draft');

-- Allow anonymous users to read workspace branding for public proposals
create policy "Public can view workspace branding"
  on public.workspaces for select
  using (
    id in (
      select workspace_id from public.proposals
      where status != 'draft'
    )
  );

-- Allow anonymous users to update viewed_at on proposals (for view tracking)
create policy "Public can update viewed_at"
  on public.proposals for update
  using (status != 'draft')
  with check (status != 'draft');
