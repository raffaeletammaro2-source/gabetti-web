// Contatti del sito: numero WhatsApp centrale (collegato al CRM, da cui partono le automazioni)
// e contatti di ogni agenzia. Le landing dei cantieri usano il WhatsApp dell'agenzia di riferimento.

/** WhatsApp generico del sito: collegato a GoHighLevel. */
export const CRM_WHATSAPP = "https://wa.me/393762837626";

export type Agency = {
  name: string;
  /** Comune in cui ha sede l'agenzia */
  town: string;
  /** Comuni e quartieri seguiti dall'agenzia (usati in homepage e nei dati strutturati) */
  comuni: string[];
  area: string;
  whatsapp: string;
  google: string;
  instagram?: string;
  facebook: string;
};

export const agencies: Agency[] = [
  {
    name: "Gabetti Marano",
    town: "Marano di Napoli",
    comuni: ["Marano di Napoli", "Calvizzano"],
    area: "Consulenti locali esperti delle zone di Marano di Napoli e Calvizzano",
    whatsapp: "https://wa.me/393926496197",
    google: "https://share.google/ww1NvHu7Uv7GkkJNr",
    instagram: "https://www.instagram.com/gabetti_marano?igsh=NTlubDUxamxvbGYy",
    facebook: "https://www.facebook.com/share/1FtMcjTdfy/?mibextid=wXlfr",
  },
  {
    name: "Gabetti Mugnano",
    town: "Mugnano di Napoli",
    comuni: ["Mugnano di Napoli", "Melito di Napoli", "Chiaiano"],
    area: "Consulenti locali esperti delle zone di Mugnano di Napoli, Melito, Chiaiano e limitrofe",
    whatsapp: "https://wa.me/393512319735",
    google: "https://share.google/EmxGHB8MXekjruK87",
    instagram: "https://www.instagram.com/gabetti_mugnano?igsh=MTJ3cjE2MGEza2VobQ==",
    facebook: "https://www.facebook.com/share/17Ltmpe8aX/?mibextid=wXlfr",
  },
  {
    name: "Gabetti Villaricca - Qualiano",
    town: "Villaricca",
    comuni: ["Villaricca", "Qualiano"],
    area: "Consulenti locali esperti delle zone di Villaricca e Qualiano",
    whatsapp: "https://wa.me/393452271506",
    google: "https://share.google/JTj6en6VbPwam0dW4",
    instagram: "https://www.instagram.com/gabetti_villaricca_qualiano?igsh=Y2FtZ2lrMjZlc3hk",
    facebook: "https://www.facebook.com/share/1Cd2NpbjiP/?mibextid=wXlfr",
  },
  {
    name: "Gabetti Frattamaggiore",
    town: "Frattamaggiore",
    comuni: ["Frattamaggiore", "Frattaminore", "Grumo Nevano", "Afragola", "Sant'Arpino"],
    area: "Consulenti locali esperti delle zone di Frattamaggiore, Frattaminore, Grumo Nevano, Afragola, Sant'Arpino e limitrofe",
    whatsapp: "https://wa.me/393314162642",
    google: "https://share.google/0MV1f6VfGuysImcvw",
    instagram: "https://www.instagram.com/gabetti_frattamaggiore?igsh=MXc0eHNyMGZkbnNpNw==",
    facebook: "https://www.facebook.com/share/1BtRKFRxeK/?mibextid=wXlfr",
  },
  {
    name: "Gabetti Giugliano",
    town: "Giugliano in Campania",
    comuni: ["Giugliano in Campania", "Sant'Antimo"],
    area: "Consulenti locali esperti della zona di Giugliano in Campania, Sant'Antimo e limitrofe",
    whatsapp: "https://wa.me/393452271506",
    google: "https://share.google/JTj6en6VbPwam0dW4",
    instagram: "https://www.instagram.com/gabetti_villaricca_qualiano?igsh=Y2FtZ2lrMjZlc3hk",
    facebook: "https://www.facebook.com/share/1aioCcSe3g/?mibextid=wXlfr",
  },
];
