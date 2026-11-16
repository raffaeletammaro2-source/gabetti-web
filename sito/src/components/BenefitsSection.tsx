import { CheckCircle2 } from "lucide-react";

const items = [
  "Valutazione professionale del tuo immobile basata su comparabili reali della tua zona",
  "Report di mercato aggiornato del tuo comune con i prezzi degli ultimi 6 mesi",
  "Sopralluogo e consulenza gratuita con un consulente Gabetti della tua zona",
  "Analisi e ricerca nei nostri database di potenziali acquirenti che cercano esattamente una soluzione come la tua.",
];

const BenefitsSection = () => (
  <section className="bg-background py-10 md:py-14">
    <div className="container max-w-2xl">
      <h2 className="text-2xl md:text-4xl font-extrabold text-center mb-10">Cosa ricevi compilando il modulo</h2>
      <ol className="space-y-5">
        {items.map((item, i) => (
          <li key={i} className="flex gap-4 items-start">
            <CheckCircle2 className="w-7 h-7 text-green-600 shrink-0 mt-0.5" />
            <span className="text-base leading-relaxed">{item}</span>
          </li>
        ))}
      </ol>
    </div>
  </section>
);

export default BenefitsSection;
