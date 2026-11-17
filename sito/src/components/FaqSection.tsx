import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export const faqs = [
  {
    q: "Quanto vale la mia casa a Napoli e provincia nord?",
    a: "Il valore di una casa nell'area nord di Napoli (Marano, Mugnano, Giugliano, Villaricca, Qualiano, Frattamaggiore) dipende da metratura, stato di conservazione, piano, esposizione e zona. I prezzi medi 2026 oscillano tra 1.200 e 2.400 €/m². Per una stima precisa basata sui prezzi reali di vendita degli ultimi 6 mesi, compila il modulo e richiedi la valutazione gratuita.",
  },
  {
    q: "La valutazione immobiliare è davvero gratuita?",
    a: "Sì, al 100%. Non avrai alcun costo né alcun obbligo di affidarci la vendita. Il nostro obiettivo è darti un'informazione professionale utile per le tue decisioni.",
  },
  {
    q: "Come capire quanto vale una casa?",
    a: "Il valore di mercato di un immobile si determina confrontando la tua casa con vendite reali recenti di immobili simili nella stessa zona (metodo dei comparabili), considerando metri quadri, stato manutentivo, classe energetica, piano, esposizione, presenza di ascensore, balconi e pertinenze. I portali online danno solo stime statistiche: la valutazione professionale di un consulente locale è molto più accurata.",
  },
  {
    q: "Quali documenti servono per vendere casa?",
    a: "I documenti principali sono: atto di provenienza, planimetria catastale, visura catastale, Attestato di Prestazione Energetica (APE), certificato di agibilità, regolarità urbanistica e, per i condomini, regolamento condominiale e ultime spese. Il nostro consulente Gabetti ti guida nel reperire e verificare ogni documento.",
  },
  {
    q: "Quanto tempo serve per vendere casa nel napoletano?",
    a: "Nell'area nord di Napoli i tempi medi di vendita sono 4-6 mesi. Con un prezzo correttamente posizionato, una buona promozione fotografica e un'agenzia con database di acquirenti profilati, i tempi scendono a 2-3 mesi. La nostra media è 90 giorni dall'incarico al rogito.",
  },
  {
    q: "Sarò obbligato a darvi l'incarico di vendita?",
    a: "Assolutamente no. Riceverai la valutazione e deciderai con calma. Solo se vorrai approfondire, un nostro consulente sarà a tua disposizione, senza pressioni.",
  },
  {
    q: "Come fate la valutazione senza vedere la casa?",
    a: "La prima valutazione si basa sui dati che ci fornisci nel modulo (zona, metratura, tipologia, stato) e sui comparabili reali raccolti dai nostri consulenti negli ultimi 6 mesi. Per una stima ancora più precisa organizziamo un sopralluogo gratuito.",
  },
  {
    q: "Quanto costa una valutazione immobiliare professionale?",
    a: "La valutazione di mercato fornita da Gabetti Franchising è completamente gratuita. Una perizia giurata di un tecnico abilitato (per cause, successioni o mutui) costa invece tipicamente tra 250 e 600 € a seconda della complessità.",
  },
  {
    q: "Come aumentare il valore della mia casa prima di venderla?",
    a: "Gli interventi con miglior ritorno sono: home staging e tinteggiatura (spesa minima, +3-5% sul prezzo), miglioramento della classe energetica con infissi e caldaia (+5-8%), rinnovamento del bagno e della cucina (+5-10%). Il nostro consulente ti indica gratuitamente quali interventi conviene fare nella tua zona.",
  },
  {
    q: "Come trattate i miei dati personali?",
    a: "I tuoi dati sono trattati nel pieno rispetto del GDPR (Reg. UE 2016/679). Non saranno mai ceduti a terzi e li usiamo esclusivamente per inviarti la valutazione richiesta e per il follow-up commerciale autorizzato.",
  },
];

const FaqSection = () => (
  <section id="faq" className="bg-background py-10 md:py-14">
    <div className="container max-w-3xl">
      <h2 className="text-2xl md:text-4xl font-extrabold text-center mb-3">Domande frequenti sulla valutazione casa</h2>
      <p className="text-center text-muted-foreground mb-10">Risposte chiare alle domande più comuni di chi vuole vendere casa a Napoli nord.</p>
      <Accordion type="single" collapsible className="space-y-2">
        {faqs.map((f, i) => (
          <AccordionItem key={i} value={`faq-${i}`} className="border rounded-lg px-4">
            <AccordionTrigger className="text-left text-sm md:text-base font-semibold hover:no-underline">{f.q}</AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground leading-relaxed">{f.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  </section>
);

export default FaqSection;
