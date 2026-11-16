import { useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TestimonialsSection from "@/components/TestimonialsSection";
import SeoHead from "@/components/SeoHead";
import { getAttribution, getPageContext } from "@/lib/attribution";
import { hasMarketingConsent } from "@/lib/consent";


declare global {
  interface Window { dataLayer: Record<string, unknown>[]; }
}

const normalizePhone = (raw: string): string => {
  const digits = (raw || "").replace(/\D/g, "");
  if (!digits) return "";
  if (digits.startsWith("39")) return "+" + digits;
  if (digits.startsWith("00")) return "+" + digits.slice(2);
  return "+39" + digits;
};

const ThankYou = () => {
  const name = sessionStorage.getItem("lead_name") || "";
  const zone = sessionStorage.getItem("lead_zone") || "";

  useEffect(() => {
    const eventId = sessionStorage.getItem("lead_event_id");
    const alreadyTracked = sessionStorage.getItem("lead_tracked") === "true";
    if (!eventId || alreadyTracked) return;

    const formName = sessionStorage.getItem("lead_form_name") || "valutazione_immobile";
    const leadType = sessionStorage.getItem("lead_type") || "form_submit";
    let leadData: Record<string, string | boolean> = {};
    try {
      leadData = JSON.parse(sessionStorage.getItem("lead_data") || "{}");
    } catch { /* noop */ }

    const marketingOk = hasMarketingConsent();
    const attribution = getAttribution() || {};
    const pageCtx = getPageContext();

    // user_data strutturato per Enhanced Conversions / CAPI.
    // Solo se l'utente ha accettato i cookie marketing.
    // GTM/GAds hashano automaticamente in SHA-256 se i campi sono in chiaro.
    const userData = marketingOk ? {
      email_address: (leadData.email as string)?.trim().toLowerCase(),
      phone_number: normalizePhone(leadData.phone as string),
      address: {
        first_name: (leadData.first_name as string)?.trim().toLowerCase(),
        last_name: (leadData.last_name as string)?.trim().toLowerCase(),
        street: (leadData.address as string)?.trim().toLowerCase(),
        city: (leadData.zone as string)?.trim().toLowerCase(),
        region: "NA",
        country: "IT",
      },
    } : undefined;

    // Dati form non-PII (sempre safe)
    const leadProps = {
      property_type: leadData.property_type,
      sqm: leadData.sqm,
      condition: leadData.condition,
      zone: leadData.zone,
      timeline: leadData.timeline,
      experience: leadData.experience,
    };

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "generate_lead",
      form_name: formName,
      lead_type: leadType,
      event_id: eventId,
      value: 50,
      currency: "EUR",
      // Page context
      ...pageCtx,
      // Attribution (UTM + click IDs + landing)
      ...attribution,
      // Lead properties (non-PII)
      ...leadProps,
      // Enhanced Conversions / CAPI user data (solo con consenso marketing)
      ...(userData ? { user_data: userData } : {}),
    });

    sessionStorage.setItem("lead_tracked", "true");
  }, []);

  return (
    <>
      <SeoHead
        title="Grazie! Controlla WhatsApp | Gabetti Franchising"
        description="La tua richiesta è stata ricevuta. Riceverai subito un messaggio su WhatsApp con le indicazioni per la tua valutazione."
        canonical="/grazie"
        noindex
      />
      <Header />
      <main className="min-h-[70vh] bg-background md:py-20 my-0 pt-[40px] pb-0">
        <div className="container max-w-2xl text-center">
          <h1 className="text-3xl md:text-5xl font-extrabold mb-4">
            Grazie {name}! 🎉
          </h1>
          <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
            Abbiamo ricevuto la tua richiesta. Riceverai subito un whatsapp con le indicazioni per proseguire.
          </p>
          {zone && (
            <div className="bg-muted rounded-xl p-5 mb-10 text-sm">
              Nel frattempo, un nostro consulente Gabetti della zona di <strong>{zone}</strong> sta già lavorando alla tua valutazione.
            </div>
          )}
          <Link to="/" className="inline-block border border-border rounded-lg px-6 py-3 font-semibold text-sm hover:bg-muted transition-colors">
            Torna alla home
          </Link>
        </div>
      </main>
      <div className="-mt-[40px]">
        <TestimonialsSection />
      </div>
      <Footer />
    </>
  );
};

export default ThankYou;
