CREATE TABLE public.zones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  city text NOT NULL,
  city_slug text NOT NULL,
  name text NOT NULL,
  slug text NOT NULL,
  UNIQUE (city_slug, slug)
);
GRANT SELECT ON public.zones TO anon, authenticated;
GRANT ALL ON public.zones TO service_role;
ALTER TABLE public.zones ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Zones are public" ON public.zones FOR SELECT USING (true);

CREATE TABLE public.properties (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL,
  title text NOT NULL,
  property_type text NOT NULL DEFAULT 'appartamento',
  contract text NOT NULL DEFAULT 'vendita',
  price integer NOT NULL,
  price_previous integer,
  surface_m2 integer NOT NULL,
  rooms integer NOT NULL,
  bathrooms integer NOT NULL DEFAULT 1,
  floor text,
  total_floors integer,
  condition text,
  heating text,
  energy_class text,
  has_elevator boolean NOT NULL DEFAULT false,
  has_garage boolean NOT NULL DEFAULT false,
  has_cellar boolean NOT NULL DEFAULT false,
  has_terrace boolean NOT NULL DEFAULT false,
  has_balcony boolean NOT NULL DEFAULT false,
  has_garden boolean NOT NULL DEFAULT false,
  has_pool boolean NOT NULL DEFAULT false,
  is_furnished boolean NOT NULL DEFAULT false,
  has_air_conditioning boolean NOT NULL DEFAULT false,
  sea_view boolean NOT NULL DEFAULT false,
  has_virtual_tour boolean NOT NULL DEFAULT false,
  virtual_tour_url text,
  address text,
  zone text,
  zone_slug text,
  city text NOT NULL,
  city_slug text NOT NULL,
  province text DEFAULT 'NA',
  lat double precision,
  lng double precision,
  description text,
  images text[] NOT NULL DEFAULT '{}',
  floorplan_url text,
  agent_name text,
  agent_phone text,
  agent_email text,
  is_exclusive boolean NOT NULL DEFAULT false,
  is_published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX properties_city_zone_idx ON public.properties (city_slug, zone_slug);
GRANT SELECT ON public.properties TO anon, authenticated;
GRANT ALL ON public.properties TO service_role;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published properties are public" ON public.properties FOR SELECT USING (is_published = true);

CREATE TABLE public.leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid,
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  message text,
  type text NOT NULL DEFAULT 'info',
  visit_date date,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT leads_type_chk CHECK (type IN ('info','visita')),
  CONSTRAINT leads_len_chk CHECK (char_length(name) BETWEEN 1 AND 120 AND char_length(email) BETWEEN 3 AND 255 AND char_length(coalesce(message,'')) <= 2000 AND char_length(coalesce(phone,'')) <= 30)
);
GRANT INSERT ON public.leads TO anon, authenticated;
GRANT ALL ON public.leads TO service_role;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can send a property request" ON public.leads FOR INSERT TO anon, authenticated WITH CHECK (true);