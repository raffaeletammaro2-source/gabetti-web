import { Home, BarChart3, Handshake } from "lucide-react";

const items = [
  { icon: Home, title: "Conoscenza locale profonda", desc: "5 agenzie sul territorio, consulenti che vivono e lavorano nelle tue zone da anni." },
  { icon: BarChart3, title: "Valutazioni basate su dati reali", desc: "Non stime di portali online, ma prezzi effettivi di vendita degli ultimi 6 mesi." },
  { icon: Handshake, title: "Zero pressione, massima trasparenza", desc: "Ricevi il report e decidi tu se proseguire. Nessuna chiamata insistente." },
];

const WhyGabetti = () => (
  <section className="bg-muted md:py-14 py-[50px] my-0">
    <div className="container">
      <h2 className="text-2xl md:text-4xl font-extrabold text-center mb-10">Perché oltre 500 famiglie ci hanno scelto</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {items.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="bg-card rounded-xl p-6 text-center shadow-sm">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-4">
              <Icon className="w-7 h-7 text-primary" />
            </div>
            <h3 className="font-bold text-lg mb-2">{title}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default WhyGabetti;
