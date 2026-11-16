# shared

Elementi comuni alle pagine Gabetti, pubblicati in `/shared/`.

| File | Uso |
|---|---|
| `img/gabetti-franchising.png` | Logo istituzionale Gabetti Franchising (dal sito principale) |
| `site-header.css` | Header comune delle landing: logo + menu del sito (come `sito/src/components/Header.tsx`), barra fissa con le sezioni della landing, pulsanti nello stile via Pietro Nenni |
| `site-header.js` | Apre e chiude il menu su mobile |

Per una nuova landing: includere nel `<head>`
`<link rel="stylesheet" href="/shared/site-header.css">` e `<script src="/shared/site-header.js" defer></script>`,
copiare il blocco `<header class="gh">…</header><nav class="gh-sub">…</nav>` da una landing esistente
e cambiare nome del cantiere e voci delle sezioni. Serve il simbolo SVG `#i-wa` nella pagina.
Se cambia il menu del sito (`NAV` in `Header.tsx`), aggiornarlo anche nelle landing.
