# Tracciamento gabetti-adg.it

Il sito e le landing scrivono **solo nel dataLayer**. Google Tag Manager traduce gli eventi per GA4, Meta e Google Ads.
Nel codice non va mai messo il codice del Pixel o di GA4.

| Dove | File |
|---|---|
| Sito React | `sito/index.html` (consenso + GTM), `sito/src/lib/tracking.ts` (eventi), `sito/src/lib/consent.ts` (banner) |
| Landing cantieri | `shared/tracking.js` (consenso + GTM + banner + eventi), incluso nel `<head>` di ogni `cantieri/<slug>/index.html` |
| Container GTM web | `docs/tracciamento/gtm-web-container.json`, generato da `genera-container.py` |

## Regole
1. Una conversione parte **solo dopo che il server ha confermato l'invio**, mai al clic sul pulsante.
2. Ogni evento ha un `event_id` univoco: Pixel e Conversions API usano lo stesso, così Meta non conta il lead due volte.
3. I dati personali (`user_data`) entrano nel dataLayer **solo con il consenso marketing**.
4. La candidatura CV **non è un lead**: ha un evento suo, così le campagne vendita non ottimizzano su chi cerca lavoro.
5. Il consenso è unico per tutto il dominio (`localStorage.cookie_consent_v1`): chi sceglie sul sito non rivede il banner sulle landing.

## Eventi

| Evento | Quando | Parametri | GA4 | Meta | Google Ads |
|---|---|---|---|---|---|
| `generate_lead` | modulo commerciale inviato | `form_name`, `lead_category`, `lead_type`, `project`, `value`, `currency`, `event_id`, UTM e click ID, `user_data` | `generate_lead` (evento chiave) | `Lead` (`Schedule` se `lead_type = visita`) | una conversione per categoria |
| `job_application` | candidatura inviata | `form_name`, `event_id`, `user_data` | `job_application` (evento chiave) | `SubmitApplication` | no |
| `click_whatsapp` / `click_phone` | clic su WhatsApp / telefono | `click_url`, `event_id` | stessi nomi | `Contact` | no |
| `cta_click` | clic sulle call to action | `cta_text` | `cta_click` | no | no |
| `form_step` | passo del form valutazione completato | `form_name`, `step` | `form_step` | no | no |
| `cookie_consent_update` | scelta nel banner | `consent_analytics`, `consent_marketing`, `consent_preferences` | no (serve solo come trigger) | no | no |

### Moduli

| Modulo | `form_name` | `lead_category` | `lead_type` | `project` |
|---|---|---|---|---|
| Valutazione immobile (evento su `/grazie`) | `valutazione_immobile` | `vendita` | `form_submit` | — |
| Landing Condominio Aurora | `cantiere_via-iv-martiri-mugnano` | `nuove_costruzioni` | `form_submit` | nome del progetto |
| Landing Via Pietro Nenni | `cantiere_via-pietro-nenni-mugnano` | `nuove_costruzioni` | `form_submit` | nome del progetto |
| Scheda immobile: richiesta info | `compra_richiesta_info` | `acquisto` | `info` | id immobile |
| Scheda immobile: prenota visita | `compra_prenota_visita` | `acquisto` | `visita` | id immobile |
| Lavora con noi | `lavora_con_noi` | — (evento `job_application`) | — | — |

Nuova landing: includere `<script src="/shared/tracking.js"></script>` nel `<head>` e, dopo la risposta positiva del server,
chiamare `GabettiTracking.lead({ form_name: "cantiere_<slug>", project: PROGETTO, user: { name, email, phone, city } })`.

## 1. Container GTM web (`GTM-TLKTBLW6`)
1. Svuotare il container (tag, trigger, variabili). **Non eliminare il container**: l'ID è nel codice.
2. Amministrazione → **Importa container** → `gtm-web-container.json` → area di lavoro nuova → **Sovrascrivi**.
3. Le costanti hanno già GA4 (`G-NHHJW2WXSH`), Pixel (`996516643236051`) e server (`https://sgtm.gabetti-adg.it`).
4. Google Ads: i due tag di conversione sono **in pausa**. Quando hai le azioni di conversione:
   - inserisci l'ID nella costante `const - Google Ads Conversion ID` e l'etichetta in ogni tag;
   - nei tag attiva *Includi dati forniti dall'utente* → nuova variabile *Dati forniti dall'utente* → *Automatico/Codice* (il sito li passa già con `gtag('set', 'user_data', …)`);
   - togli la pausa.
5. **Anteprima** (Tag Assistant) e verifica la lista in fondo, poi **Pubblica**.

Cosa c'è dentro:
- `GA4 - Google tag`: unico tag di configurazione, manda la page_view del primo caricamento passando dal server.
  Le pagine successive del sito React le manda GA4 da solo (misurazione avanzata).
- Tag evento GA4 per `generate_lead`, `job_application`, clic contatto, `cta_click`, `form_step`.
- `Meta - Pixel base + PageView`: parte solo con il consenso marketing (`ad_storage`), una volta per caricamento,
  anche nel momento in cui l'utente accetta dal banner. Eventi automatici sui clic disattivati.
  Le PageView dei cambi pagina le manda il Pixel da solo.
- `Meta - Lead`, `Schedule`, `SubmitApplication`, `Contact`, con `eventID` = `event_id` del sito.
- `Google Ads - Linker conversioni` e le due conversioni in pausa.

## 2. GA4 (proprietà `G-NHHJW2WXSH`)
- Amministrazione → Stream di dati → Misurazione avanzata → lascia **attiva** *Modifiche della pagina in base agli eventi della cronologia del browser*: è lei a contare i cambi pagina del sito React (nel container non c'è un tag per questo).
- Eventi chiave: `generate_lead` e `job_application`.
- Dimensioni personalizzate (ambito evento): `form_name`, `lead_category`, `lead_type`, `project`.
- Raccolta dei dati forniti dall'utente: attiva (serve per le conversioni avanzate).
- Collega Google Ads e importa **solo** `generate_lead`, se non usi i tag Ads diretti. Mai entrambi per la stessa conversione.

## 3. Container GTM server (`sgtm.gabetti-adg.it`)
Prima importa e pubblica il container web (punto 1): è il tag GA4 del web che manda gli eventi al server.

**3.1 Svuotare.** Apri il container server su tagmanager.google.com. In *Tag*: seleziona tutti → *Elimina*.
In *Attivatori*: elimina quelli creati da voi. In *Client* **tieni** *GA4* (tipo *Google Analytics: GA4 (Web)*);
se manca: *Nuovo* → *Google Analytics: GA4 (Web)* → salva com'è. Non toccare *Amministrazione → Impostazioni container* (dominio).

**3.2 Variabili.** *Variabili* → *Variabili integrate* → *Configura* → attiva *Event Name* e *Client Name*.
Poi in *Variabili definite dall'utente* → *Nuova* → *Dati evento*, tre volte:

| Nome variabile | Percorso chiave |
|---|---|
| `ed - lead_type` | `lead_type` |
| `ed - event_id` | `event_id` |
| `ed - x-ga-gcs` | `x-ga-gcs` |

**3.3 Attivatori.** *Attivatori* → *Nuovo* → tipo *Personalizzato* → *Alcuni eventi*:

| Nome attivatore | Condizioni (tutte vere) |
|---|---|
| `GA4 - tutti` | `Client Name` uguale a `GA4` |
| `Meta - Lead` | `Client Name` uguale a `GA4` · `Event Name` uguale a `generate_lead` · `ed - lead_type` non è uguale a `visita` · `ed - x-ga-gcs` corrisponde a RegEx `^G11` |
| `Meta - Schedule` | `Client Name` uguale a `GA4` · `Event Name` uguale a `generate_lead` · `ed - lead_type` uguale a `visita` · `ed - x-ga-gcs` corrisponde a RegEx `^G11` |
| `Meta - SubmitApplication` | `Client Name` uguale a `GA4` · `Event Name` uguale a `job_application` · `ed - x-ga-gcs` corrisponde a RegEx `^G11` |
| `Meta - Contact` | `Client Name` uguale a `GA4` · `Event Name` corrisponde a RegEx `^(click_whatsapp\|click_phone)$` · `ed - x-ga-gcs` corrisponde a RegEx `^G11` |

`x-ga-gcs` è lo stato del consenso inviato da GA4: `G1` + pubblicità + statistiche (`G111` = tutto accettato,
`G100` = tutto rifiutato). `^G11` = consenso marketing dato: senza, a Meta non parte niente.

**3.4 Tag GA4.** *Tag* → *Nuovo* → *Google Analytics: GA4* → ID misurazione vuoto (lo prende dall'evento) →
attivatore `GA4 - tutti` → nome `GA4 - inoltro`.

**3.5 Modello Meta.** *Modelli* → *Modelli di tag* → *Cerca nella galleria* → **Facebook Conversion API** (di *stape-io*) → *Aggiungi all'area di lavoro*.

**3.6 Token Meta.** Events Manager → dataset/pixel `996516643236051` → *Impostazioni* → *Conversions API* →
*Configura manualmente* / *Genera token di accesso*. Copialo: si vede una volta sola.

**3.7 Tag Meta (4 tag uguali, cambia solo nome evento e attivatore).** *Tag* → *Nuovo* → *Facebook Conversion API*:
- *Event Name Setup Method*: **Override** · *Event Type*: **Standard** · *Event Name*: **Lead**
- *Pixel ID*: `996516643236051` · *API Access Token*: il token
- *Test ID*: per ora il codice di *Test eventi* di Events Manager (lo togli prima di pubblicare)
- *Action Source*: `website`
- se c'è una sezione *Consent*: invia solo con consenso marketing
- *Server Event Data Override* → *Event ID* = `{{ed - event_id}}` (se il campo non c'è, il modello lo prende già da `event_id`)
- attivatore `Meta - Lead` · nome `Meta CAPI - Lead`

Salva, poi dal menu ⋮ del tag → *Copia* tre volte, cambiando:

| Tag | Event Name | Attivatore |
|---|---|---|
| `Meta CAPI - Schedule` | Schedule | `Meta - Schedule` |
| `Meta CAPI - SubmitApplication` | SubmitApplication | `Meta - SubmitApplication` |
| `Meta CAPI - Contact` | Contact | `Meta - Contact` |

La PageView non si manda da server: non ha `event_id` e Meta la conterebbe due volte.

**3.8 Prova.** *Anteprima* nel container server e nel container web (stessa scheda). Sul sito: accetta i cookie e clicca WhatsApp.
- Nell'anteprima server: evento `click_whatsapp` → `GA4 - inoltro` e `Meta CAPI - Contact` *Fired*.
- In Events Manager → *Test eventi*: `Contact` da **browser** e da **server**, con dicitura *Deduplicato*.
- Rifiutando i cookie: nessun tag Meta deve partire (solo `GA4 - inoltro`).
Poi un invio di prova del form valutazione → `Lead` deduplicato. Togli il *Test ID* dai 4 tag e **Pubblica**.

## 4. Meta Events Manager
- Dominio `gabetti-adg.it` verificato (meta tag già online).
- Impostazioni del Pixel: *Corrispondenza avanzata automatica* attiva. Gli eventi automatici sui clic li disattiva già il tag.
- **Conversioni personalizzate**, una per tipo di campagna:

  | Nome | Evento | Regola |
  |---|---|---|
  | Lead Valutazione | Lead | `content_name` è `valutazione_immobile` |
  | Lead Cantiere Aurora | Lead | `content_name` è `cantiere_via-iv-martiri-mugnano` |
  | Lead Cantiere Pietro Nenni | Lead | `content_name` è `cantiere_via-pietro-nenni-mugnano` |
  | Lead Nuove costruzioni (tutte) | Lead | `content_category` è `nuove_costruzioni` |
  | Lead Acquisto | Lead | `content_category` è `acquisto` |

  Ogni campagna ottimizza sulla sua conversione personalizzata. Se non ci sono ancora abbastanza dati, usa l'evento `Lead`.
  `SubmitApplication` si usa solo per eventuali campagne di recruiting.

## 5. Verifica dopo la pubblicazione
- [ ] Senza consenso: nessuna richiesta a `facebook.com/tr`, nessun cookie `_fbp`; GA4 manda solo ping anonimi (`gcs=G100`).
- [ ] Dopo "Accetta tutti": una `PageView` Meta e una `page_view` GA4.
- [ ] Cambio pagina nel sito: **una** `page_view` GA4 e **una** `PageView` Meta.
- [ ] Ricaricando con il consenso già dato: Pixel e GA4 partono subito, senza banner.
- [ ] Invio di prova del form valutazione: `generate_lead` in GA4 Tempo reale; `Lead` in Meta Test eventi, da browser **e** da server, con la dicitura "Deduplicato".
- [ ] Invio di prova da una landing cantiere: come sopra, con `content_name` del cantiere.
- [ ] Candidatura di prova: `job_application` in GA4 e `SubmitApplication` in Meta, **nessun** `Lead`.
- [ ] Clic su WhatsApp e telefono: `click_whatsapp` / `click_phone` in GA4, `Contact` in Meta.
- [ ] Cancellare dal CRM i lead di prova.
