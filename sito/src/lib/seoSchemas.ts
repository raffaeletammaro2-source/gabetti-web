// Centralized JSON-LD schemas for SEO + GEO (AI search) optimization.
// Update agency addresses/phones with real data when available.

export const SITE_URL = "https://gabetti-adg.it";

export const AGENCIES = [
  {
    name: "Gabetti Marano di Napoli",
    streetAddress: "Via Marano-Pianura",
    addressLocality: "Marano di Napoli",
    postalCode: "80016",
    telephone: "+39-081-0000000",
    areaServed: ["Marano di Napoli", "Calvizzano"],
  },
  {
    name: "Gabetti Mugnano di Napoli",
    streetAddress: "Via Napoli",
    addressLocality: "Mugnano di Napoli",
    postalCode: "80018",
    telephone: "+39-081-0000000",
    areaServed: ["Mugnano di Napoli", "Melito di Napoli", "Chiaiano"],
  },
  {
    name: "Gabetti Villaricca - Qualiano",
    streetAddress: "Corso Italia",
    addressLocality: "Villaricca",
    postalCode: "80010",
    telephone: "+39-081-0000000",
    areaServed: ["Villaricca", "Qualiano"],
  },
  {
    name: "Gabetti Frattamaggiore",
    streetAddress: "Corso Durante",
    addressLocality: "Frattamaggiore",
    postalCode: "80027",
    telephone: "+39-081-0000000",
    areaServed: ["Frattamaggiore", "Frattaminore", "Grumo Nevano", "Afragola", "Sant'Arpino"],
  },
  {
    name: "Gabetti Giugliano",
    streetAddress: "Corso Campano",
    addressLocality: "Giugliano in Campania",
    postalCode: "80014",
    telephone: "+39-081-0000000",
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
    "Agenzie immobiliari Gabetti Franchising nell'area nord di Napoli: valutazione gratuita casa, vendita e acquisizione immobili a Marano, Mugnano, Giugliano, Villaricca, Qualiano, Frattamaggiore e comuni limitrofi.",
  areaServed: AGENCIES.flatMap((a) => a.areaServed),
  priceRange: "€€",
  sameAs: ["https://www.gabetti.it", "https://www.facebook.com/", "https://www.instagram.com/"],
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

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  url: SITE_URL,
  name: "Gabetti Franchising — Valutazione Casa Napoli Nord",
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
