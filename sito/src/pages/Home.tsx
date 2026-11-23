import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  Building2,
  Home as HomeIcon,
  KeyRound,
  MapPin,
  Pause,
  Play,
  Search,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SeoHead from "@/components/SeoHead";
import { WhatsAppIcon, InstagramIcon, FacebookIcon } from "@/components/SocialIcons";
import logo from "@/assets/gabetti-logo.png";
import { agencies } from "@/data/agencies";
import { cities } from "@/data/cities";
import { useReveal } from "@/hooks/useReveal";
import { useCompraEnabled } from "@/lib/siteSettings";
import { trackCtaClick, trackWhatsAppClick } from "@/lib/tracking";
import {
  organizationSchema,
  websiteSchema,
  buildFaqSchema,
  buildLocationsSchema,
  buildBreadcrumbSchema,
} from "@/lib/seoSchemas";

/* ────────────────────────────────────────────────────────────────────────────
 * VIDEO DI INTRO
 * Per ora è un video stock gratuito (Pexels, licenza libera: Napoli e Vesuvio dall'alto).
 * Quando c'è il video vero: metterlo in sito/public/video/ (es. intro.mp4 e intro-mobile.mp4,
 * MP4 H.264, senza audio, 15-30 s, sotto 8 MB il desktop e 3 MB il mobile) e cambiare i tre
 * indirizzi qui sotto in "/video/intro.mp4", "/video/intro-mobile.mp4", "/video/intro-poster.jpg".
 * ──────────────────────────────────────────────────────────────────────────── */
const HERO_VIDEO = {
  desktop: "https://videos.pexels.com/video-files/19896389/19896389-hd_1920_1080_24fps.mp4",
  mobile: "https://videos.pexels.com/video-files/19896389/19896389-sd_960_540_24fps.mp4",
  poster: "https://images.pexels.com/videos/19896389/pexels-photo-19896389.jpeg?auto=compress&cs=tinysrgb&w=1600",
};

const INTRO_KEY = "gab_intro_seen";

/* Tutti i comuni serviti, nell'ordine delle agenzie, con il link alla pagina di valutazione se esiste. */
const allComuni = agencies.flatMap((a) =>
  a.comuni.map((c) => ({ name: c, agency: a.name, slug: cities.find((x) => x.name === c)?.slug })),
);

const faqs = [
  {
    q: "Dove si trovano le agenzie Gabetti a Napoli nord?",
    a: "Gabetti Franchising Gruppo ADG ha cinque agenzie immobiliari nell'area a nord di Napoli: Marano di Napoli, Mugnano di Napoli, Villaricca-Qualiano, Giugliano in Campania e Frattamaggiore. Ogni agenzia segue i comuni vicini con consulenti che lavorano nella zona.",
  },
  {
    q: "In quali comuni operano le agenzie Gabetti del Gruppo ADG?",
    a: `Seguiamo compravendite e valutazioni a ${allComuni.map((c) => c.name).join(", ")}.`,
  },
  {
    q: "Di cosa si occupano le agenzie Gabetti di Napoli nord?",
    a: "Vendita e acquisto di case, affitti, valutazione gratuita dell'immobile basata sui prezzi reali di vendita in zona, appartamenti di nuova costruzione (cantieri a Mugnano in Via Pietro Nenni e Via IV Martiri), consulenza su mutuo, assicurazione e pratiche tecniche.",
  },
  {
    q: "Quanto costa la valutazione di una casa con Gabetti?",
    a: "La valutazione è gratuita e senza impegno. Parte dai prezzi reali di vendita degli ultimi 6 mesi nel tuo quartiere e la fa un consulente della tua zona. Si richiede dalla pagina Vendi casa.",
  },
  {
    q: "Che differenza c'è tra Gabetti e Gabetti Franchising Gruppo ADG?",
    a: "Gabetti è il marchio immobiliare nazionale, nato nel 1950. Le agenzie Gabetti Franchising sono affiliate indipendenti: il Gruppo ADG gestisce le cinque sedi di Napoli nord e unisce gli strumenti e la rete del marchio alla conoscenza diretta del territorio.",
  },
];

/* ─────────────────────────────── componenti ─────────────────────────────── */

const Counter = ({ to, prefix = "", suffix = "" }: { to: number; prefix?: string; suffix?: string }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const [val, setVal] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVal(to);
      return;
    }
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const start = performance.now();
      const dur = 1800;
      const tick = (t: number) => {
        const p = Math.min(1, (t - start) / dur);
        setVal(Math.round(to * (1 - Math.pow(1 - p, 4))));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
    io.observe(el);
    return () => io.disconnect();
  }, [to]);
  return (
    <span ref={ref} className="tabular-nums">
      {prefix}
      {val}
      {suffix}
    </span>
  );
};

const Eyebrow = ({ children, light = false }: { children: React.ReactNode; light?: boolean }) => (
  <p className={`reveal flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.25em] ${light ? "text-white/70" : "text-primary"}`}>
    <span className={`line-grow block h-px w-10 ${light ? "bg-white/60" : "bg-primary"}`} />
    {children}
  </p>
);

const Words = ({ text, offset = 0 }: { text: string; offset?: number }) => (
  <>
    {text.split(" ").map((w, i) => (
      <span key={i} className="word">
        <span style={{ ["--i" as string]: i + offset }}>{w}&nbsp;</span>
      </span>
    ))}
  </>
);

/* ─────────────────────────────── hero ─────────────────────────────── */

const Hero = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(true);
  const [showIntro] = useState(() => {
    try {
      if (sessionStorage.getItem(INTRO_KEY)) return false;
      sessionStorage.setItem(INTRO_KEY, "1");
    } catch {
      /* storage non disponibile: mostriamo comunque l'intro */
    }
    return true;
  });
  const [isMobile] = useState(() => typeof window !== "undefined" && window.innerWidth < 768);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      v.pause();
      setPlaying(false);
    }
  }, []);

  const toggle = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play();
      setPlaying(true);
    } else {
      v.pause();
      setPlaying(false);
    }
  };

  return (
    <section
      className="relative flex min-h-[100svh] items-end overflow-hidden bg-neutral-950 text-white"
      aria-label="Gabetti Franchising Napoli Nord"
    >
      <video
        ref={videoRef}
        className="hero-video absolute inset-0 h-full w-full object-cover"
        src={isMobile ? HERO_VIDEO.mobile : HERO_VIDEO.desktop}
        poster={HERO_VIDEO.poster}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
      />
      {/* Velature per leggibilità */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/50" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_80%,hsl(var(--primary)/0.35),transparent_55%)]" />

      <div className="container relative z-10 pb-20 pt-40 md:pb-28">
        <div className="max-w-4xl" style={{ ["--d" as string]: showIntro ? "2.1s" : "0.5s" }}>
          <p className="hero-fade mb-6 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.3em] text-white/80 md:text-xs">
            <span className="block h-px w-10 bg-primary" />
            Gabetti Franchising · Gruppo ADG
          </p>
          <h1
            className="text-[2.6rem] font-extralight leading-[1.02] tracking-tight sm:text-6xl md:text-7xl lg:text-[5.5rem]"
            style={{ ["--base" as string]: showIntro ? "1.5s" : "0.15s" }}
          >
            <span className="block">
              <Words text="Agenzie immobiliari" />
            </span>
            <span className="block font-bold">
              <Words text="a Napoli Nord." offset={2} />
            </span>
          </h1>
          <p
            className="hero-fade mt-7 max-w-2xl text-base leading-relaxed text-white/85 md:text-xl"
            style={{ ["--d" as string]: showIntro ? "2.5s" : "0.8s" }}
          >
            Cinque sedi Gabetti tra Marano, Mugnano, Villaricca, Qualiano, Giugliano e Frattamaggiore. Vendiamo e
            valutiamo case con consulenti che conoscono ogni strada del quartiere.
          </p>
          <div
            className="hero-fade mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4"
            style={{ ["--d" as string]: showIntro ? "2.8s" : "1s" }}
          >
            <Link
              to="/vendicasa"
              onClick={() => trackCtaClick("home_hero_valutazione")}
              className="group inline-flex items-center justify-center gap-3 rounded-full bg-primary px-8 py-4 text-sm font-bold uppercase tracking-wider text-primary-foreground transition-all hover:gap-5 hover:bg-[hsl(var(--primary-dark))]"
            >
              Valuta la tua casa <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="#sedi"
              onClick={() => trackCtaClick("home_hero_sedi")}
              className="inline-flex items-center justify-center gap-3 rounded-full border border-white/40 px-8 py-4 text-sm font-bold uppercase tracking-wider text-white backdrop-blur-sm transition-colors hover:bg-white hover:text-foreground"
            >
              <MapPin className="h-4 w-4" /> Trova la sede più vicina
            </a>
          </div>
        </div>
      </div>

      {/* Scorri + pausa video */}
      <div className="hero-fade absolute inset-x-0 bottom-6 z-10" style={{ ["--d" as string]: showIntro ? "3.2s" : "1.2s" }}>
        <div className="container flex items-center gap-6">
          <a href="#chi-siamo" className="hidden items-center gap-3 text-[11px] uppercase tracking-[0.3em] text-white/70 hover:text-white md:flex">
            <span className="relative flex h-9 w-5 justify-center rounded-full border border-white/50 pt-2">
              <span className="scroll-dot block h-1.5 w-1 rounded-full bg-white" />
            </span>
            Scopri
          </a>
          <button
            type="button"
            onClick={toggle}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/40 text-white/90 backdrop-blur-sm hover:bg-white/10"
            aria-label={playing ? "Metti in pausa il video" : "Riproduci il video"}
          >
            {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Intro: sipario rosso con il logo, una volta per sessione */}
      {showIntro && (
        <div className="intro-curtain pointer-events-none fixed inset-0 z-[60] flex items-center justify-center bg-primary" aria-hidden="true">
          <div className="intro-logo flex flex-col items-center gap-5">
            <img src={logo} alt="" className="h-20 w-auto brightness-0 invert md:h-28" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.4em] text-white/80">Napoli Nord</span>
          </div>
        </div>
      )}
    </section>
  );
};

/* ─────────────────────────────── sedi ─────────────────────────────── */

const Sedi = () => {
  const [active, setActive] = useState(0);
  const a = agencies[active];
  return (
    <section id="sedi" className="scroll-mt-20 bg-neutral-950 py-24 text-white md:py-32">
      <div className="container">
        <div className="mb-14 grid gap-6 md:grid-cols-2 md:items-end">
          <div>
            <Eyebrow light>Le nostre sedi</Eyebrow>
            <h2 className="reveal mt-5 text-4xl font-extralight leading-tight md:text-6xl" style={{ ["--d" as string]: "100ms" }}>
              Cinque agenzie, <span className="font-bold">un solo territorio.</span>
            </h2>
          </div>
          <p className="reveal text-white/70 md:text-lg" style={{ ["--d" as string]: "200ms" }}>
            Ogni agenzia segue i comuni vicini a sé: chi ti risponde vive e lavora nella tua zona e conosce i prezzi
            reali di ogni quartiere.
          </p>
        </div>

        <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr]">
          {/* elenco */}
          <ol className="divide-y divide-white/10 border-y border-white/10" role="tablist" aria-label="Agenzie Gabetti">
            {agencies.map((ag, i) => (
              <li key={ag.name} className="reveal" style={{ ["--d" as string]: `${i * 80}ms` }}>
                <button
                  type="button"
                  role="tab"
                  aria-selected={active === i}
                  aria-controls="sede-panel"
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onClick={() => setActive(i)}
                  className="group flex w-full items-center gap-6 py-6 text-left"
                >
                  <span className={`text-xs tabular-nums transition-colors ${active === i ? "text-primary" : "text-white/40"}`}>
                    0{i + 1}
                  </span>
                  <span
                    className={`flex-1 text-2xl font-light transition-all duration-500 md:text-4xl ${
                      active === i ? "translate-x-2 text-white" : "text-white/45 group-hover:text-white/80"
                    }`}
                  >
                    {ag.name.replace("Gabetti ", "")}
                  </span>
                  <ArrowUpRight
                    className={`h-6 w-6 transition-all duration-500 ${active === i ? "rotate-45 text-primary opacity-100" : "opacity-0"}`}
                  />
                </button>
              </li>
            ))}
          </ol>

          {/* dettaglio */}
          <div id="sede-panel" role="tabpanel" className="reveal lg:sticky lg:top-28 lg:self-start">
            <article key={a.name} className="hero-fade rounded-2xl border border-white/10 bg-white/[0.03] p-8 md:p-10" style={{ ["--d" as string]: "0s" }}>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">Agenzia immobiliare</p>
              <h3 className="mt-3 text-3xl font-bold">{a.name}</h3>
              <p className="mt-2 flex items-center gap-2 text-white/60">
                <MapPin className="h-4 w-4" /> {a.town} (NA)
              </p>
              <p className="mt-6 leading-relaxed text-white/80">{a.area}.</p>

              <p className="mt-8 text-xs font-semibold uppercase tracking-[0.2em] text-white/50">Zone seguite</p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {a.comuni.map((c) => {
                  const slug = cities.find((x) => x.name === c)?.slug;
                  return (
                    <li key={c}>
                      {slug ? (
                        <Link
                          to={`/${slug}`}
                          className="inline-flex items-center gap-1 rounded-full border border-white/20 px-4 py-1.5 text-sm transition-colors hover:border-primary hover:bg-primary"
                        >
                          {c} <ArrowUpRight className="h-3.5 w-3.5" />
                        </Link>
                      ) : (
                        <span className="inline-flex rounded-full border border-white/10 px-4 py-1.5 text-sm text-white/70">{c}</span>
                      )}
                    </li>
                  );
                })}
              </ul>

              <div className="mt-10 flex flex-wrap items-center gap-3 border-t border-white/10 pt-6">
                <a
                  href={a.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackWhatsAppClick(a.whatsapp)}
                  className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-5 py-2.5 text-sm font-bold text-white hover:opacity-90"
                >
                  <WhatsAppIcon className="h-4 w-4" /> Scrivi all'agenzia
                </a>
                {a.instagram && (
                  <a href={a.instagram} target="_blank" rel="noopener noreferrer" aria-label={`Instagram ${a.name}`}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 hover:bg-white/10">
                    <InstagramIcon className="h-4 w-4" />
                  </a>
                )}
                <a href={a.facebook} target="_blank" rel="noopener noreferrer" aria-label={`Facebook ${a.name}`}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 hover:bg-white/10">
                  <FacebookIcon className="h-4 w-4" />
                </a>
                <a href={a.google} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-2 text-sm text-white/70 underline-offset-4 hover:text-white hover:underline">
                  Recensioni su Google <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
};

/* ─────────────────────────────── pagina ─────────────────────────────── */

const Home = () => {
  const { data: compraOn } = useCompraEnabled();
  useReveal([compraOn]);

  const services = [
    { to: "/vendicasa", icon: HomeIcon, title: "Vendi casa", text: "Valutazione gratuita sui prezzi reali di vendita della tua zona, poi un piano per vendere al prezzo giusto." },
    ...(compraOn ? [{ to: "/compra", icon: Search, title: "Compra casa", text: "Gli immobili in vendita a Napoli nord, scelti e verificati dalle nostre agenzie." }] : []),
    { to: "/nuove-costruzioni", icon: Building2, title: "Nuove costruzioni", text: "Appartamenti nuovi a Mugnano, in Via Pietro Nenni e Via IV Martiri, con assistenza su mutuo e capitolato." },
    { to: "/servizi", icon: KeyRound, title: "Tutti i servizi", text: "Affitti, mutui, assicurazioni, utenze e pratiche tecniche: un solo riferimento per la casa." },
  ];

  const pillars = [
    { icon: ShieldCheck, title: "Un marchio dal 1950", text: "Gabetti è uno dei nomi storici dell'immobiliare italiano: metodi, strumenti e tutele di una rete nazionale." },
    { icon: Users, title: "Consulenti del posto", text: "Chi ti segue lavora nel tuo comune: conosce le strade, i palazzi e chi sta cercando casa in zona." },
    { icon: Sparkles, title: "Prezzi reali, zero pressioni", text: "Partiamo dalle vendite concluse negli ultimi mesi, non dalle richieste degli annunci. E decidi tu, con calma." },
  ];

  return (
    <>
      <SeoHead
        title="Agenzia Immobiliare Napoli Nord | Gabetti Marano, Mugnano, Giugliano"
        description="Gabetti Franchising Gruppo ADG: 5 agenzie immobiliari a Marano, Mugnano, Villaricca-Qualiano, Giugliano e Frattamaggiore. Vendita, acquisto, nuove costruzioni e valutazione casa gratuita a Napoli nord."
        canonical="/"
        jsonLd={[
          organizationSchema,
          websiteSchema,
          buildLocationsSchema(
            agencies.map((a) => ({
              name: a.name,
              town: a.town,
              comuni: a.comuni,
              whatsapp: a.whatsapp,
              sameAs: [a.instagram, a.facebook].filter(Boolean) as string[],
            })),
          ),
          buildFaqSchema(faqs),
          buildBreadcrumbSchema([{ name: "Home", url: "/" }]),
        ]}
      />
      <Header overlay />
      <main>
        <Hero />

        {/* Chi siamo */}
        <section id="chi-siamo" className="scroll-mt-20 bg-background py-24 md:py-36">
          <div className="container grid gap-14 lg:grid-cols-[1fr_1.4fr]">
            <div>
              <Eyebrow>Chi siamo</Eyebrow>
              <h2 className="reveal mt-5 text-4xl font-extralight leading-[1.1] md:text-5xl" style={{ ["--d" as string]: "100ms" }}>
                Il marchio Gabetti, <span className="font-bold text-primary">radicato a Napoli nord.</span>
              </h2>
            </div>
            <div className="space-y-6 text-lg leading-relaxed text-muted-foreground md:text-xl">
              <p className="reveal" style={{ ["--d" as string]: "150ms" }}>
                <strong className="font-semibold text-foreground">Gabetti Franchising Gruppo ADG</strong> è la rete di cinque
                agenzie immobiliari Gabetti nell'area a nord di Napoli: Marano di Napoli, Mugnano di Napoli,
                Villaricca-Qualiano, Giugliano in Campania e Frattamaggiore.
              </p>
              <p className="reveal" style={{ ["--d" as string]: "250ms" }}>
                Seguiamo chi vende, chi compra e chi affitta casa, e accompagniamo i cantieri di nuova costruzione a Mugnano.
                Uniamo gli strumenti di un marchio nazionale alla cosa che conta di più in questo mestiere: conoscere il
                territorio da dentro.
              </p>
            </div>
          </div>

          {/* Numeri */}
          <div className="container mt-20 md:mt-28">
            <dl className="grid grid-cols-2 gap-y-12 border-t border-border pt-12 md:grid-cols-4">
              {[
                { n: <Counter to={1950} />, l: "l'anno in cui nasce Gabetti" },
                { n: <Counter to={5} />, l: "agenzie a Napoli nord" },
                { n: <Counter to={allComuni.length} />, l: "comuni e quartieri seguiti" },
                { n: <Counter to={500} prefix="+" />, l: "immobili venduti in zona" },
              ].map((s, i) => (
                <div key={i} className="reveal" style={{ ["--d" as string]: `${i * 120}ms` }}>
                  <dt className="sr-only">{s.l}</dt>
                  <dd className="text-5xl font-extralight tracking-tight text-foreground md:text-6xl">{s.n}</dd>
                  <dd className="mt-2 text-sm uppercase tracking-wider text-muted-foreground">{s.l}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* Servizi */}
        <section className="bg-muted py-24 md:py-32">
          <div className="container">
            <Eyebrow>Cosa facciamo</Eyebrow>
            <h2 className="reveal mb-14 mt-5 max-w-3xl text-4xl font-extralight leading-tight md:text-5xl" style={{ ["--d" as string]: "100ms" }}>
              Tutto quello che serve, <span className="font-bold">dalla valutazione al rogito.</span>
            </h2>
            <div className={`grid gap-5 sm:grid-cols-2 ${services.length === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"}`}>
              {services.map(({ to, icon: Icon, title, text }, i) => (
                <Link
                  key={to}
                  to={to}
                  onClick={() => trackCtaClick(`home_servizio_${to}`)}
                  className="reveal group relative flex min-h-[280px] flex-col overflow-hidden rounded-2xl bg-background p-8 shadow-sm transition-shadow duration-500 hover:shadow-xl"
                  style={{ ["--d" as string]: `${i * 100}ms` }}
                >
                  <span className="absolute inset-x-0 bottom-0 h-0 bg-primary transition-all duration-500 ease-out group-hover:h-full" />
                  <Icon className="relative h-8 w-8 text-primary transition-colors duration-500 group-hover:text-white" strokeWidth={1.5} />
                  <h3 className="relative mt-auto pt-10 text-2xl font-bold transition-colors duration-500 group-hover:text-white">{title}</h3>
                  <p className="relative mt-3 text-sm leading-relaxed text-muted-foreground transition-colors duration-500 group-hover:text-white/85">{text}</p>
                  <ArrowUpRight className="relative mt-6 h-5 w-5 text-foreground transition-all duration-500 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-white" />
                </Link>
              ))}
            </div>
          </div>
        </section>

        <Sedi />

        {/* Dove operiamo */}
        <section id="zone" className="overflow-hidden bg-background py-24 md:py-32">
          <div className="container">
            <Eyebrow>Dove operiamo</Eyebrow>
            <h2 className="reveal mt-5 max-w-3xl text-4xl font-extralight leading-tight md:text-5xl" style={{ ["--d" as string]: "100ms" }}>
              Le nostre zone di competenza <span className="font-bold">a nord di Napoli.</span>
            </h2>
            <p className="reveal mt-6 max-w-2xl text-lg text-muted-foreground" style={{ ["--d" as string]: "200ms" }}>
              Per ogni comune trovi prezzi al metro quadro, tempi medi di vendita e quartieri più richiesti, con la
              valutazione gratuita della tua casa.
            </p>
          </div>

          <div className="mt-14 border-y border-border py-6" aria-hidden="true">
            <div className="marquee flex w-max gap-12 whitespace-nowrap text-5xl font-extralight text-foreground/15 md:text-7xl">
              {[...allComuni, ...allComuni].map((c, i) => (
                <span key={i} className="flex items-center gap-12">
                  {c.name} <span className="text-primary/40">·</span>
                </span>
              ))}
            </div>
          </div>

          <div className="container mt-14">
            <ul className="grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
              {cities.map((c, i) => (
                <li key={c.slug} className="reveal bg-background" style={{ ["--d" as string]: `${(i % 3) * 80}ms` }}>
                  <Link to={`/${c.slug}`} className="group flex h-full items-center justify-between gap-4 p-6 transition-colors hover:bg-muted">
                    <span>
                      <span className="block text-lg font-semibold">Agenzia immobiliare {c.name}</span>
                      <span className="mt-1 block text-sm text-muted-foreground">
                        {c.agency} · valutazione casa gratuita
                      </span>
                    </span>
                    <ArrowRight className="h-5 w-5 shrink-0 text-primary transition-transform group-hover:translate-x-1" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Perché Gabetti */}
        <section className="bg-muted py-24 md:py-32">
          <div className="container">
            <Eyebrow>Perché sceglierci</Eyebrow>
            <div className="mt-12 grid gap-12 md:grid-cols-3">
              {pillars.map(({ icon: Icon, title, text }, i) => (
                <div key={title} className="reveal" style={{ ["--d" as string]: `${i * 120}ms` }}>
                  <span className="text-xs tabular-nums text-primary">0{i + 1}</span>
                  <span className="line-grow mt-3 block h-px w-full bg-foreground/15" style={{ ["--d" as string]: `${i * 120 + 200}ms` }} />
                  <Icon className="mt-8 h-8 w-8 text-primary" strokeWidth={1.5} />
                  <h3 className="mt-5 text-2xl font-bold">{title}</h3>
                  <p className="mt-3 leading-relaxed text-muted-foreground">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="bg-background py-24 md:py-32">
          <div className="container grid gap-12 lg:grid-cols-[1fr_1.6fr]">
            <div>
              <Eyebrow>Domande frequenti</Eyebrow>
              <h2 className="reveal mt-5 text-4xl font-extralight leading-tight md:text-5xl" style={{ ["--d" as string]: "100ms" }}>
                Le agenzie Gabetti <span className="font-bold">a Napoli nord, in breve.</span>
              </h2>
            </div>
            <Accordion type="single" collapsible defaultValue="faq-0" className="reveal" style={{ ["--d" as string]: "150ms" }}>
              {faqs.map((f, i) => (
                <AccordionItem key={i} value={`faq-${i}`}>
                  <AccordionTrigger className="py-6 text-left text-lg font-semibold hover:no-underline">{f.q}</AccordionTrigger>
                  <AccordionContent className="pb-6 text-base leading-relaxed text-muted-foreground">{f.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* CTA finale */}
        <section className="relative overflow-hidden bg-primary py-24 text-primary-foreground md:py-32">
          <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
          <div className="container relative text-center">
            <h2 className="reveal mx-auto max-w-3xl text-4xl font-extralight leading-tight md:text-6xl">
              Quanto vale <span className="font-bold">la tua casa?</span>
            </h2>
            <p className="reveal mx-auto mt-6 max-w-xl text-lg text-white/85" style={{ ["--d" as string]: "100ms" }}>
              Valutazione gratuita e senza impegno, basata sulle vendite reali della tua zona.
            </p>
            <div className="reveal mt-10" style={{ ["--d" as string]: "200ms" }}>
              <Link
                to="/vendicasa#form-section"
                onClick={() => trackCtaClick("home_cta_finale")}
                className="group inline-flex items-center gap-3 rounded-full bg-white px-10 py-5 text-sm font-bold uppercase tracking-wider text-primary transition-all hover:gap-5"
              >
                Richiedi la valutazione <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Home;
