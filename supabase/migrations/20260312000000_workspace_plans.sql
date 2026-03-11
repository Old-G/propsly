-- Add plan column to workspaces (default: free)
ALTER TABLE workspaces
ADD COLUMN plan text NOT NULL DEFAULT 'free'
CHECK (plan IN ('free', 'pro', 'team'));

-- Track upgrade interest
CREATE TABLE upgrade_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  requested_plan text NOT NULL CHECK (requested_plan IN ('pro', 'team')),
  email text,
  message text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- RLS
ALTER TABLE upgrade_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert their own upgrade requests"
  ON upgrade_requests FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own upgrade requests"
  ON upgrade_requests FOR SELECT
  USING (auth.uid() = user_id);

-- Index
CREATE INDEX idx_upgrade_requests_workspace ON upgrade_requests(workspace_id);
