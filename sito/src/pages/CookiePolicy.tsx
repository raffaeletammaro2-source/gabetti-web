import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SeoHead from "@/components/SeoHead";
import { openConsentSettings } from "@/lib/consent";

const CookiePolicy = () => (
  <>
    <SeoHead
      title="Cookie Policy | Gabetti Franchising Valutazioni"
      description="Informazioni sui cookie utilizzati dal sito e modalità di gestione delle preferenze."
      canonical="/cookie-policy"
    />
    <Header />
    <main className="container max-w-3xl py-10 md:py-16">
      <article className="prose prose-slate max-w-none">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Cookie Policy</h1>
        <p className="text-sm text-muted-foreground mb-6">Ultimo aggiornamento: 12 maggio 2026</p>

        <button
          onClick={openConsentSettings}
          className="mb-8 inline-flex items-center px-4 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity"
        >
          Gestisci preferenze cookie
        </button>

        <h2 className="text-xl font-bold mt-6 mb-3">Cosa sono i cookie</h2>
        <p className="text-sm leading-relaxed">
          I cookie sono piccoli file di testo che i siti visitati inviano al terminale dell'utente, dove vengono memorizzati per essere ritrasmessi
          agli stessi siti alla visita successiva. Insieme ai cookie utilizziamo tecnologie analoghe (pixel, local storage, identificatori).
        </p>

        <h2 className="text-xl font-bold mt-8 mb-3">Categorie di cookie utilizzati</h2>

        <h3 className="text-base font-bold mt-5 mb-2">1. Cookie tecnici / necessari</h3>
        <p className="text-sm leading-relaxed">
          Indispensabili al funzionamento del sito. Non richiedono consenso ai sensi dell'art. 122 del Codice Privacy.
          Vengono utilizzati per memorizzare la sessione, le preferenze di consenso e garantire la sicurezza.
        </p>

        <h3 className="text-base font-bold mt-5 mb-2">2. Cookie di preferenza</h3>
        <p className="text-sm leading-relaxed">
          Memorizzano scelte effettuate dall'utente (zona di interesse, opzioni del form) per fornire un'esperienza personalizzata.
          Richiedono consenso.
        </p>

        <h3 className="text-base font-bold mt-5 mb-2">3. Cookie statistici / analytics</h3>
        <p className="text-sm leading-relaxed mb-2">
          Raccolgono informazioni in forma aggregata e anonima sul numero di utenti e sulle modalità di visita del sito,
          per migliorarne le prestazioni. Richiedono consenso.
        </p>
        <ul className="text-sm leading-relaxed list-disc pl-5 space-y-1">
          <li><strong>Google Analytics 4</strong> (Google Ireland Ltd) — cookie <code>_ga</code>, <code>_ga_*</code>. Durata: 24 mesi.</li>
          <li><strong>Google Tag Manager</strong> — gestore di tag, non installa cookie autonomamente.</li>
        </ul>

        <h3 className="text-base font-bold mt-5 mb-2">4. Cookie di marketing / profilazione</h3>
        <p className="text-sm leading-relaxed mb-2">
          Servono a tracciare l'utente attraverso siti diversi per mostrare annunci pertinenti. Richiedono consenso esplicito.
        </p>
        <ul className="text-sm leading-relaxed list-disc pl-5 space-y-1">
          <li><strong>Google Ads</strong> (Google Ireland Ltd) — conversion tracking e remarketing. Cookie <code>_gcl_*</code>, <code>NID</code>. Durata: fino a 13 mesi.</li>
          <li><strong>Meta Pixel</strong> (Meta Platforms Ireland Ltd) — conversion tracking e remarketing. Cookie <code>_fbp</code>, <code>fr</code>. Durata: 3 mesi.</li>
        </ul>

        <h2 className="text-xl font-bold mt-8 mb-3">Google Consent Mode v2</h2>
        <p className="text-sm leading-relaxed">
          Il sito implementa <strong>Google Consent Mode v2</strong>: i tag Google (Analytics, Ads) vengono caricati con consenso predefinito
          negato e si attivano completamente solo dopo la tua scelta esplicita. In caso di rifiuto, Google riceve solo segnali aggregati e
          anonimi (ping senza cookie) per misurazioni di base, in conformità al GDPR.
        </p>

        <h2 className="text-xl font-bold mt-8 mb-3">Come gestire le preferenze</h2>
        <p className="text-sm leading-relaxed mb-3">
          Puoi modificare in qualsiasi momento le tue preferenze cliccando sul pulsante <strong>"Gestisci preferenze cookie"</strong> in cima a questa pagina.
          In alternativa puoi disabilitare i cookie direttamente dalle impostazioni del tuo browser:
        </p>
        <ul className="text-sm leading-relaxed list-disc pl-5 space-y-1">
          <li><a className="underline" href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer">Google Chrome</a></li>
          <li><a className="underline" href="https://support.mozilla.org/it/kb/protezione-antitracciamento-avanzata-firefox-desktop" target="_blank" rel="noopener noreferrer">Mozilla Firefox</a></li>
          <li><a className="underline" href="https://support.apple.com/it-it/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer">Apple Safari</a></li>
          <li><a className="underline" href="https://support.microsoft.com/it-it/microsoft-edge" target="_blank" rel="noopener noreferrer">Microsoft Edge</a></li>
        </ul>

        <h2 className="text-xl font-bold mt-8 mb-3">Trasferimenti extra-UE</h2>
        <p className="text-sm leading-relaxed">
          I servizi Google e Meta possono comportare il trasferimento di dati negli Stati Uniti, sulla base del Data Privacy Framework
          o di Clausole Contrattuali Standard approvate dalla Commissione Europea.
        </p>

        <h2 className="text-xl font-bold mt-8 mb-3">Riferimenti</h2>
        <p className="text-sm leading-relaxed">
          Per maggiori informazioni sul trattamento dei tuoi dati consulta la nostra <a href="/privacy-policy" className="underline">Privacy Policy</a>.
        </p>
      </article>
    </main>
    <Footer />
  </>
);

export default CookiePolicy;
