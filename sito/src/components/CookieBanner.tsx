import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { acceptAll, getStoredConsent, rejectAll, saveConsent } from "@/lib/consent";

const CookieBanner = () => {
  const [open, setOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const [preferences, setPreferences] = useState(false);

  useEffect(() => {
    const stored = getStoredConsent();
    if (!stored) {
      setOpen(true);
    } else {
      setAnalytics(stored.analytics);
      setMarketing(stored.marketing);
      setPreferences(stored.preferences);
      // Re-applica al caricamento per assicurare consent state coerente
      import("@/lib/consent").then((m) => m.applyConsent(stored));
    }
    const handler = () => {
      const s = getStoredConsent();
      if (s) {
        setAnalytics(s.analytics);
        setMarketing(s.marketing);
        setPreferences(s.preferences);
      }
      setShowSettings(true);
      setOpen(true);
    };
    window.addEventListener("open-cookie-settings", handler);
    return () => window.removeEventListener("open-cookie-settings", handler);
  }, []);

  if (!open) return null;

  const handleAcceptAll = () => { acceptAll(); setOpen(false); setShowSettings(false); };
  const handleRejectAll = () => { rejectAll(); setOpen(false); setShowSettings(false); };
  const handleSave = () => { saveConsent(analytics, marketing, preferences); setOpen(false); setShowSettings(false); };

  return (
    <div role="dialog" aria-labelledby="cookie-banner-title" className="fixed inset-x-0 bottom-0 z-[100] p-3 md:p-5">
      <div className="container max-w-3xl bg-card border border-border rounded-xl shadow-2xl p-4 md:p-6">
        {!showSettings ? (
          <>
            <h2 id="cookie-banner-title" className="text-base md:text-lg font-bold mb-2">Rispettiamo la tua privacy</h2>
            <p className="text-xs md:text-sm text-muted-foreground mb-4 leading-relaxed">
              Utilizziamo cookie tecnici necessari al funzionamento del sito e, previo tuo consenso, cookie di analisi e marketing per migliorare l'esperienza e mostrarti contenuti pertinenti.
              Puoi accettare, rifiutare o personalizzare le tue preferenze. Maggiori informazioni nella nostra{" "}
              <Link to="/cookie-policy" className="underline font-medium">Cookie Policy</Link> e{" "}
              <Link to="/privacy-policy" className="underline font-medium">Privacy Policy</Link>.
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <button onClick={handleRejectAll} className="flex-1 py-2.5 px-4 rounded-lg border border-border text-sm font-semibold hover:bg-muted transition-colors">
                Rifiuta tutti
              </button>
              <button onClick={() => setShowSettings(true)} className="flex-1 py-2.5 px-4 rounded-lg border border-border text-sm font-semibold hover:bg-muted transition-colors">
                Personalizza
              </button>
              <button onClick={handleAcceptAll} className="flex-1 py-2.5 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-bold hover:opacity-90 transition-opacity">
                Accetta tutti
              </button>
            </div>
          </>
        ) : (
          <>
            <h2 className="text-base md:text-lg font-bold mb-3">Preferenze cookie</h2>
            <div className="space-y-3 mb-4 max-h-[40vh] overflow-y-auto">
              <Toggle title="Necessari" description="Indispensabili per il funzionamento del sito (sempre attivi)." checked disabled />
              <Toggle title="Preferenze" description="Memorizzano le tue scelte (es. zona, lingua) per migliorare l'esperienza." checked={preferences} onChange={setPreferences} />
              <Toggle title="Statistiche / Analytics" description="Ci aiutano a capire come usi il sito in forma anonima (es. Google Analytics)." checked={analytics} onChange={setAnalytics} />
              <Toggle title="Marketing" description="Permettono di mostrarti annunci pertinenti (es. Google Ads, Meta Pixel)." checked={marketing} onChange={setMarketing} />
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <button onClick={handleRejectAll} className="flex-1 py-2.5 px-4 rounded-lg border border-border text-sm font-semibold hover:bg-muted transition-colors">
                Rifiuta tutti
              </button>
              <button onClick={handleSave} className="flex-1 py-2.5 px-4 rounded-lg border border-border text-sm font-semibold hover:bg-muted transition-colors">
                Salva preferenze
              </button>
              <button onClick={handleAcceptAll} className="flex-1 py-2.5 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-bold hover:opacity-90 transition-opacity">
                Accetta tutti
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const Toggle = ({ title, description, checked, onChange, disabled }: {
  title: string; description: string; checked: boolean; onChange?: (v: boolean) => void; disabled?: boolean;
}) => (
  <label className={`flex items-start justify-between gap-3 p-3 rounded-lg border border-border ${disabled ? "opacity-70" : "cursor-pointer"}`}>
    <div className="flex-1">
      <p className="text-sm font-semibold">{title}</p>
      <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
    </div>
    <input
      type="checkbox"
      checked={checked}
      disabled={disabled}
      onChange={(e) => onChange?.(e.target.checked)}
      className="accent-primary w-5 h-5 mt-0.5"
    />
  </label>
);

export default CookieBanner;
