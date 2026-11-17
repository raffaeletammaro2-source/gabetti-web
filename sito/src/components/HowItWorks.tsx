import { ClipboardList, Search, FileCheck, MessageSquare } from "lucide-react";

const steps = [
  {
    icon: ClipboardList,
    title: "1. Compili il modulo",
    desc: "Inserisci tipologia, metri quadri, stato e zona del tuo immobile. Bastano 90 secondi.",
  },
  {
    icon: Search,
    title: "2. Analizziamo i comparabili",
    desc: "Un consulente Gabetti della tua zona analizza i prezzi reali di vendita degli ultimi 6 mesi nel tuo quartiere.",
  },
  {
    icon: FileCheck,
    title: "3. Ricevi la valutazione",
    desc: "Il consulente ti presenta la valutazione professionale del tuo immobile, con range di prezzo minimo e massimo.",
  },
  {
    icon: MessageSquare,
    title: "4. Decidi tu",
    desc: "Leggi con calma e, se vuoi, fissi un sopralluogo gratuito. Nessuna pressione, nessun obbligo.",
  },
];

const HowItWorks = () => (
  <section id="come-funziona" className="bg-background py-10 md:py-14">
    <div className="container max-w-5xl">
      <h2 className="text-2xl md:text-4xl font-extrabold text-center mb-3">
        Come funziona la valutazione gratuita della tua casa
      </h2>
      <p className="text-center text-muted-foreground mb-10 max-w-2xl mx-auto">
        Un processo semplice, professionale e senza impegno per scoprire il valore reale del tuo immobile a Napoli nord.
      </p>
      <ol className="grid md:grid-cols-4 gap-5">
        {steps.map(({ icon: Icon, title, desc }) => (
          <li key={title} className="bg-card border border-border rounded-xl p-5 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-3">
              <Icon className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-bold text-base mb-2">{title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
          </li>
        ))}
      </ol>
    </div>
  </section>
);

export default HowItWorks;
