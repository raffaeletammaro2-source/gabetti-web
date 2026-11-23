// Centralized JSON-LD schemas for SEO + GEO (AI search) optimization.
// Telefoni = numeri WhatsApp delle agenzie (data/agencies.ts). Indirizzi da completare con il civico reale.

export const SITE_URL = "https://gabetti-adg.it";

export const AGENCIES = [
  {
    name: "Gabetti Marano di Napoli",
    streetAddress: "Via Marano-Pianura",
    addressLocality: "Marano di Napoli",
    postalCode: "80016",
    telephone: "+39-392-649-6197",
    areaServed: ["Marano di Napoli", "Calvizzano"],
  },
  {
    name: "Gabetti Mugnano di Napoli",
    streetAddress: "Via Napoli",
    addressLocality: "Mugnano di Napoli",
    postalCode: "80018",
    telephone: "+39-351-231-9735",
    areaServed: ["Mugnano di Napoli", "Melito di Napoli", "Chiaiano"],
  },
  {
    name: "Gabetti Villaricca - Qualiano",
    streetAddress: "Corso Italia",
    addressLocality: "Villaricca",
    postalCode: "80010",
    telephone: "+39-345-227-1506",
    areaServed: ["Villaricca", "Qualiano"],
  },
  {
    name: "Gabetti Frattamaggiore",
    streetAddress: "Corso Durante",
    addressLocality: "Frattamaggiore",
    postalCode: "80027",
    telephone: "+39-331-416-2642",
    areaServed: ["Frattamaggiore", "Frattaminore", "Grumo Nevano", "Afragola", "Sant'Arpino"],
  },
  {
    name: "Gabetti Giugliano",
    streetAddress: "Corso Campano",
    addressLocality: "Giugliano in Campania",
    postalCode: "80014",
    telephone: "+39-345-227-1506",
    areaServed: ["Giugliano in Campania", "Sant'Antimo"],
  },
];

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "RealEstateAgent",
  "@id": `${SITE_URL}/#organization`,
  name: "Gabetti Franchising — Gruppo ADG",
  alternateName: "Gabetti ADG",
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  image: `${SITE_URL}/logo.png`,
  description:
    "Agenzie immobiliari Gabetti Franchising del Gruppo ADG: valutazione gratuita casa, vendita e acquisizione immobili a Marano, Mugnano, Giugliano, Villaricca, Qualiano, Frattamaggiore e comuni limitrofi.",
  areaServed: AGENCIES.flatMap((a) => a.areaServed),
  priceRange: "€€",
  sameAs: ["https://www.gabetti.it"],
  brand: { "@type": "Brand", name: "Gabetti" },
  knowsAbout: [
    "Vendita di immobili per conto dei proprietari",
    "Valutazione immobiliare",
    "Nuove costruzioni",
    "Mercato immobiliare in provincia di Napoli",
  ],
  department: AGENCIES.map((a) => ({
    "@type": "RealEstateAgent",
    name: a.name,
    telephone: a.telephone,
    address: {
      "@type": "PostalAddress",
      streetAddress: a.streetAddress,
      addressLocality: a.addressLocality,
      postalCode: a.postalCode,
      addressRegion: "NA",
      addressCountry: "IT",
    },
    areaServed: a.areaServed,
  })),
};

/** Elenco delle sedi per la homepage: ogni agenzia come LocalBusiness con area servita. */
export const buildLocationsSchema = (
  items: { name: string; town: string; comuni: string[]; whatsapp: string; sameAs: string[] }[],
) => ({
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Agenzie Gabetti Franchising del Gruppo ADG",
  numberOfItems: items.length,
  itemListElement: items.map((a, i) => ({
    "@type": "ListItem",
    position: i + 1,
    item: {
      "@type": "RealEstateAgent",
      name: a.name,
      telephone: "+" + a.whatsapp.replace(/\D/g, ""),
      address: { "@type": "PostalAddress", addressLocality: a.town, addressRegion: "NA", addressCountry: "IT" },
      areaServed: a.comuni.map((c) => ({ "@type": "City", name: c })),
      sameAs: a.sameAs,
      parentOrganization: { "@id": `${SITE_URL}/#organization` },
    },
  })),
});

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  url: SITE_URL,
  name: "Gabetti Franchising — Gruppo ADG",
  inLanguage: "it-IT",
  publisher: { "@id": `${SITE_URL}/#organization` },
};

export const buildFaqSchema = (faqs: { q: string; a: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
});

export const buildBreadcrumbSchema = (items: { name: string; url: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((it, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: it.name,
    item: it.url.startsWith("http") ? it.url : `${SITE_URL}${it.url}`,
  })),
});

export const reviewsAggregateSchema = (count: number, rating = 4.9) => ({
  "@context": "https://schema.org",
  "@type": "RealEstateAgent",
  "@id": `${SITE_URL}/#organization`,
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: rating.toFixed(1),
    reviewCount: count,
    bestRating: "5",
    worstRating: "1",
  },
});
