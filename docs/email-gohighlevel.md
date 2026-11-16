# Email del sito in GoHighLevel

Da novembre 2026 le email dei form del sito non partono più da Lovable. Le manda GoHighLevel, con un workflow per ogni form.
Testi ripresi dai modelli che usava Lovable.

I dati arrivano dal trigger **Inbound Webhook** con questi nomi di campo. Nell'editor email di GoHighLevel si inseriscono
dal selettore dei campi (icona `{}` / tag), sezione *Inbound Webhook*: in genere hanno la forma `{{inboundWebhookRequest.<campo>}}`.
Se il workflow crea o aggiorna il contatto, per nome, email e telefono si possono usare anche `{{contact.first_name}}` ecc.

---

## Form "Valuta casa" → variabile Netlify `GHL_WEBHOOK_URL_VALUTAZIONE`

Campi ricevuti: `first_name`, `last_name`, `full_name`, `email`, `phone`, `property_type`, `sqm`, `condition`, `zone`,
`address`, `timeline`, `experience`, `page_url`, `submitted_at`, `event_id`, `form_name` (= `valutazione_immobile`),
`utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content`.

Workflow consigliato: **Inbound Webhook → Create/Update Contact → Send Email (cliente) → Send Email (interna) → eventuale assegnazione/opportunità**.

### Email al cliente
- **Oggetto:** Abbiamo ricevuto la tua richiesta di valutazione
- **Testo:**

> Ciao {{first_name}},
>
> grazie per averci contattato! Abbiamo ricevuto la tua richiesta di valutazione gratuita per il tuo immobile.
>
> Un nostro consulente esperto della tua zona ti contatterà entro 24 ore lavorative per fissare un sopralluogo gratuito
> e fornirti una stima accurata e personalizzata.
>
> **Riepilogo richiesta**
> Tipologia: {{property_type}}
> Metri quadri: {{sqm}} mq
> Zona: {{zone}}
> Indirizzo: {{address}}
>
> Nel frattempo, se hai domande urgenti puoi contattarci direttamente via WhatsApp al **+39 376 283 7626**.
>
> A presto,
> Gabetti Franchising — Agenzia di Marano di Napoli

### Email interna (prima andava a valutazioni@gabetti-adg.it)
- **Oggetto:** Nuovo lead valutazione: {{first_name}} {{last_name}} — {{zone}}
- **Testo:**

> 🏠 **Nuovo lead valutazione**
>
> **Contatto** — Nome: {{first_name}} {{last_name}} · Email: {{email}} · Telefono: {{phone}}
> **Immobile** — Tipologia: {{property_type}} · Metri quadri: {{sqm}} mq · Stato: {{condition}} · Zona: {{zone}} · Indirizzo: {{address}}
> **Intenzione** — Tempistica vendita: {{timeline}} · Esperienza precedente: {{experience}}
>
> Inviato: {{submitted_at}} · Pagina: {{page_url}} · Campagna: {{utm_source}} / {{utm_campaign}} · ID: {{event_id}}

---

## Form "Lavora con noi" → variabile Netlify `GHL_WEBHOOK_URL_CANDIDATURE`

Campi ricevuti: `first_name`, `last_name`, `full_name`, `email`, `phone`, `experience`, `letter`, `page_url`,
`submitted_at`, `event_id`, `form_name` (= `lavora_con_noi`), `utm_*`.

### Email al candidato
- **Oggetto:** Abbiamo ricevuto la tua candidatura — Gabetti Franchising
- **Testo:**

> Grazie {{first_name}}!
>
> Abbiamo ricevuto la tua candidatura per entrare nel team Gabetti Franchising — Gruppo ADG.
>
> Il nostro team la valuterà con attenzione e, se il tuo profilo è in linea con le posizioni aperte,
> ti contatteremo al più presto per un colloquio conoscitivo.
>
> A presto,
> Il team Gabetti Franchising — Gruppo ADG

### Email interna (prima andava a candidature@gabetti-adg.it)
- **Oggetto:** Nuova candidatura: {{full_name}}
- **Testo:**

> **Nuova candidatura "Lavora con noi"**
>
> Nome: {{full_name}} · Telefono: {{phone}} · Email: {{email}}
> Esperienza nel settore: {{experience}}
>
> **Lettera di presentazione:**
> {{letter}}
>
> Inviato: {{submitted_at}}
