import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Building2, Home, Building, Store, HelpCircle, Landmark } from "lucide-react";

declare global {
  interface Window { dataLayer: Record<string, unknown>[]; }
}

const propertyTypes = [
  { value: "appartamento", label: "Appartamento", icon: Building2 },
  { value: "villa", label: "Villa / Villetta", icon: Home },
  { value: "attico", label: "Attico", icon: Landmark },
  { value: "commerciale", label: "Locale commerciale", icon: Store },
  { value: "altro", label: "Altro", icon: HelpCircle },
];

const conditions = ["Da ristrutturare", "Buono", "Ottimo", "Nuovo o ristrutturato da meno di 5 anni"];
const timelines = ["Subito", "Entro 6 mesi", "Entro un anno", "Sto solo valutando il valore"];
const experiences = ["No, è la prima volta", "Sì, da solo", "Sì, con un'altra agenzia"];
const zones = ["Marano di Napoli", "Mugnano di Napoli", "Villaricca", "Qualiano", "Frattamaggiore", "Frattaminore", "Grumo Nevano", "Sant'Arpino", "Sant'Antimo", "Afragola", "Melito", "Chiaiano", "Calvizzano", "Giugliano in Campania", "Altro"];

interface FormData {
  propertyType: string; sqm: string; condition: string;
  timeline: string; experience: string; zone: string; zoneAltro: string;
  name: string; email: string; phone: string; address: string; gdpr: boolean;
}

const initialData: FormData = {
  propertyType: "", sqm: "", condition: "",
  timeline: "", experience: "", zone: "", zoneAltro: "",
  name: "", email: "", phone: "", address: "", gdpr: false,
};

const MultiStepForm = () => {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<FormData>(initialData);
  const navigate = useNavigate();

  const set = (field: keyof FormData, value: string | boolean) =>
    setData((prev) => ({ ...prev, [field]: value }));

  const canNext = () => {
    if (step === 1) return data.propertyType && data.sqm && data.condition;
    if (step === 2) return data.zone && (data.zone !== "Altro" || data.zoneAltro) && data.address && data.timeline && data.experience;
    if (step === 3) return data.name && data.email && data.phone && data.gdpr;
    return false;
  };

  const next = () => {
    if (!canNext()) return;
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: `form_step_${step}_completed`, form_name: "valutazione_immobile", step });
    setStep((s) => s + 1);
  };

  const submit = () => {
    if (!canNext()) return;
    const eventId = "lead_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9);
    const [firstName, ...lastParts] = data.name.trim().split(" ");
    const lastName = lastParts.join(" ");
    const zoneFinal = data.zone === "Altro" ? data.zoneAltro : data.zone;
    sessionStorage.setItem("lead_event_id", eventId);
    sessionStorage.setItem("lead_tracked", "false");
    sessionStorage.setItem("lead_form_name", "valutazione_immobile");
    sessionStorage.setItem("lead_type", "form_submit");
    sessionStorage.setItem("lead_name", firstName);
    sessionStorage.setItem("lead_zone", zoneFinal);
    sessionStorage.setItem("lead_data", JSON.stringify({
      first_name: firstName,
      last_name: lastName,
      full_name: data.name,
      email: data.email,
      phone: data.phone,
      property_type: data.propertyType,
      sqm: data.sqm,
      condition: data.condition,
      zone: zoneFinal,
      address: data.address,
      timeline: data.timeline,
      experience: data.experience,
      gdpr: data.gdpr,
    }));

    // Webhook Zapier (fire-and-forget, no-cors)
    const zone = data.zone === "Altro" ? data.zoneAltro : data.zone;
    const payload = {
      event_id: eventId,
      submitted_at: new Date().toISOString(),
      page_url: window.location.href,
      form_name: "valutazione_immobile",
      first_name: firstName,
      last_name: lastName,
      full_name: data.name,
      email: data.email,
      phone: data.phone,
      property_type: data.propertyType,
      sqm: data.sqm,
      condition: data.condition,
      zone,
      address: data.address,
      timeline: data.timeline,
      experience: data.experience,
      gdpr: data.gdpr,
    };
    // Notifiche email transazionali (utente + admin) + webhook via Lovable Cloud
    import("@/integrations/supabase/client").then(({ supabase }) => {
      // Webhook LeadConnector via edge function (evita CORS / ad blocker)
      supabase.functions.invoke("forward-lead-webhook", { body: payload })
        .then(({ data, error }) => {
          if (error) console.error("Webhook error", error);
          else console.log("Webhook forwarded:", data);
        });

      // Email di conferma all'utente
      supabase.functions.invoke("send-transactional-email", {
        body: {
          templateName: "lead-confirmation",
          recipientEmail: data.email,
          idempotencyKey: `lead-confirm-${eventId}`,
          templateData: {
            firstName,
            propertyType: data.propertyType,
            sqm: data.sqm,
            zone,
            address: data.address,
          },
        },
      }).catch((err) => console.error("User email error", err));

      // Notifica admin
      supabase.functions.invoke("send-transactional-email", {
        body: {
          templateName: "lead-admin-notification",
          recipientEmail: "valutazioni@gabetti-adg.it",
          idempotencyKey: `lead-admin-${eventId}`,
          templateData: {
            firstName,
            lastName,
            email: data.email,
            phone: data.phone,
            propertyType: data.propertyType,
            sqm: data.sqm,
            condition: data.condition,
            zone,
            address: data.address,
            timeline: data.timeline,
            experience: data.experience,
            pageUrl: window.location.href,
            submittedAt: new Date().toISOString(),
            eventId,
          },
        },
      }).catch((err) => console.error("Admin email error", err));
    });

    navigate("/grazie");
  };

  const radioGroup = (field: keyof FormData, options: string[]) => (
    <div className="grid grid-cols-1 gap-2">
      {options.map((o) => (
        <label key={o} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${data[field] === o ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-border hover:border-primary/40"}`}>
          <input type="radio" name={field} value={o} checked={data[field] === o} onChange={() => set(field, o)} className="accent-primary w-4 h-4" />
          <span className="text-sm font-medium">{o}</span>
        </label>
      ))}
    </div>
  );

  return (
    <div className="bg-card rounded-xl shadow-xl border border-border p-5 md:p-8">
      {/* Progress */}
      <div className="flex items-center gap-2 mb-6">
        {[1, 2, 3].map((s) => (
          <div key={s} className={`h-2 flex-1 rounded-full transition-colors ${s <= step ? "bg-primary" : "bg-muted"}`} />
        ))}
      </div>
      <p className="text-sm text-muted-foreground mb-5 font-medium">Step {step} di 3</p>

      {step === 1 && (
        <div className="space-y-5">
          <fieldset>
            <legend className="text-base font-semibold mb-3">Tipologia immobile</legend>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {propertyTypes.map(({ value, label, icon: Icon }) => (
                <label key={value} className={`flex flex-col items-center gap-1.5 p-3 rounded-lg border cursor-pointer text-center transition-all ${data.propertyType === value ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-border hover:border-primary/40"}`}>
                  <Icon className={`w-6 h-6 ${data.propertyType === value ? "text-primary" : "text-muted-foreground"}`} />
                  <input type="radio" name="propertyType" value={value} checked={data.propertyType === value} onChange={() => set("propertyType", value)} className="sr-only" />
                  <span className="text-xs font-medium">{label}</span>
                </label>
              ))}
            </div>
          </fieldset>
          <div>
            <label htmlFor="sqm" className="block text-sm font-semibold mb-1.5">Metri quadri</label>
            <input id="sqm" type="number" placeholder="es. 85" value={data.sqm} onChange={(e) => set("sqm", e.target.value)} className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <fieldset>
            <legend className="text-sm font-semibold mb-2">Stato dell'immobile</legend>
            {radioGroup("condition", conditions)}
          </fieldset>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-5">
          <div>
            <label htmlFor="zone" className="block text-sm font-semibold mb-1.5">Zona dell'immobile</label>
            <select id="zone" value={data.zone} onChange={(e) => set("zone", e.target.value)} className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
              <option value="">Seleziona zona</option>
              {zones.map((z) => <option key={z} value={z}>{z}</option>)}
            </select>
          </div>
          {data.zone === "Altro" && (
            <div>
              <label htmlFor="zoneAltro" className="block text-sm font-semibold mb-1.5">Specifica il comune</label>
              <input id="zoneAltro" type="text" value={data.zoneAltro} onChange={(e) => set("zoneAltro", e.target.value)} placeholder="Es. Casoria, Aversa..." className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
          )}
          <div>
            <label htmlFor="address" className="block text-sm font-semibold mb-1.5">Indirizzo immobile</label>
            <input id="address" type="text" value={data.address} onChange={(e) => set("address", e.target.value)} placeholder="Via Roma 1, Marano di Napoli" className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <fieldset>
            <legend className="text-base font-semibold mb-3">Quando vorresti vendere?</legend>
            {radioGroup("timeline", timelines)}
          </fieldset>
          <fieldset>
            <legend className="text-base font-semibold mb-3">Hai già provato a venderla?</legend>
            {radioGroup("experience", experiences)}
          </fieldset>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-semibold mb-1.5">Nome e Cognome</label>
            <input id="name" type="text" value={data.name} onChange={(e) => set("name", e.target.value)} placeholder="Mario Rossi" className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-semibold mb-1.5">Email</label>
            <input id="email" type="email" value={data.email} onChange={(e) => set("email", e.target.value)} placeholder="mario@email.com" className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-semibold mb-1.5">Telefono</label>
            <div className="flex">
              <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-border bg-muted text-sm text-muted-foreground">+39</span>
              <input id="phone" type="tel" value={data.phone} onChange={(e) => set("phone", e.target.value)} placeholder="333 1234567" className="flex-1 rounded-r-lg border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
          </div>
          <label className="flex items-start gap-2 cursor-pointer">
            <input type="checkbox" checked={data.gdpr} onChange={(e) => set("gdpr", e.target.checked)} className="accent-primary mt-1 w-4 h-4" />
            <span className="text-xs text-muted-foreground leading-relaxed">
              Acconsento al trattamento dei dati personali secondo la Privacy Policy di Gabetti Franchising ai sensi del GDPR (Reg. UE 2016/679)
            </span>
          </label>
        </div>
      )}

      <div className="flex gap-3 mt-6">
        {step > 1 && (
          <button type="button" onClick={() => setStep((s) => s - 1)} className="flex-1 py-3 rounded-lg border border-border font-semibold text-sm hover:bg-muted transition-colors">
            Indietro
          </button>
        )}
        {step < 3 ? (
          <button type="button" onClick={next} disabled={!canNext()} className="flex-1 py-3 rounded-lg bg-primary text-primary-foreground font-bold text-base disabled:opacity-40 hover:opacity-90 transition-opacity">
            Avanti
          </button>
        ) : (
          <button type="button" onClick={submit} disabled={!canNext()} className="flex-1 py-3.5 rounded-lg bg-primary text-primary-foreground font-bold text-base disabled:opacity-40 hover:opacity-90 transition-opacity">
            Valuta Casa!
          </button>
        )}
      </div>
    </div>
  );
};

export default MultiStepForm;
