-- Supabase Storage RLS Policies
--
-- Run this in the Supabase SQL Editor if you want to enable direct
-- client-side uploads (optional — the API routes use the service role
-- key which bypasses RLS, so these are only needed for client-side access).

-- Public read access for avatars
CREATE POLICY "Public read access for avatars"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

-- Authenticated users can upload avatars
CREATE POLICY "Authenticated users can upload avatars"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'avatars' AND auth.role() = 'authenticated');

-- Authenticated users can update their avatars
CREATE POLICY "Authenticated users can update avatars"
ON storage.objects FOR UPDATE
USING (bucket_id = 'avatars' AND auth.role() = 'authenticated');

-- Authenticated users can delete their avatars
CREATE POLICY "Authenticated users can delete avatars"
ON storage.objects FOR DELETE
USING (bucket_id = 'avatars' AND auth.role() = 'authenticated');

-- Authenticated users can manage resumes
CREATE POLICY "Authenticated users can manage resumes"
ON storage.objects FOR ALL
USING (bucket_id = 'resumes' AND auth.role() = 'authenticated')
WITH CHECK (bucket_id = 'resumes' AND auth.role() = 'authenticated');

-- Authenticated users can manage cover letters
CREATE POLICY "Authenticated users can manage cover letters"
ON storage.objects FOR ALL
USING (bucket_id = 'cover-letters' AND auth.role() = 'authenticated')
WITH CHECK (bucket_id = 'cover-letters' AND auth.role() = 'authenticated');

-- Authenticated users can manage message attachments
CREATE POLICY "Authenticated users can manage message attachments"
ON storage.objects FOR ALL
USING (bucket_id = 'message-attachments' AND auth.role() = 'authenticated')
WITH CHECK (bucket_id = 'message-attachments' AND auth.role() = 'authenticated');
