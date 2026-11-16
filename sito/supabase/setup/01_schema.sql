-- =====================================================================
-- gabetti-adg — struttura del database per il nuovo progetto Supabase
-- (sostituisce Lovable Cloud). Da eseguire UNA volta in: SQL Editor → New query → Run.
--
-- Ricostruito dalle migrazioni di Lovable (sito/drizzle/migrations/0000–0004),
-- verificate contro i tipi del database in uso (src/integrations/supabase/types.ts).
-- Escluse le tabelle e funzioni della coda email di Lovable: le email non passano più da Lovable.
-- =====================================================================

-- ---------- Zone ----------
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

-- ---------- Agenzie ----------
CREATE TABLE public.agencies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  address text, phone text, email text,
  whatsapp_url text, instagram_url text, facebook_url text, google_url text, website_url text,
  city_slugs text[] NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.agencies TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.agencies TO authenticated;
GRANT ALL ON public.agencies TO service_role;
ALTER TABLE public.agencies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Agencies are public" ON public.agencies FOR SELECT USING (true);

-- ---------- Immobili ----------
CREATE SEQUENCE public.property_ref_seq START 1001;

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
  created_at timestamptz NOT NULL DEFAULT now(),
  reference_code text DEFAULT ('GAB-' || nextval('public.property_ref_seq')),
  agency_id uuid REFERENCES public.agencies(id) ON DELETE SET NULL
);
CREATE INDEX properties_city_zone_idx ON public.properties (city_slug, zone_slug);
CREATE UNIQUE INDEX properties_reference_code_key ON public.properties (reference_code);
GRANT SELECT ON public.properties TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.properties TO authenticated;
GRANT ALL ON public.properties TO service_role;
GRANT USAGE ON SEQUENCE public.property_ref_seq TO authenticated;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published properties are public" ON public.properties FOR SELECT USING (is_published = true);

-- Assegna in automatico l'agenzia in base alla città
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

-- ---------- Richieste sugli immobili ----------
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
GRANT SELECT ON public.leads TO authenticated;
GRANT ALL ON public.leads TO service_role;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can send a property request" ON public.leads FOR INSERT TO anon, authenticated
WITH CHECK (
  length(btrim(name)) BETWEEN 1 AND 120
  AND length(email) BETWEEN 3 AND 254 AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
  AND (phone IS NULL OR length(phone) <= 40)
  AND (message IS NULL OR length(message) <= 3000)
  AND type IN ('info','visita')
);

-- ---------- Ruoli dell'area admin ----------
CREATE TYPE public.app_role AS ENUM ('admin', 'agent');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT, INSERT, DELETE ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE OR REPLACE FUNCTION public.is_staff(_user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role IN ('admin','agent'))
$$;

CREATE POLICY "Users read own roles" ON public.user_roles FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins add roles" ON public.user_roles FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins remove roles" ON public.user_roles FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin') AND user_id <> auth.uid());

-- Il primo utente che si registra diventa admin in automatico
CREATE OR REPLACE FUNCTION public.bootstrap_first_admin()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin') THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin') ON CONFLICT DO NOTHING;
  END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER on_auth_user_created_bootstrap_admin
  AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.bootstrap_first_admin();

CREATE OR REPLACE FUNCTION public.admin_list_users()
RETURNS TABLE(id uuid, email text, created_at timestamptz, roles text[])
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN RAISE EXCEPTION 'not allowed'; END IF;
  RETURN QUERY SELECT u.id, u.email::text, u.created_at,
    COALESCE(array_agg(r.role::text) FILTER (WHERE r.role IS NOT NULL), '{}')
  FROM auth.users u LEFT JOIN public.user_roles r ON r.user_id = u.id
  GROUP BY u.id ORDER BY u.created_at;
END $$;
REVOKE ALL ON FUNCTION public.admin_list_users() FROM public, anon;
GRANT EXECUTE ON FUNCTION public.admin_list_users() TO authenticated;

-- Lo staff gestisce gli immobili, gli admin le agenzie
CREATE POLICY "Staff read all properties" ON public.properties FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "Staff insert properties" ON public.properties FOR INSERT TO authenticated WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "Staff update properties" ON public.properties FOR UPDATE TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "Staff delete properties" ON public.properties FOR DELETE TO authenticated USING (public.is_staff(auth.uid()));

CREATE POLICY "Admins insert agencies" ON public.agencies FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update agencies" ON public.agencies FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete agencies" ON public.agencies FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Staff read leads" ON public.leads FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));

-- ---------- Impostazioni del sito ----------
CREATE TABLE public.site_settings (key text PRIMARY KEY, value jsonb NOT NULL, updated_at timestamptz NOT NULL DEFAULT now());
GRANT SELECT ON public.site_settings TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_settings TO authenticated;
GRANT ALL ON public.site_settings TO service_role;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read settings" ON public.site_settings FOR SELECT TO anon, authenticated USING (key = 'compra_enabled');
CREATE POLICY "Admins manage settings" ON public.site_settings FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
INSERT INTO public.site_settings (key, value) VALUES ('compra_enabled', 'true');

-- ---------- Archivio foto immobili (privato: il sito usa link firmati) ----------
INSERT INTO storage.buckets (id, name, public) VALUES ('property-images', 'property-images', false)
ON CONFLICT (id) DO NOTHING;
CREATE POLICY "Staff read property images" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'property-images' AND public.is_staff(auth.uid()));
CREATE POLICY "Staff upload property images" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'property-images' AND public.is_staff(auth.uid()));
CREATE POLICY "Staff delete property images" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'property-images' AND public.is_staff(auth.uid()));
