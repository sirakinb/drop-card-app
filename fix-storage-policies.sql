-- Fix Storage Bucket Policies for Contact Photos
-- Run this in your Supabase SQL Editor

-- First, drop existing policies if they exist
DROP POLICY IF EXISTS "Authenticated users can upload contact photos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update contact photos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete contact photos" ON storage.objects;
DROP POLICY IF EXISTS "Public can view contact photos" ON storage.objects;
DROP POLICY IF EXISTS "Only allow image uploads" ON storage.objects;

-- Create new policies with proper permissions

-- 1. Allow authenticated users to upload
CREATE POLICY "Users can upload contact photos"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'contact-photos');

-- 2. Allow authenticated users to update their photos
CREATE POLICY "Users can update contact photos"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'contact-photos');

-- 3. Allow authenticated users to delete their photos
CREATE POLICY "Users can delete contact photos"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'contact-photos');

-- 4. CRITICAL: Allow EVERYONE (including anonymous) to VIEW photos
CREATE POLICY "Anyone can view contact photos"
ON storage.objects
FOR SELECT
TO anon, authenticated
USING (bucket_id = 'contact-photos');

-- Alternative: If the above doesn't work, try this more permissive policy
-- CREATE POLICY "Public access for contact photos"
-- ON storage.objects
-- FOR SELECT
-- USING (bucket_id = 'contact-photos');

-- Verify the bucket is set to public
UPDATE storage.buckets 
SET public = true 
WHERE id = 'contact-photos';

-- Check if RLS is enabled (it should be)
-- If this returns false, you need to enable it
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables
WHERE schemaname = 'storage' 
  AND tablename = 'objects';
