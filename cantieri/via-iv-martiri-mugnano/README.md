# Condominio Aurora — Via IV Martiri, Mugnano (NA)

Landing in HTML statico, rifatta dalla versione Lovable (repo `gabetti-aurora-hub`, online su condominioaurora.gabetti-adg.it).

## Immagini da inserire in `img/`
Non è stato possibile scaricarle in automatico dal sito Lovable. Nomi dei file attesi:
- `facciata.jpg` — hero e anteprima social
- `terrazza-gazebo.jpg`, `terrazza-lounge.jpg`, `assonometria.jpg`, `prospetto.jpg` — galleria spazi comuni
- `logo-gabetti.png` (header), `logo-gabetti-white.png` (footer), `favicon.png`

## Configurazione (in fondo a `index.html`)
- `META_PIXEL_ID`, `GA4_ID`: vuoti = tracciamento disattivato
- I contatti vanno a `/.netlify/functions/lead` → GoHighLevel (webhook nella variabile `GHL_WEBHOOK_URL` su Netlify)
