-- Create storage bucket for proposal images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'proposal-images',
  'proposal-images',
  true,
  5242880, -- 5MB
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']
);

-- RLS: authenticated users can upload to their workspace folder
CREATE POLICY "Users can upload proposal images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'proposal-images'
  );

-- RLS: anyone can read (public bucket)
CREATE POLICY "Public read access for proposal images"
  ON storage.objects FOR SELECT
  TO public
  USING (
    bucket_id = 'proposal-images'
  );

-- RLS: authenticated users can delete their uploads
CREATE POLICY "Users can delete own proposal images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'proposal-images'
  );
