# gabetti-web

Progetti web di Gabetti curati da bivio.studio. Repository privato.

## Progetti
| Progetto | Cartella | Tecnologia | URL online | Stato |
|---|---|---|---|---|
| Landing cantiere Via Pietro Nenni, Mugnano (NA) | `cantieri/via-pietro-nenni-mugnano/` | HTML statico | da pubblicare | Pronta, da collegare a CRM e tracciamento |
| Landing cantiere Via IV Martiri, Mugnano (NA) | `cantieri/via-iv-martiri-mugnano/` | React (Lovable) | dominio su Lovable | Da importare da Lovable |
| Sito web Gabetti | `sito/` | React (Lovable) | dominio su Lovable | Da importare da Lovable |

## Struttura
```
shared/      elementi comuni (logo, colori, stili)
cantieri/    una cartella per cantiere, nome in minuscolo con trattini e senza date
sito/        sito web
```

## Regole
- Mai chiavi, token o password nei file: vanno nelle variabili d'ambiente dell'hosting.
- Immagini già ottimizzate per il web; foto originali e render restano su Drive (`clienti/gabetti/08_Cantieri/…`).
- Scheda di ogni cantiere (dati, campagne, risultati) nel repo dell'agenzia: `clienti/gabetti/08_Cantieri/<AAAA-MM_Sede_Nome>/cantiere.md`.

## Pubblicazione
Proposta: Vercel, un progetto per cartella (Root Directory = cartella del progetto). Ogni push su `main` va online da solo.
