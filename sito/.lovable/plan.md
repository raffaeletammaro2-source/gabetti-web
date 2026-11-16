## Audit attuale (sintesi)

**Punti di forza già presenti**
- Single page con form multi-step, hero chiara, sezioni Why/Agencies/Benefits/Testimonials/FAQ/CTA
- Title e meta description già keyword-oriented
- ThankYou page separata con tracciamento dataLayer
- Layout responsive, semantica base ok (h1 unico in hero)

**Gap principali**
- Nessun JSON-LD (LocalBusiness, RealEstateAgent, FAQPage, Organization, BreadcrumbList, Review)
- Nessuna pagina locale per comune (Marano, Mugnano, Giugliano, Villaricca, Qualiano, Frattamaggiore, Frattaminore, Grumo Nevano, Calvizzano, Sant'Arpino)
- Nessun blog / contenuti informativi citabili da AI (GEO)
- FAQ presenti ma non segnate con schema
- robots.txt e sitemap.xml mancanti / non ottimizzati
- Nessun blocco "Cos'è / Come funziona / Quanto vale" strutturato per GEO
- Alt text immagini da verificare
- Internal linking assente (solo ancore form)

## Strategia

### Architettura URL proposta
```
/                              → home (valutazione gratuita)
/grazie                        → thank you (esistente)
/valutazione-casa-marano-di-napoli
/valutazione-casa-mugnano-di-napoli
/valutazione-casa-giugliano-in-campania
/valutazione-casa-villaricca
/valutazione-casa-qualiano
/valutazione-casa-frattamaggiore
/valutazione-casa-frattaminore
/valutazione-casa-grumo-nevano
/valutazione-casa-calvizzano
/valutazione-casa-santarpino
/blog                          → indice
/blog/quanto-vale-casa-napoli-2026
/blog/come-vendere-casa-velocemente
/blog/documenti-vendere-casa
/blog/aumentare-valore-casa
/blog/mercato-immobiliare-napoli-nord
```

### Intenti di ricerca mappati
- **Transazionali**: "valutazione casa [comune]", "quanto vale casa mia" → home + landing locali con form
- **Commerciali**: "agenzia immobiliare Napoli", "vendere casa Napoli" → landing locali, sezione "perché Gabetti"
- **Informativi**: "come valutare un immobile", "documenti per vendere casa" → blog (per GEO + long tail)

## Implementazione (questo turno)

Per evitare un PR ingestibile, propongo di procedere a fasi. **In questo primo turno** implemento le fondamenta SEO/GEO/CRO + 1 pagina locale pilota e routing scalabile:

### Fase 1 — Fondamenta SEO/GEO (questo turno)
1. **JSON-LD globali** in `index.html`:
   - `Organization` + `RealEstateAgent` + `LocalBusiness` (con 5 sedi `branchOf`)
   - `WebSite` con `SearchAction`
2. **JSON-LD per pagina** (component `<SeoHead>` con `react-helmet-async` o injection vanilla):
   - `FAQPage` su home e landing locali
   - `BreadcrumbList` sulle landing locali e blog
   - `Review` aggregato sulle testimonianze
3. **Meta dinamici per route** (title, description, canonical, OG) tramite hook `useSeo`
4. **Sitemap.xml + robots.txt** statici in `public/`
5. **Blocco GEO sulla home**: nuove sezioni "Cos'è la valutazione immobiliare", "Come funziona in 3 step", "Quanto vale la tua casa nel 2026" con paragrafi brevi e citabili
6. **FAQ ampliata** (da 5 a 10 domande con keyword informative + schema)
7. **Internal linking**: footer con link a tutte le pagine locali e blog
8. **Alt text** + attributi `aria-*` mancanti
9. **CRO**: microcopy form, sticky CTA mobile "Valuta Casa Gratis", trust bar con numeri (500+ immobili, 24h, 5 agenzie, 4.9★)

### Fase 2 — Pagine locali (turno successivo, dopo tua conferma)
Template `LocalLanding` riusabile + 10 pagine generate da un array di dati comune (mercato, prezzi €/m², tempi vendita, quartieri, FAQ locali). Ogni pagina: H1 locale, blocco mercato, quotazioni indicative, FAQ locali, form, schema `RealEstateAgent`+`FAQPage`+`BreadcrumbList`.

### Fase 3 — Blog (turno successivo)
Indice `/blog` + 5 articoli MDX/TSX iniziali con schema `Article`, breadcrumb, related posts, CTA valutazione.

## Dettagli tecnici

- **Routing**: aggiungo le rotte in `App.tsx`. Per il template locale uso `:slug` con dataset.
- **SEO head**: installo `react-helmet-async` (leggero, standard) per gestire meta/JSON-LD per route.
- **Design system**: nessun colore hardcoded, riuso token esistenti.
- **Performance**: lazy-load delle pagine non-home con `React.lazy` + `Suspense`.
- **Schema**: tutti i JSON-LD validati contro schema.org, indirizzi reali delle 5 agenzie (uso placeholder se non li ho — ti chiederò di confermarli).
- **Tracking**: preservo `dataLayer` esistente, aggiungo eventi `cta_click` su CTA principali.

## Cosa mi serve da te (non blocca la Fase 1)

Per le pagine locali e gli schemi `LocalBusiness` con dati reali, mi servirebbero:
1. Indirizzi, telefoni e orari delle 5 agenzie Gabetti
2. Eventuali link Google Maps / Google Business Profile
3. Logo ufficiale ad alta risoluzione (per `Organization.logo`)
4. Link social ufficiali (Facebook/Instagram)

Procedo intanto con la **Fase 1** usando placeholder dove necessario (chiaramente marcati `TODO`), così il framework è pronto e i dati reali si sostituiscono in 5 minuti.

---

Confermi di procedere con la **Fase 1** come descritta? Se preferisci un ordine diverso (es. prima le 10 pagine locali), dimmelo e riorganizzo.