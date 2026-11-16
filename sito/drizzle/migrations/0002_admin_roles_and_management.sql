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

-- First registered user becomes admin automatically
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

GRANT SELECT ON public.properties, public.agencies, public.zones TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.properties, public.agencies TO authenticated;
GRANT SELECT ON public.leads TO authenticated;
GRANT USAGE ON SEQUENCE public.property_ref_seq TO authenticated;

CREATE POLICY "Staff read all properties" ON public.properties FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "Staff insert properties" ON public.properties FOR INSERT TO authenticated WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "Staff update properties" ON public.properties FOR UPDATE TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "Staff delete properties" ON public.properties FOR DELETE TO authenticated USING (public.is_staff(auth.uid()));

CREATE POLICY "Admins insert agencies" ON public.agencies FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update agencies" ON public.agencies FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete agencies" ON public.agencies FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Staff read leads" ON public.leads FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));

CREATE POLICY "Public read property images" ON storage.objects FOR SELECT USING (bucket_id = 'property-images');
CREATE POLICY "Staff upload property images" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'property-images' AND public.is_staff(auth.uid()));
CREATE POLICY "Staff delete property images" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'property-images' AND public.is_staff(auth.uid()));