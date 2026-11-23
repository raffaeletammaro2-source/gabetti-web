import { Building2, Leaf, MapPin, Handshake, Zap, Wrench, Home, TrendingUp, ArrowRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SeoHead from "@/components/SeoHead";
import { trackCtaClick } from "@/lib/tracking";

const highlights = [
  { icon: Building2, title: "Tipologie per ogni esigenza", text: "Trilocali, quadrilocali, attici e ville a schiera." },
  { icon: Leaf, title: "Tecnologia e sostenibilità", text: "Impianti evoluti, serramenti performanti, predisposizioni per clima, antifurto e domotica." },
  { icon: MapPin, title: "Quartieri serviti e collegati", text: "Vicino all'Asse Mediano, a servizi, scuole e shopping." },
  { icon: Handshake, title: "Assistenza completa", text: "Consulenza su mutuo, capitolato e pratiche, con la sicurezza del marchio Gabetti." },
];

const reasons = [
  { icon: Zap, text: "Classe energetica alta, quindi risparmio sui consumi" },
  { icon: Wrench, text: "Zero lavori e garanzie sugli impianti" },
  { icon: Home, text: "Spazi pensati per vivere: zona giorno ampia e spazi esterni" },
  { icon: TrendingUp, text: "Valore nel tempo, ideale anche come investimento" },
];

const sites = [
  { label: "Via Pietro Nenni - Mugnano (NA)", href: "/cantieri/via-pietro-nenni-mugnano/" },
  { label: "Via IV Martiri - Mugnano (NA)", href: "/cantieri/via-iv-martiri-mugnano/" },
];

const NuoveCostruzioni = () => (
  <>
    <SeoHead
      title="Nuove Costruzioni Napoli Nord | Cantieri a Mugnano | Gabetti"
      description="Appartamenti di nuova costruzione nell'Area Nord di Napoli: cantieri a Mugnano in Via Pietro Nenni e Via IV Martiri. Alta efficienza energetica e assistenza Gabetti."
      canonical="/nuove-costruzioni"
    />
    <Header />
    <main>
      <section className="bg-muted py-14 md:py-20">
        <div className="container max-w-4xl text-center">
          <p className="text-primary font-bold uppercase tracking-wide text-sm mb-3">Nuove Costruzioni</p>
          <h1 className="text-3xl md:text-5xl font-extrabold text-foreground mb-5">
            Nuove costruzioni nell'Area Nord di Napoli: appartamenti e ville in vendita
          </h1>
          <p className="text-lg text-muted-foreground">
            Case di nuova costruzione a Mugnano, Marano, Calvizzano, Villaricca, Qualiano, Giugliano e Frattamaggiore.
            Soluzioni moderne ad alta efficienza energetica, in posizioni strategiche, con l'assistenza Gabetti dal primo sopralluogo al rogito.
          </p>
          <a href="#cantieri" className="mt-8 inline-flex items-center gap-2 bg-primary text-primary-foreground font-bold py-4 px-8 rounded-lg hover:opacity-90">
            Scopri i cantieri <ArrowRight className="w-5 h-5" />
          </a>
        </div>
      </section>

      <section className="bg-background py-14">
        <div className="container grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {highlights.map(({ icon: Icon, title, text }) => (
            <article key={title} className="rounded-lg border border-border bg-card p-6">
              <Icon className="w-8 h-8 text-primary mb-3" aria-hidden />
              <h2 className="text-lg font-bold text-foreground mb-2">{title}</h2>
              <p className="text-muted-foreground leading-relaxed">{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-muted py-14">
        <div className="container max-w-3xl">
          <h2 className="text-2xl md:text-3xl font-extrabold text-foreground mb-6 text-center">Perché scegliere una nuova costruzione</h2>
          <ul className="grid gap-4 sm:grid-cols-2">
            {reasons.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-start gap-3 bg-card rounded-lg p-4 border border-border">
                <Icon className="w-6 h-6 text-primary shrink-0" aria-hidden />
                <span className="text-foreground">{text}</span>
              </li>
            ))}
          </ul>
          <blockquote className="mt-10 text-center italic text-lg text-muted-foreground">
            “Costruire non è solo dare forma a uno spazio, ma creare il luogo dove il futuro inizia ogni giorno.”
          </blockquote>
        </div>
      </section>

      <section id="cantieri" className="bg-background py-14 scroll-mt-4">
        <div className="container max-w-3xl text-center">
          <h2 className="text-2xl md:text-3xl font-extrabold text-foreground mb-3">I nostri cantieri a Mugnano</h2>
          <p className="text-muted-foreground mb-8">
            Vuoi visitare un cantiere o ricevere il capitolato? Scegli il progetto e scopri tutti i dettagli.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            {sites.map((s) => {
              const external = s.href.startsWith("http");
              return (
                <a
                  key={s.label}
                  href={s.href}
                  {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  onClick={() => trackCtaClick(s.label)}
                  className="flex items-center justify-center gap-2 bg-primary text-primary-foreground font-bold py-5 px-6 rounded-lg hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  <MapPin className="w-5 h-5 shrink-0" aria-hidden />
                  {s.label}
                </a>
              );
            })}
          </div>
        </div>
      </section>

      <section id="contatti" className="bg-primary py-12 scroll-mt-4">
        <div className="container text-center text-primary-foreground">
          <h2 className="text-2xl md:text-3xl font-extrabold mb-3">Vuoi maggiori informazioni?</h2>
          <p className="mb-6 opacity-90">Lascia i tuoi dati: un consulente Gabetti ti ricontatta entro poche ore.</p>
          <a href="/vendicasa#form-section" onClick={() => trackCtaClick("Info nuove costruzioni")} className="inline-block bg-primary-foreground text-primary font-bold py-4 px-8 rounded-lg hover:opacity-90">
            Contattaci
          </a>
        </div>
      </section>
    </main>
    <Footer />
  </>
);

export default NuoveCostruzioni;
