# gabetti-web

Progetti web di Gabetti curati da bivio.studio. Repository privato.

## Progetti
| Progetto | Cartella | Tecnologia | URL online | Stato |
|---|---|---|---|---|
| Sito web Gabetti | `sito/` | React + Vite (importato da Lovable, repo `gabetti-adg` @ `bd474ca`), dati su Supabase (Lovable Cloud) | https://gabetti-adg.it/ | Online su Netlify |
| Landing Condominio Aurora, Via IV Martiri, Mugnano (NA) | `cantieri/via-iv-martiri-mugnano/` | HTML statico (rifatta da Lovable) | https://gabetti-adg.it/cantieri/via-iv-martiri-mugnano/ | Online, form → GoHighLevel |
| Landing cantiere Via Pietro Nenni, Mugnano (NA) | `cantieri/via-pietro-nenni-mugnano/` | HTML statico | https://gabetti-adg.it/cantieri/via-pietro-nenni-mugnano/ | Online, form → GoHighLevel (webhook dedicato) |

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

## Pubblicazione (Netlify)
Un solo sito Netlify per tutto il repo, un solo dominio:
- `build.sh` copia le pagine in `_site/`: `sito/` alla radice, le landing in `/cantieri/<slug>/`.
- `netlify.toml` imposta build, cartella pubblicata e funzioni.
- Ogni push su `main` va online da solo.

## Sito principale (`sito/`)
- App React importata da Lovable: Netlify la costruisce a ogni push (`npm ci` + `npm run build` in `build.sh`).
- **Da ora si modifica qui, non più su Lovable**: il repo `gabetti-adg` collegato a Lovable non viene più letto.
- Dati e login admin su **Supabase, progetto `gabetti-adg`** (non più Lovable Cloud). Struttura: `sito/supabase/setup/01_schema.sql`.
- I form del sito passano dalla funzione Netlify `sito-form` → GoHighLevel; le email partono dai workflow di GoHighLevel (testi in `docs/email-gohighlevel.md`).
- `sito/.env` contiene solo indirizzo e chiave publishable di Supabase (sono comunque visibili nel sito pubblicato). Mai la chiave secret.
- `netlify.toml` manda a `index.html` ogni indirizzo che non è un file vero (es. `/servizi`, `/immobile/...`):
  le landing in `/cantieri/` sono file veri e restano separate.

## Contatti dai form
I form inviano a `/.netlify/functions/lead` (`netlify/functions/lead.mjs`), che controlla i dati, scarta lo spam
e inoltra a GoHighLevel. Il webhook va impostato su Netlify: **Project configuration → Environment variables → `GHL_WEBHOOK_URL`**.

Webhook per landing: se una landing di `cantieri/<slug>/` deve andare a un workflow diverso, aggiungere la variabile
`GHL_WEBHOOK_URL_<SLUG>` (slug in maiuscolo, trattini → trattini bassi). Se non c'è, si usa `GHL_WEBHOOK_URL`.

| Landing | Variabile |
|---|---|
| `cantieri/via-iv-martiri-mugnano/` | `GHL_WEBHOOK_URL` (predefinito) |
| `cantieri/via-pietro-nenni-mugnano/` | `GHL_WEBHOOK_URL_VIA_PIETRO_NENNI_MUGNANO` |
| Sito: form "Valuta casa" (`/.netlify/functions/sito-form`) | `GHL_WEBHOOK_URL_VALUTAZIONE` |
| Sito: form "Lavora con noi" (`/.netlify/functions/sito-form`) | `GHL_WEBHOOK_URL_CANDIDATURE` |
Mai scriverlo nei file.

## Anteprima in locale
```bash
bash build.sh && python3 -m http.server 8765 --directory _site
```
Poi aprire http://localhost:8765/cantieri/via-iv-martiri-mugnano/ (il form funziona solo su Netlify).
