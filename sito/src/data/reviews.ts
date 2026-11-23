// Recensioni Google delle agenzie, raccolte a mano dalle schede Google Maps il 23/11/2026.
// Testi originali (accorciati con "…" dove lunghi), autore con nome e iniziale del cognome.
// Per aggiornare: aprire la scheda Google dell'agenzia, copiare voto, numero di recensioni e
// le recensioni nuove. Non inventare né modificare testi: devono restare quelli pubblicati su Google.
// Gabetti Giugliano non ha ancora una scheda Google (in apertura), quindi qui non compare.

export type AgencyRating = {
  agency: string;
  rating: number;
  count: number;
  url: string;
};

export type Review = {
  author: string;
  agency: string;
  stars: number;
  text: string;
};

export const REVIEWS_UPDATED = "23 novembre 2026";

export const agencyRatings: AgencyRating[] = [
  { agency: "Gabetti Marano", rating: 4.6, count: 110, url: "https://share.google/ww1NvHu7Uv7GkkJNr" },
  { agency: "Gabetti Mugnano", rating: 4.9, count: 94, url: "https://share.google/EmxGHB8MXekjruK87" },
  { agency: "Gabetti Villaricca - Qualiano", rating: 4.6, count: 85, url: "https://share.google/JTj6en6VbPwam0dW4" },
  { agency: "Gabetti Frattamaggiore", rating: 4.9, count: 27, url: "https://share.google/0MV1f6VfGuysImcvw" },
];

export const reviews: Review[] = [
  {
    author: "Veronica D.",
    agency: "Gabetti Marano",
    stars: 5,
    text: "Mi sono affidata a Gabetti per la vendita del mio appartamento e devo dire che Vincenzo ha svolto un ottimo lavoro. In poco tempo è riuscito ad organizzare un \"open house\" che ha permesso a diverse persone di visitare la casa in una sola giornata. […] è andato tutto benissimo e la casa è stata venduta a condizioni che hanno soddisfatto sia me che l'acquirente.",
  },
  {
    author: "Erika C.",
    agency: "Gabetti Mugnano",
    stars: 5,
    text: "Mi hanno seguito con competenza in ogni fase, rendendo tutto semplice e veloce. Sempre gentili, presenti e pronti a trovare la soluzione migliore. Grazie a loro sono riuscita a vendere casa in tempi rapidi e con grande serenità.",
  },
  {
    author: "Santa P.",
    agency: "Gabetti Villaricca - Qualiano",
    stars: 5,
    text: "Fin dal primo giorno si sono dimostrati puntuali, super organizzati e attenti a ogni minimo dettaglio. Sempre disponibili e pronti a rispondere a ogni nostro dubbio, sono riusciti a rassicurarci in ogni fase del percorso con estrema chiarezza e competenza.",
  },
  {
    author: "Luigi D.",
    agency: "Gabetti Frattamaggiore",
    stars: 5,
    text: "Sono stato seguito durante tutto il percorso di acquisto della mia casa da Dario e Ilaria, che si sono dimostrati sempre disponibili, precisi, efficienti e molto professionali. […] Agenzia assolutamente consigliata!",
  },
  {
    author: "Maurizio A.",
    agency: "Gabetti Marano",
    stars: 5,
    text: "Fin dal primo momento si è dimostrato essere un professionista di grande competenza, serietà e disponibilità, capace di accompagnarci in ogni fase della compravendita con un'attenzione davvero fuori dal comune. […] Un'esperienza eccellente, ben oltre le nostre aspettative.",
  },
  {
    author: "Chiara F.",
    agency: "Gabetti Mugnano",
    stars: 5,
    text: "Dall'inizio alla fine ci siamo sentiti accolti e capiti da Andrea, Giada e Luigi che insieme ci hanno trasmesso da subito fiducia. Sono competenti, professionali e sempre disponibili a chiarire ogni dubbio. Non ci hanno mai lasciati soli, non potevano desiderare di meglio per la vendita della nostra casa.",
  },
  {
    author: "Livia E.",
    agency: "Gabetti Villaricca - Qualiano",
    stars: 5,
    text: "Hanno seguito ogni dettaglio con grande competenza, disponibilità e cortesia, fornendo risposte chiare e tempestive a ogni richiesta. La loro serietà e attenzione al cliente hanno reso tutto semplice e senza stress.",
  },
  {
    author: "Fabio D.",
    agency: "Gabetti Mugnano",
    stars: 5,
    text: "Hanno locato il mio immobile in due mesi, con visite selezionate e sempre puntuali. Qualità della relazione con tutto il personale ottima e poi quando avverti quella sensazione di sicurezza e di affidabilità pensi di esserti affidato davvero in buone mani.",
  },
  {
    author: "Maurizio M.",
    agency: "Gabetti Marano",
    stars: 5,
    text: "Un professionista serio, preparato e sempre disponibile. Dimostra una grande conoscenza del mercato. Se cercate un punto di riferimento affidabile nel settore immobiliare, Vincenzo e la Gabetti sono una garanzia!",
  },
  {
    author: "Tullio V.",
    agency: "Gabetti Mugnano",
    stars: 5,
    text: "Disponibilità nell'ascoltare, nel venire incontro ad ogni esigenza, nel risolvere ogni problema che si palesava (dal più piccolo al più complesso) […] A tutto questo si aggiunge una spiccata professionalità che si percepisce in ogni membro dello staff già dai primi incontri e che ti fa sentire al \"SICURO\".",
  },
];

export const totalReviews = agencyRatings.reduce((s, a) => s + a.count, 0);
/** Media pesata sul numero di recensioni di ogni scheda, arrotondata a un decimale. */
export const averageRating =
  Math.round((agencyRatings.reduce((s, a) => s + a.rating * a.count, 0) / totalReviews) * 10) / 10;
