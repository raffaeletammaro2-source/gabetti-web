import { Link, useParams } from "react-router-dom";
import { MapPin, TrendingUp, Clock, Euro, CheckCircle2, ChevronRight } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MultiStepForm from "@/components/MultiStepForm";
import TestimonialsSection from "@/components/TestimonialsSection";
import StickyMobileCta from "@/components/StickyMobileCta";
import SeoHead from "@/components/SeoHead";
import NotFound from "./NotFound";
import { getCity } from "@/data/cities";
import {
  organizationSchema,
  buildFaqSchema,
  buildBreadcrumbSchema,
  SITE_URL,
} from "@/lib/seoSchemas";

const LocalLanding = () => {
  const { slug = "" } = useParams();
  const city = getCity(slug);
  if (!city) return <NotFound />;

  const url = `/${city.slug}`;
  const title = `Valutazione Casa ${city.name} Gratuita in 24h | Gabetti`;
  const description = `Quanto vale la tua casa a ${city.name}? Valutazione immobiliare gratuita e professionale in 24 ore con ${city.agency}. Prezzi reali ${city.priceMin}-${city.priceMax} €/m². Senza impegno.`;

  const realEstateLocal = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: city.agency,
    url: `${SITE_URL}${url}`,
    areaServed: { "@type": "City", name: city.name, addressRegion: city.province },
    priceRange: `€${city.priceMin}-${city.priceMax} /m²`,
    parentOrganization: { "@id": `${SITE_URL}/#organization` },
  };

  return (
    <>
      <SeoHead
        title={title}
        description={description}
        canonical={url}
        jsonLd={[
          organizationSchema,
          realEstateLocal,
          buildFaqSchema(city.faqs),
          buildBreadcrumbSchema([
            { name: "Home", url: "/" },
            { name: `Valutazione casa ${city.name}`, url },
          ]),
        ]}
      />
      <Header />
      <main>
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="container py-3 text-xs text-muted-foreground">
          <ol className="flex items-center gap-1.5 flex-wrap">
            <li><Link to="/" className="hover:underline">Home</Link></li>
            <ChevronRight className="w-3 h-3" />
            <li className="text-foreground font-medium">Valutazione casa {city.name}</li>
          </ol>
        </nav>

        {/* Hero */}
        <section id="form-section" className="bg-background py-6 md:py-12">
          <div className="container grid md:grid-cols-2 gap-8 md:gap-12 items-start">
            <div>
              <span className="inline-flex items-center gap-1.5 bg-primary/10 text-primary text-xs font-bold uppercase tracking-wide px-3 py-1.5 rounded-full mb-4">
                <MapPin className="w-3.5 h-3.5" /> {city.name} ({city.province})
              </span>
              <h1 className="text-[2rem] leading-tight md:text-[3rem] md:leading-[1.1] font-extrabold mb-4">
                Valutazione casa <span className="text-primary">{city.name}</span> gratuita in 24h
              </h1>
              <p className="text-base md:text-lg text-muted-foreground mb-6 leading-relaxed">{city.intro}</p>
              <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="bg-muted rounded-lg p-3 text-center">
                  <Euro className="w-5 h-5 text-primary mx-auto mb-1" />
                  <p className="text-[11px] text-muted-foreground uppercase tracking-wide">Prezzo</p>
                  <p className="font-bold text-sm">{city.priceMin.toLocaleString("it-IT")}–{city.priceMax.toLocaleString("it-IT")} €/m²</p>
                </div>
                <div className="bg-muted rounded-lg p-3 text-center">
                  <Clock className="w-5 h-5 text-primary mx-auto mb-1" />
                  <p className="text-[11px] text-muted-foreground uppercase tracking-wide">Tempi medi</p>
                  <p className="font-bold text-sm">~{city.avgDays} giorni</p>
                </div>
                <div className="bg-muted rounded-lg p-3 text-center">
                  <TrendingUp className="w-5 h-5 text-primary mx-auto mb-1" />
                  <p className="text-[11px] text-muted-foreground uppercase tracking-wide">Trend 2026</p>
                  <p className="font-bold text-sm">In crescita</p>
                </div>
              </div>
            </div>
            <div>
              <MultiStepForm />
            </div>
          </div>
        </section>

        {/* Mercato locale */}
        <section className="bg-muted md:py-14 py-[50px] my-0">
          <div className="container max-w-4xl">
            <h2 className="text-2xl md:text-4xl font-extrabold text-center mb-3">
              Mercato immobiliare a {city.name} nel 2026
            </h2>
            <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">{city.marketDescription}</p>
            <div className="grid md:grid-cols-2 gap-6">
              <article className="bg-card rounded-xl p-6 border border-border">
                <h3 className="font-bold text-lg mb-3">Quotazioni indicative {city.name}</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex justify-between"><span className="text-muted-foreground">Da ristrutturare</span><span className="font-bold">{city.priceMin.toLocaleString("it-IT")} €/m²</span></li>
                  <li className="flex justify-between"><span className="text-muted-foreground">Buono stato</span><span className="font-bold">{Math.round((city.priceMin + city.priceMax) / 2).toLocaleString("it-IT")} €/m²</span></li>
                  <li className="flex justify-between"><span className="text-muted-foreground">Ristrutturato / nuovo</span><span className="font-bold">{city.priceMax.toLocaleString("it-IT")} €/m²</span></li>
                  <li className="flex justify-between pt-2 border-t border-border mt-2"><span className="text-muted-foreground">Tempo medio vendita</span><span className="font-bold">~{city.avgDays} giorni</span></li>
                </ul>
                <p className="text-xs text-muted-foreground mt-4">Dati indicativi 2026. Per una stima precisa richiedi la valutazione gratuita.</p>
              </article>
              <article className="bg-card rounded-xl p-6 border border-border">
                <h3 className="font-bold text-lg mb-3">Perché vendere casa a {city.name}</h3>
                <ul className="space-y-2.5">
                  {city.advantages.map((adv) => (
                    <li key={adv} className="flex gap-2 text-sm"><CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" /><span>{adv}</span></li>
                  ))}
                </ul>
                {city.neighborhoods.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wide font-semibold">Zone coperte</p>
                    <div className="flex flex-wrap gap-1.5">
                      {city.neighborhoods.map((n) => (
                        <span key={n} className="text-xs bg-muted px-2 py-1 rounded-full">{n}</span>
                      ))}
                    </div>
                  </div>
                )}
              </article>
            </div>
          </div>
        </section>

        <TestimonialsSection />

        {/* FAQ locali */}
        <section className="bg-background py-10 md:py-14">
          <div className="container max-w-3xl">
            <h2 className="text-2xl md:text-4xl font-extrabold text-center mb-10">
              Domande frequenti su {city.name}
            </h2>
            <Accordion type="single" collapsible className="space-y-2">
              {city.faqs.map((f, i) => (
                <AccordionItem key={i} value={`faq-${i}`} className="border rounded-lg px-4">
                  <AccordionTrigger className="text-left text-sm md:text-base font-semibold hover:no-underline">{f.q}</AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground leading-relaxed">{f.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* Final CTA */}
        <section className="bg-primary py-10 md:py-14">
          <div className="container text-center">
            <h2 className="text-2xl md:text-4xl font-extrabold text-primary-foreground mb-4">
              Pronto a scoprire quanto vale la tua casa a {city.name}?
            </h2>
            <p className="text-primary-foreground/80 mb-8 text-lg">Valutazione gratuita, professionale e senza impegno.</p>
            <a
              href="#form-section"
              onClick={(e) => { e.preventDefault(); document.getElementById("form-section")?.scrollIntoView({ behavior: "smooth" }); }}
              className="inline-block bg-primary-foreground text-primary font-bold py-4 px-8 rounded-lg text-base hover:opacity-90 transition-opacity"
            >
              Richiedi valutazione gratuita
            </a>
          </div>
        </section>
      </main>
      <Footer />
      <StickyMobileCta />
    </>
  );
};

export default LocalLanding;
