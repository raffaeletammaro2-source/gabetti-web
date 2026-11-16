CREATE TABLE public.agencies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  address text, phone text, email text,
  whatsapp_url text, instagram_url text, facebook_url text, google_url text, website_url text,
  city_slugs text[] NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.agencies TO anon, authenticated;
GRANT ALL ON public.agencies TO service_role;
ALTER TABLE public.agencies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Agencies are public" ON public.agencies FOR SELECT USING (true);

ALTER TABLE public.properties ADD COLUMN reference_code text;
ALTER TABLE public.properties ADD COLUMN agency_id uuid REFERENCES public.agencies(id) ON DELETE SET NULL;
CREATE SEQUENCE public.property_ref_seq START 1001;
UPDATE public.properties SET reference_code = 'GAB-' || nextval('public.property_ref_seq') WHERE reference_code IS NULL;
ALTER TABLE public.properties ALTER COLUMN reference_code SET DEFAULT 'GAB-' || nextval('public.property_ref_seq');
CREATE UNIQUE INDEX properties_reference_code_key ON public.properties(reference_code);

CREATE OR REPLACE FUNCTION public.assign_property_agency()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  IF NEW.agency_id IS NULL THEN
    SELECT id INTO NEW.agency_id FROM public.agencies WHERE NEW.city_slug = ANY(city_slugs) LIMIT 1;
  END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER properties_assign_agency BEFORE INSERT OR UPDATE OF city_slug, agency_id ON public.properties
FOR EACH ROW EXECUTE FUNCTION public.assign_property_agency();