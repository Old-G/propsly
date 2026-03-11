-- Function to create workspace + add owner atomically
-- Uses SECURITY DEFINER to bypass RLS (runs as postgres role)
create or replace function public.create_workspace_with_owner(
  p_user_id uuid,
  p_name text,
  p_logo_url text default null,
  p_brand_primary_color text default null,
  p_brand_secondary_color text default null,
  p_industry text default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_workspace_id uuid;
begin
  -- Verify caller is the user
  if auth.uid() is distinct from p_user_id then
    raise exception 'Unauthorized';
  end if;

  -- Create workspace
  insert into public.workspaces (name, logo_url, brand_primary_color, brand_secondary_color, industry)
  values (p_name, p_logo_url, p_brand_primary_color, p_brand_secondary_color, p_industry)
  returning id into v_workspace_id;

  -- Add user as owner
  insert into public.workspace_members (workspace_id, user_id, role, joined_at)
  values (v_workspace_id, p_user_id, 'owner', now());

  -- Set as default workspace
  update public.profiles
  set default_workspace_id = v_workspace_id
  where id = p_user_id;

  return v_workspace_id;
end;
$$;
