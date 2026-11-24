import { useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TestimonialsSection from "@/components/TestimonialsSection";
import SeoHead from "@/components/SeoHead";
import { getPageContext } from "@/lib/attribution";
import { trackLead } from "@/lib/tracking";

const ThankYou = () => {
  const name = sessionStorage.getItem("lead_name") || "";
  const zone = sessionStorage.getItem("lead_zone") || "";

  // La conversione "valutazione" parte qui: si arriva su /grazie solo dopo che il server ha confermato l'invio.
  useEffect(() => {
    const eventId = sessionStorage.getItem("lead_event_id");
    const alreadyTracked = sessionStorage.getItem("lead_tracked") === "true";
    if (!eventId || alreadyTracked) return;

    let leadData: Record<string, string> = {};
    try {
      leadData = JSON.parse(sessionStorage.getItem("lead_data") || "{}");
    } catch { /* noop */ }

    trackLead({
      form_name: sessionStorage.getItem("lead_form_name") || "valutazione_immobile",
      lead_category: "vendita",
      lead_type: sessionStorage.getItem("lead_type") || "form_submit",
      value: 50,
      event_id: eventId,
      user: {
        email: leadData.email,
        phone: leadData.phone,
        first_name: leadData.first_name,
        last_name: leadData.last_name,
        street: leadData.address,
        city: leadData.zone,
      },
      // Dati del modulo senza dati personali
      extra: {
        ...getPageContext(),
        property_type: leadData.property_type,
        sqm: leadData.sqm,
        condition: leadData.condition,
        zone: leadData.zone,
        timeline: leadData.timeline,
        experience: leadData.experience,
      },
    });

    sessionStorage.setItem("lead_tracked", "true");
    // I dati personali non servono più: non li lasciamo nel browser.
    sessionStorage.removeItem("lead_data");
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
