import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SeoHead from "@/components/SeoHead";

const PrivacyPolicy = () => (
  <>
    <SeoHead
      title="Privacy Policy | Gabetti Franchising Valutazioni"
      description="Informativa sul trattamento dei dati personali ai sensi del Regolamento UE 2016/679 (GDPR)."
      canonical="/privacy-policy"
    />
    <Header />
    <main className="container max-w-3xl py-10 md:py-16">
      <article className="prose prose-slate max-w-none">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Privacy Policy</h1>
        <p className="text-sm text-muted-foreground mb-8">Ultimo aggiornamento: 12 maggio 2026</p>

        <h2 className="text-xl font-bold mt-8 mb-3">1. Titolare del trattamento</h2>
        <p className="text-sm leading-relaxed">
          Titolare del trattamento è <strong>Gabetti Franchising — Gruppo ADG</strong>, con sede operativa nell'area nord di Napoli.
          Per qualsiasi richiesta in materia di protezione dei dati puoi scrivere a <a className="underline" href="mailto:team@gabetti-adg.it">team@gabetti-adg.it</a>.
        </p>

        <h2 className="text-xl font-bold mt-8 mb-3">2. Tipologie di dati raccolti</h2>
        <ul className="text-sm leading-relaxed list-disc pl-5 space-y-1">
          <li><strong>Dati di contatto</strong>: nome, cognome, email, numero di telefono.</li>
          <li><strong>Dati relativi all'immobile</strong>: tipologia, metri quadri, stato, zona, indirizzo, tempistiche di vendita.</li>
          <li><strong>Dati di navigazione</strong>: indirizzo IP, tipo di browser, pagine visitate, data e ora di accesso, referrer.</li>
          <li><strong>Cookie e identificatori online</strong>: vedi la <a href="/cookie-policy" className="underline">Cookie Policy</a>.</li>
        </ul>

        <h2 className="text-xl font-bold mt-8 mb-3">3. Finalità e basi giuridiche</h2>
        <ul className="text-sm leading-relaxed list-disc pl-5 space-y-2">
          <li><strong>Erogazione del servizio di valutazione immobiliare</strong> richiesto tramite form (art. 6.1.b GDPR — esecuzione di misure precontrattuali).</li>
          <li><strong>Adempimento di obblighi di legge</strong> fiscali, contabili e antiriciclaggio (art. 6.1.c GDPR).</li>
          <li><strong>Marketing diretto</strong> (newsletter, comunicazioni commerciali) solo previo tuo consenso esplicito (art. 6.1.a GDPR).</li>
          <li><strong>Statistiche e miglioramento del sito</strong> tramite cookie analitici, previo consenso (art. 6.1.a GDPR).</li>
          <li><strong>Difesa di un diritto in sede giudiziaria</strong> (art. 6.1.f GDPR — legittimo interesse).</li>
        </ul>

        <h2 className="text-xl font-bold mt-8 mb-3">4. Modalità del trattamento</h2>
        <p className="text-sm leading-relaxed">
          I dati sono trattati con strumenti elettronici e cartacei, da personale autorizzato e formato, con misure tecniche e organizzative
          adeguate a garantirne la sicurezza, riservatezza e integrità (cifratura in transito, controllo accessi, backup).
        </p>

        <h2 className="text-xl font-bold mt-8 mb-3">5. Destinatari e trasferimenti</h2>
        <p className="text-sm leading-relaxed mb-2">I tuoi dati possono essere comunicati a:</p>
        <ul className="text-sm leading-relaxed list-disc pl-5 space-y-1">
          <li>Personale autorizzato e collaboratori del Titolare;</li>
          <li>Agenzie del network Gabetti Franchising competenti per la zona dell'immobile;</li>
          <li>Fornitori di servizi tecnologici in qualità di responsabili del trattamento (hosting, CRM, email transazionali, analytics);</li>
          <li>Autorità competenti su richiesta legittima.</li>
        </ul>
        <p className="text-sm leading-relaxed mt-2">
          Eventuali trasferimenti extra-UE avvengono solo verso paesi adeguati o tramite Clausole Contrattuali Standard (SCC) approvate dalla Commissione Europea.
        </p>

        <h2 className="text-xl font-bold mt-8 mb-3">6. Periodo di conservazione</h2>
        <ul className="text-sm leading-relaxed list-disc pl-5 space-y-1">
          <li>Dati relativi a richieste di valutazione: <strong>24 mesi</strong> dall'ultimo contatto;</li>
          <li>Dati relativi a contratti stipulati: <strong>10 anni</strong> per obblighi fiscali;</li>
          <li>Dati per marketing: fino a revoca del consenso o massimo <strong>24 mesi</strong>;</li>
          <li>Log di navigazione: massimo <strong>12 mesi</strong>.</li>
        </ul>

        <h2 className="text-xl font-bold mt-8 mb-3">7. Diritti dell'interessato</h2>
        <p className="text-sm leading-relaxed mb-2">Hai diritto in qualsiasi momento di:</p>
        <ul className="text-sm leading-relaxed list-disc pl-5 space-y-1">
          <li>Accedere ai tuoi dati (art. 15 GDPR);</li>
          <li>Rettificarli o aggiornarli (art. 16);</li>
          <li>Cancellarli "diritto all'oblio" (art. 17);</li>
          <li>Limitarne il trattamento (art. 18);</li>
          <li>Riceverli in formato strutturato — portabilità (art. 20);</li>
          <li>Opporti al trattamento (art. 21);</li>
          <li>Revocare il consenso in qualsiasi momento;</li>
          <li>Proporre reclamo al <a className="underline" href="https://www.garanteprivacy.it" target="_blank" rel="noopener noreferrer">Garante per la Protezione dei Dati Personali</a>.</li>
        </ul>
        <p className="text-sm leading-relaxed mt-2">
          Per esercitare i tuoi diritti scrivi a <a className="underline" href="mailto:team@gabetti-adg.it">team@gabetti-adg.it</a>.
        </p>

        <h2 className="text-xl font-bold mt-8 mb-3">8. Conferimento dei dati</h2>
        <p className="text-sm leading-relaxed">
          Il conferimento dei dati richiesti nel form è facoltativo, ma il rifiuto comporta l'impossibilità di erogare il servizio di valutazione.
        </p>

        <h2 className="text-xl font-bold mt-8 mb-3">9. Modifiche alla presente informativa</h2>
        <p className="text-sm leading-relaxed">
          Il Titolare si riserva il diritto di aggiornare la presente informativa pubblicando la versione modificata su questa pagina con indicazione della data di ultimo aggiornamento.
        </p>
      </article>
    </main>
    <Footer />
  </>
);

export default PrivacyPolicy;
