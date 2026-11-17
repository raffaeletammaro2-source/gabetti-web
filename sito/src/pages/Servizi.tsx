import { Link } from "react-router-dom";
import { TrendingUp, KeyRound, Search, Landmark, ShieldCheck, Zap, Building2, FileCheck, MapPin, ArrowRight, Check } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SeoHead from "@/components/SeoHead";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { trackCtaClick } from "@/lib/tracking";

const towns = ["Marano di Napoli", "Mugnano di Napoli", "Villaricca-Qualiano", "Giugliano in Campania", "Frattamaggiore"];

const services = [
  {
    letter: "V", label: "come Vendita", icon: TrendingUp, title: "Vendere casa a Napoli Nord con il metodo Gabetti",
    text: "Ti seguiamo dalla valutazione al rogito per vendere al giusto prezzo e in tempi certi.",
    points: [
      "Analisi di vendibilità basata sui prezzi reali di vendita della tua zona",
      "Promozione gratuita su sito Gabetti, portali immobiliari e social",
      "Selezione degli acquirenti e proposte con caparra su modulistica conforme",
      "Report periodici su visite, interesse e andamento della trattativa",
    ],
  },
  {
    letter: "A", label: "come Acquisto", icon: Search, title: "Comprare casa al prezzo giusto",
    text: "Ti aiutiamo a trovare la casa adatta a te tra usato e nuove costruzioni, con verifiche prima di firmare.",
    points: [
      "Ricerca mirata per zona, budget e tipologia",
      "Controllo di conformità urbanistica e catastale",
      "Assistenza nella proposta d'acquisto e nella trattativa",
      "Accompagnamento fino al notaio",
    ],
  },
  {
    letter: "A", label: "come Affitto", icon: KeyRound, title: "Affittare casa in sicurezza",
    text: "Per proprietari e inquilini: condizioni chiare, contratti corretti e meno rischi.",
    points: [
      "Prequalifica degli inquilini con colloquio e verifiche",
      "Contratti a canone libero, concordato e transitorio",
      "Polizze contro morosità e danni all'immobile",
      "Verifica della congruità di canone e spese per chi cerca casa",
    ],
  },
  {
    letter: "M", label: "come Mutuo", icon: Landmark, title: "Mutui e finanziamenti con Monety",
    text: "Grazie ai consulenti del credito Monety, società del Gruppo Gabetti, confrontiamo le offerte dei principali istituti.",
    points: [
      "Mutui per acquisto, ristrutturazione, surroga o liquidità",
      "Prestiti personali e cessione del quinto",
      "Consulenza dedicata fino alla stipula",
    ],
  },
  {
    letter: "A", label: "come Assicurazione", icon: ShieldCheck, title: "Assicurazioni per la casa con AssicuraRE",
    text: "Ti guidiamo nella scelta della polizza più adatta per proteggere il tuo patrimonio immobiliare e la tua famiglia.",
    points: ["Polizze casa e responsabilità civile", "Tutela per proprietari che affittano"],
  },
  {
    letter: "L/G", label: "come Luce e Gas", icon: Zap, title: "Attivazione utenze con Moon",
    text: "Nella nuova casa pensiamo noi all'attivazione di luce e gas. Senza costi e senza sorprese.",
    points: ["Voltura e nuove attivazioni", "Un solo referente per le pratiche"],
  },
  {
    letter: "N", label: "come Nuove Costruzioni", icon: Building2, title: "Cantieri e nuove costruzioni",
    text: "Commercializziamo appartamenti di nuova costruzione ad alta efficienza energetica nell'area nord di Napoli.",
    points: ["Vendita su progetto e capitolati", "Supporto a costruttori e investitori"], link: "/nuove-costruzioni",
  },
  {
    letter: "C", label: "come Consulenza tecnica", icon: FileCheck, title: "Pratiche tecniche e documenti",
    text: "Con tecnici di fiducia verifichiamo che l'immobile sia in regola prima della vendita.",
    points: ["APE e certificazione energetica", "Planimetrie, visure e conformità edilizia", "Coordinamento con il notaio"],
  },
];

const faqs = [
  { q: "Quali servizi immobiliari offre Gabetti a Napoli Nord?", a: "Le agenzie Gabetti di Marano, Mugnano, Villaricca-Qualiano, Frattamaggiore e Giugliano offrono valutazione gratuita, vendita, acquisto, affitto, consulenza mutui, assicurazioni, attivazione utenze, nuove costruzioni e pratiche tecniche." },
  { q: "Quanto costa la valutazione della casa?", a: "La valutazione è gratuita e senza impegno. Si basa sui prezzi reali di vendita degli ultimi 6 mesi nella tua zona." },
  { q: "Gabetti aiuta anche a ottenere il mutuo?", a: "Sì. Tramite Monety, la società di mediazione creditizia del Gruppo Gabetti, confrontiamo le offerte delle principali banche e ti seguiamo fino alla stipula." },
  { q: "Gestite anche gli affitti?", a: "Sì, assistiamo sia i proprietari sia chi cerca casa in affitto: selezione degli inquilini, contratti e polizze contro la morosità." },
  { q: "In quali comuni operate?", a: "Operiamo nell'area nord di Napoli: Marano di Napoli, Mugnano di Napoli, Villaricca, Qualiano, Giugliano in Campania, Frattamaggiore e comuni limitrofi." },
];

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: "Gabetti Franchising - Gruppo ADG",
    url: "https://gabetti-adg.it/servizi",
    areaServed: towns.map((t) => ({ "@type": "City", name: t })),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Servizi immobiliari",
      itemListElement: services.map((s) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name: s.title, description: s.text } })),
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  },
];

const Servizi = () => (
  <>
    <SeoHead
      title="Servizi Immobiliari Napoli Nord | Vendita, Affitto, Mutui | Gabetti"
      description="Vendita, acquisto, affitto, mutui, assicurazioni e nuove costruzioni a Marano, Mugnano, Villaricca, Qualiano, Giugliano e Frattamaggiore. Un solo referente: Gabetti."
      canonical="/servizi"
      jsonLd={jsonLd}
    />
    <Header />
    <main>
      <section className="bg-muted py-14 md:py-20">
        <div className="container max-w-4xl text-center">
          <p className="text-primary font-bold uppercase tracking-wide text-sm mb-3">I servizi</p>
          <h1 className="text-3xl md:text-5xl font-extrabold text-foreground mb-5">
            Servizi Immobiliari nell'area Nord di Napoli
          </h1>
          <p className="text-lg text-muted-foreground">
            Il Gruppo Gabetti è l'unico Full Service Provider del settore immobiliare in Italia. Con le nostre 5 agenzie
            nell'area nord di Napoli ti seguiamo in ogni fase: vendita, acquisto, affitto, mutuo, assicurazione e utenze,
            con un solo referente.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {towns.map((t) => (
              <span key={t} className="inline-flex items-center gap-1 rounded-full border border-border bg-background px-3 py-1 text-sm text-foreground">
                <MapPin className="w-4 h-4 text-primary" aria-hidden /> {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-background py-14 md:py-20">
        <div className="container">
          <h2 className="text-2xl md:text-4xl font-extrabold text-foreground text-center mb-10">
            Tutti i servizi per vendere, comprare e vivere la tua casa
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            {services.map(({ letter, label, icon: Icon, title, text, points, link }) => (
              <article key={title} className="rounded-lg border border-border bg-card p-6 flex flex-col">
                <div className="flex items-center gap-3 mb-4">
                  <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground text-xl font-extrabold">{letter}</span>
                  <span className="text-sm font-bold uppercase tracking-wide text-primary">{label}</span>
                  <Icon className="ml-auto w-6 h-6 text-primary" aria-hidden />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">{title}</h3>
                <p className="text-muted-foreground mb-4 leading-relaxed">{text}</p>
                <ul className="space-y-2 mb-4">
                  {points.map((p) => (
                    <li key={p} className="flex gap-2 text-foreground">
                      <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" aria-hidden /> <span>{p}</span>
                    </li>
                  ))}
                </ul>
                {link && (
                  <Link to={link} className="mt-auto inline-flex items-center gap-1 font-bold text-primary hover:underline">
                    Scopri i cantieri <ArrowRight className="w-4 h-4" />
                  </Link>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-muted py-14 md:py-20">
        <div className="container max-w-3xl">
          <h2 className="text-2xl md:text-4xl font-extrabold text-foreground text-center mb-8">Domande frequenti sui nostri servizi</h2>
          <Accordion type="single" collapsible className="bg-background rounded-lg border border-border px-4">
            {faqs.map((f, i) => (
              <AccordionItem key={f.q} value={`f${i}`}>
                <AccordionTrigger className="text-left font-bold">{f.q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <section className="bg-primary py-14 text-center">
        <div className="container max-w-3xl">
          <h2 className="text-2xl md:text-4xl font-extrabold text-primary-foreground mb-4">Vuoi sapere quanto vale la tua casa?</h2>
          <p className="text-primary-foreground/90 mb-6">Valutazione gratuita, basata sui prezzi reali della tua zona.</p>
          <Link
            to="/#form-section"
            onClick={() => trackCtaClick("servizi_cta")}
            className="inline-flex items-center gap-2 bg-background text-primary font-bold py-4 px-8 rounded-lg hover:opacity-90"
          >
            RICHIEDI LA VALUTAZIONE GRATUITA <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </main>
    <Footer />
  </>
);

export default Servizi;
