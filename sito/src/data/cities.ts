// Dataset for local SEO landing pages — Napoli nord.
// Prices and average days are realistic 2026 ranges; refine with real CRM data when available.

export interface LocalCity {
  slug: string;
  name: string;
  province: string;
  agency: string;
  intro: string;
  marketDescription: string;
  priceMin: number; // €/m²
  priceMax: number;
  avgDays: number; // tempo medio vendita
  neighborhoods: string[];
  advantages: string[];
  faqs: { q: string; a: string }[];
}

export const cities: LocalCity[] = [
  {
    slug: "valutazione-casa-marano-di-napoli",
    name: "Marano di Napoli",
    province: "NA",
    agency: "Gabetti Marano",
    intro:
      "Vivi a Marano di Napoli e vuoi sapere quanto vale la tua casa? L'agenzia Gabetti Marano offre una valutazione gratuita e professionale del tuo immobile, basata sui prezzi reali di vendita degli ultimi 6 mesi nel comune e nei quartieri limitrofi.",
    marketDescription:
      "Il mercato immobiliare di Marano di Napoli nel 2026 mostra una buona stabilità, con una domanda costante per appartamenti familiari di 80-110 m² nelle zone centrali e ben servite. Le compravendite sono in lieve crescita rispetto al 2025, soprattutto per immobili ristrutturati o di nuova costruzione.",
    priceMin: 1300,
    priceMax: 2200,
    avgDays: 110,
    neighborhoods: ["Centro", "San Marco", "Vallesana", "Castello Belvedere", "Vallessana", "Torre Caracciolo"],
    advantages: [
      "Buoni collegamenti con Napoli centro tramite Circumflegrea",
      "Servizi completi: scuole, ospedali, supermercati e parchi",
      "Domanda forte per appartamenti familiari di 90-110 m²",
    ],
    faqs: [
      { q: "Quanto vale una casa a Marano di Napoli nel 2026?", a: "I prezzi medi a Marano oscillano tra 1.300 e 2.200 €/m² nel 2026. Un appartamento di 90 m² in buono stato vale tipicamente 130.000-180.000 €. Per una valutazione precisa basata sulla tua zona e sullo stato dell'immobile, richiedi il report gratuito." },
      { q: "Quanto tempo serve per vendere casa a Marano?", a: "Il tempo medio di vendita a Marano di Napoli è di circa 110 giorni con un prezzo correttamente posizionato. Con la nostra agenzia e un buon portafoglio acquirenti, scendiamo spesso a 70-90 giorni." },
      { q: "Quali zone di Marano sono più richieste?", a: "Le zone più richieste sono il centro, San Marco e Castello Belvedere per la qualità dei servizi e i collegamenti. Vallesana e Torre Caracciolo sono apprezzate per il rapporto qualità-prezzo." },
    ],
  },
  {
    slug: "valutazione-casa-mugnano-di-napoli",
    name: "Mugnano di Napoli",
    province: "NA",
    agency: "Gabetti Mugnano",
    intro:
      "Vendere casa a Mugnano di Napoli al prezzo giusto richiede una conoscenza profonda del territorio. L'agenzia Gabetti Mugnano valuta gratuitamente il tuo immobile a Mugnano, Melito e Chiaiano, con dati reali e senza impegno.",
    marketDescription:
      "Mugnano di Napoli vive nel 2026 una fase di mercato dinamica grazie alla sua posizione strategica vicino a Napoli e alla presenza della Tangenziale. Forte domanda per trilocali e quadrilocali in palazzine moderne.",
    priceMin: 1500,
    priceMax: 2400,
    avgDays: 95,
    neighborhoods: ["Centro", "Parco delle Acacie", "Via Napoli", "Zona Tangenziale", "Melito"],
    advantages: [
      "Accesso diretto alla Tangenziale di Napoli",
      "Centri commerciali e servizi di qualità",
      "Quartieri moderni con palazzine recenti",
    ],
    faqs: [
      { q: "Quanto vale una casa a Mugnano di Napoli?", a: "I prezzi a Mugnano nel 2026 si collocano tra 1.500 e 2.400 €/m². Un trilocale di 80 m² in buono stato vale mediamente 140.000-180.000 €." },
      { q: "Mugnano è una zona in crescita per vendere casa?", a: "Sì, Mugnano registra una domanda stabile e in lieve crescita, in particolare per immobili recenti vicino alla Tangenziale e ai principali servizi commerciali." },
      { q: "Coprite anche Melito e Chiaiano?", a: "Sì, l'agenzia Gabetti Mugnano serve anche Melito di Napoli, Chiaiano e i quartieri limitrofi del nord di Napoli." },
    ],
  },
  {
    slug: "valutazione-casa-giugliano-in-campania",
    name: "Giugliano in Campania",
    province: "NA",
    agency: "Gabetti Giugliano",
    intro:
      "Giugliano in Campania è il terzo comune della Campania per popolazione e uno dei mercati immobiliari più attivi dell'area nord di Napoli. Richiedi la valutazione gratuita della tua casa con Gabetti Giugliano, con dati reali e senza impegno.",
    marketDescription:
      "Il mercato immobiliare di Giugliano nel 2026 è particolarmente vivace, con un'ampia offerta che spazia da appartamenti in centro a ville indipendenti nelle frazioni costiere di Lago Patria e Varcaturo. Domanda alta da parte di famiglie e investitori.",
    priceMin: 1200,
    priceMax: 2300,
    avgDays: 100,
    neighborhoods: ["Centro storico", "Lago Patria", "Varcaturo", "Licola", "Via Madonna del Pantano", "Sant'Antimo"],
    advantages: [
      "Mercato immobiliare ampio con tipologie per ogni esigenza",
      "Vicinanza al mare nelle frazioni di Varcaturo e Licola",
      "Forte domanda da famiglie e prima casa",
    ],
    faqs: [
      { q: "Quanto vale una casa a Giugliano in Campania nel 2026?", a: "I prezzi a Giugliano variano molto per zona: dal centro (1.500-2.300 €/m²) alle frazioni costiere (1.200-1.800 €/m²). Un appartamento di 90 m² in zona centrale vale mediamente 140.000-200.000 €." },
      { q: "È il momento giusto per vendere casa a Giugliano?", a: "Sì, la domanda nel 2026 è solida e i tempi medi di vendita sono di circa 100 giorni con un prezzo correttamente posizionato sul mercato." },
      { q: "Vendete anche immobili a Lago Patria e Varcaturo?", a: "Assolutamente sì. Le frazioni costiere di Lago Patria, Varcaturo e Licola sono nel nostro raggio d'azione e tra le più richieste, soprattutto per seconde case e investimenti." },
    ],
  },
  {
    slug: "valutazione-casa-villaricca",
    name: "Villaricca",
    province: "NA",
    agency: "Gabetti Villaricca - Qualiano",
    intro:
      "L'agenzia Gabetti Villaricca - Qualiano valuta gratuitamente la tua casa a Villaricca con un'analisi professionale dei prezzi reali di mercato, senza impegno.",
    marketDescription:
      "Villaricca nel 2026 è un mercato stabile con prezzi accessibili e buona qualità della vita. Forte richiesta per appartamenti di 80-100 m² in palazzine recenti e per ville bifamiliari nelle zone residenziali.",
    priceMin: 1300,
    priceMax: 2100,
    avgDays: 105,
    neighborhoods: ["Centro", "Corso Italia", "Parco San Francesco", "Zona Cesarano"],
    advantages: [
      "Prezzi competitivi rispetto ai comuni limitrofi",
      "Quartieri tranquilli ideali per famiglie",
      "Buoni collegamenti con Napoli e i centri commerciali",
    ],
    faqs: [
      { q: "Quanto vale un appartamento a Villaricca?", a: "I prezzi a Villaricca nel 2026 vanno da 1.300 a 2.100 €/m². Un appartamento di 90 m² in buono stato vale mediamente 130.000-170.000 €." },
      { q: "Quali sono i tempi medi di vendita a Villaricca?", a: "Il tempo medio di vendita è di circa 105 giorni. Con un prezzo corretto e una buona promozione fotografica scendiamo spesso sotto i 90 giorni." },
      { q: "Coprite anche Qualiano?", a: "Sì, l'agenzia Gabetti Villaricca - Qualiano opera su entrambi i comuni, con consulenti specializzati per ogni zona." },
    ],
  },
  {
    slug: "valutazione-casa-qualiano",
    name: "Qualiano",
    province: "NA",
    agency: "Gabetti Villaricca - Qualiano",
    intro:
      "Vuoi vendere casa a Qualiano? Gabetti Villaricca - Qualiano ti offre una valutazione immobiliare gratuita basata su dati reali del mercato locale, senza impegno.",
    marketDescription:
      "Qualiano nel 2026 mostra un mercato in moderata crescita, sostenuto dalla domanda di prima casa per giovani famiglie. Buona disponibilità di appartamenti e soluzioni indipendenti a prezzi accessibili.",
    priceMin: 1100,
    priceMax: 1900,
    avgDays: 115,
    neighborhoods: ["Centro", "Via Roma", "Zona San Massimo"],
    advantages: [
      "Prezzi tra i più accessibili dell'area nord di Napoli",
      "Ampia disponibilità di soluzioni indipendenti",
      "Comunità tranquilla e a misura di famiglia",
    ],
    faqs: [
      { q: "Quanto vale una casa a Qualiano nel 2026?", a: "I prezzi a Qualiano oscillano tra 1.100 e 1.900 €/m². Un appartamento di 90 m² in buono stato vale circa 110.000-150.000 €." },
      { q: "Vendere casa a Qualiano è conveniente nel 2026?", a: "Sì: la domanda è stabile e i prezzi sono in lieve crescita. Una valutazione professionale ti permette di posizionare correttamente l'immobile." },
      { q: "Quanto tempo serve per vendere casa a Qualiano?", a: "Il tempo medio è di circa 115 giorni; con un'agenzia esperta e un prezzo allineato al mercato si scende a 80-100 giorni." },
    ],
  },
  {
    slug: "valutazione-casa-frattamaggiore",
    name: "Frattamaggiore",
    province: "NA",
    agency: "Gabetti Frattamaggiore",
    intro:
      "Frattamaggiore è uno dei centri più dinamici dell'area nord di Napoli. L'agenzia Gabetti Frattamaggiore valuta gratuitamente la tua casa, con dati reali su Frattamaggiore, Frattaminore, Grumo Nevano, Afragola e Sant'Arpino.",
    marketDescription:
      "Il mercato immobiliare di Frattamaggiore nel 2026 è caratterizzato da una domanda costante per appartamenti di 80-120 m² in centro e nelle aree ben collegate. Buona richiesta anche per soluzioni con terrazzo o doppi servizi.",
    priceMin: 1400,
    priceMax: 2200,
    avgDays: 95,
    neighborhoods: ["Centro storico", "Via Roma", "Corso Durante", "Zona Stazione", "Frattaminore", "Grumo Nevano"],
    advantages: [
      "Stazione ferroviaria con collegamenti diretti per Napoli",
      "Centro commerciale vivace e servizi completi",
      "Mercato stabile e tempi di vendita rapidi",
    ],
    faqs: [
      { q: "Quanto vale una casa a Frattamaggiore?", a: "I prezzi a Frattamaggiore nel 2026 vanno da 1.400 a 2.200 €/m². Un appartamento di 100 m² in buono stato vale mediamente 150.000-200.000 €." },
      { q: "Vendere casa a Frattamaggiore: quanto ci vuole?", a: "I tempi medi di vendita a Frattamaggiore sono tra i più rapidi della zona: circa 95 giorni con un prezzo corretto." },
      { q: "Coprite anche Frattaminore, Grumo Nevano e Afragola?", a: "Sì, l'agenzia Gabetti Frattamaggiore opera in tutta la zona di Frattamaggiore, Frattaminore, Grumo Nevano, Afragola e Sant'Arpino." },
    ],
  },
  {
    slug: "valutazione-casa-frattaminore",
    name: "Frattaminore",
    province: "NA",
    agency: "Gabetti Frattamaggiore",
    intro:
      "Vendere casa a Frattaminore è semplice con il supporto di Gabetti Frattamaggiore. Valutazione professionale gratuita del tuo immobile, basata sui prezzi reali del comune.",
    marketDescription:
      "Frattaminore nel 2026 mostra un mercato stabile, con domanda forte per appartamenti familiari di 80-100 m² e soluzioni indipendenti. Prezzi competitivi rispetto a Frattamaggiore.",
    priceMin: 1300,
    priceMax: 2000,
    avgDays: 100,
    neighborhoods: ["Centro", "Via Roma", "Zona San Maurizio"],
    advantages: [
      "Prezzi accessibili rispetto ai comuni limitrofi",
      "Buoni collegamenti con Frattamaggiore e Napoli",
      "Comunità tranquilla, ideale per famiglie",
    ],
    faqs: [
      { q: "Quanto vale una casa a Frattaminore?", a: "I prezzi a Frattaminore nel 2026 oscillano tra 1.300 e 2.000 €/m². Un appartamento di 90 m² in buono stato vale circa 130.000-170.000 €." },
      { q: "È meglio vendere o ristrutturare prima di vendere?", a: "Dipende dallo stato dell'immobile. In molti casi una semplice tinteggiatura e l'home staging aumentano il prezzo di vendita del 3-5% con una spesa minima. Il consulente Gabetti ti dà indicazioni personalizzate." },
      { q: "Quanto tempo serve per vendere casa a Frattaminore?", a: "Il tempo medio di vendita è di circa 100 giorni con prezzo corretto e buona presentazione dell'immobile." },
    ],
  },
  {
    slug: "valutazione-casa-grumo-nevano",
    name: "Grumo Nevano",
    province: "NA",
    agency: "Gabetti Frattamaggiore",
    intro:
      "Grumo Nevano è un comune residenziale con un mercato immobiliare solido. Gabetti Frattamaggiore offre valutazione gratuita del tuo immobile, con dati reali e senza impegno.",
    marketDescription:
      "Grumo Nevano nel 2026 mantiene un mercato equilibrato. Domanda costante per appartamenti familiari e soluzioni indipendenti. Prezzi in linea con la media dell'area nord di Napoli.",
    priceMin: 1300,
    priceMax: 2000,
    avgDays: 105,
    neighborhoods: ["Centro", "Via Roma", "Zona Stazione"],
    advantages: [
      "Mercato stabile con prezzi prevedibili",
      "Buoni servizi e qualità della vita",
      "Vicinanza a Frattamaggiore e ai principali centri commerciali",
    ],
    faqs: [
      { q: "Quanto vale una casa a Grumo Nevano nel 2026?", a: "I prezzi a Grumo Nevano oscillano tra 1.300 e 2.000 €/m². Un appartamento di 90 m² in buono stato vale circa 130.000-170.000 €." },
      { q: "Quali documenti servono per vendere casa a Grumo Nevano?", a: "Servono atto di provenienza, planimetria e visura catastale, APE, certificato di agibilità e regolarità urbanistica. Il consulente Gabetti ti aiuta a reperirli." },
      { q: "Quanto tempo serve per vendere casa qui?", a: "Il tempo medio di vendita è di circa 105 giorni con prezzo correttamente posizionato." },
    ],
  },
  {
    slug: "valutazione-casa-calvizzano",
    name: "Calvizzano",
    province: "NA",
    agency: "Gabetti Marano",
    intro:
      "Calvizzano è un comune residenziale tranquillo nell'area nord di Napoli. Gabetti Marano valuta gratuitamente la tua casa a Calvizzano, con report basato sui prezzi reali di mercato.",
    marketDescription:
      "Calvizzano nel 2026 mostra un mercato stabile con domanda costante per appartamenti familiari e ville bifamiliari. Apprezzato per la qualità della vita e i collegamenti con Marano e Napoli.",
    priceMin: 1300,
    priceMax: 2100,
    avgDays: 110,
    neighborhoods: ["Centro", "Via Marano", "Zona Parco"],
    advantages: [
      "Comune residenziale tranquillo",
      "Buoni collegamenti con Marano e la Circumflegrea",
      "Domanda solida per ville bifamiliari e appartamenti familiari",
    ],
    faqs: [
      { q: "Quanto vale una casa a Calvizzano?", a: "I prezzi a Calvizzano nel 2026 oscillano tra 1.300 e 2.100 €/m². Un appartamento di 90 m² in buono stato vale circa 130.000-170.000 €." },
      { q: "Quali sono i vantaggi di vivere a Calvizzano?", a: "Calvizzano offre tranquillità, buona qualità della vita e collegamenti rapidi con Marano, Mugnano e Napoli grazie alla Circumflegrea." },
      { q: "Vendere casa a Calvizzano nel 2026 conviene?", a: "Sì, la domanda è stabile e i prezzi sono in lieve crescita. Una valutazione gratuita ti aiuta a posizionare l'immobile correttamente." },
    ],
  },
  {
    slug: "valutazione-casa-santarpino",
    name: "Sant'Arpino",
    province: "CE",
    agency: "Gabetti Frattamaggiore",
    intro:
      "Sant'Arpino, in provincia di Caserta, è ben servita dalla nostra agenzia Gabetti Frattamaggiore. Valutazione casa gratuita, con dati reali del mercato locale.",
    marketDescription:
      "Sant'Arpino nel 2026 è un mercato stabile, con domanda costante per appartamenti familiari e soluzioni a prezzi accessibili. Apprezzata per la vicinanza ai principali centri della provincia di Napoli.",
    priceMin: 1100,
    priceMax: 1800,
    avgDays: 115,
    neighborhoods: ["Centro", "Via Roma", "Zona Caivano"],
    advantages: [
      "Prezzi accessibili in provincia di Caserta",
      "Buoni collegamenti con Aversa, Frattamaggiore e Napoli",
      "Mercato adatto a prima casa e investimenti",
    ],
    faqs: [
      { q: "Quanto vale una casa a Sant'Arpino?", a: "I prezzi a Sant'Arpino nel 2026 oscillano tra 1.100 e 1.800 €/m². Un appartamento di 90 m² in buono stato vale circa 110.000-150.000 €." },
      { q: "Sant'Arpino è in provincia di Napoli o Caserta?", a: "Sant'Arpino fa parte della provincia di Caserta, ma è strettamente collegata all'area nord di Napoli e ai comuni di Frattamaggiore e Aversa." },
      { q: "Coprite Sant'Arpino con la stessa professionalità degli altri comuni?", a: "Assolutamente sì. L'agenzia Gabetti Frattamaggiore copre Sant'Arpino con consulenti che conoscono profondamente il mercato locale." },
    ],
  },
];

export const getCity = (slug: string) => cities.find((c) => c.slug === slug);
