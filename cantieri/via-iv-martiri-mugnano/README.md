# Condominio Aurora — Via IV Martiri, Mugnano (NA)

Landing in HTML statico, rifatta dalla versione Lovable (repo `gabetti-aurora-hub`, online su condominioaurora.gabetti-adg.it).

## Immagini (`img/`)
Originali scaricate dalla landing Lovable il 2026-11-16 (1600 px). `favicon.png` ricavata dal logo "G" Gabetti (Drive, `01_Knowledge/Brand`).

## Configurazione (in fondo a `index.html`)
- `META_PIXEL_ID`, `GA4_ID`: vuoti = tracciamento disattivato
- I contatti vanno a `/.netlify/functions/lead` → GoHighLevel (webhook nella variabile `GHL_WEBHOOK_URL` su Netlify)
