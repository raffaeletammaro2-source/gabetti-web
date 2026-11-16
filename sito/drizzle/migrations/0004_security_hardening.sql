ALTER FUNCTION public.move_to_dlq(text,text,bigint,jsonb) SET search_path = '';
ALTER FUNCTION public.read_email_batch(text,integer,integer) SET search_path = '';
ALTER FUNCTION public.enqueue_email(text,jsonb) SET search_path = '';
ALTER FUNCTION public.delete_email(text,bigint) SET search_path = '';

DROP POLICY IF EXISTS "Anyone can send a property request" ON public.leads;
CREATE POLICY "Anyone can send a property request" ON public.leads FOR INSERT TO anon, authenticated
WITH CHECK (
  length(btrim(name)) BETWEEN 1 AND 120
  AND length(email) BETWEEN 3 AND 254 AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
  AND (phone IS NULL OR length(phone) <= 40)
  AND (message IS NULL OR length(message) <= 3000)
  AND type IN ('info','visita')
);

DROP POLICY IF EXISTS "Public read settings" ON public.site_settings;
CREATE POLICY "Public read settings" ON public.site_settings FOR SELECT TO anon, authenticated
USING (key = 'compra_enabled');

DROP POLICY IF EXISTS "Public read property images" ON storage.objects;
CREATE POLICY "Staff read property images" ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'property-images' AND public.is_staff(auth.uid()));