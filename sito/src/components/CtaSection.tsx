import { trackCtaClick } from "@/lib/tracking";

const CTA_TEXT = "RICHIEDI ORA LA TUA VALUTAZIONE";

const CtaSection = () => {
  const scrollToForm = () => {
    trackCtaClick(CTA_TEXT);
    document.getElementById("form-section")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="bg-primary py-10 md:py-14">
      <div className="container text-center">
        <h2 className="text-2xl md:text-4xl font-extrabold text-primary-foreground mb-4">
          Pronto a scoprire quanto vale la tua casa?
        </h2>
        <p className="text-primary-foreground/80 mb-8 text-lg">
          Compila il modulo, è gratis e senza impegno.
        </p>
        <button
          onClick={scrollToForm}
          className="bg-primary-foreground text-primary font-bold py-4 px-8 rounded-lg text-base hover:opacity-90 transition-opacity"
        >
          RICHIEDI ORA LA TUA VALUTAZIONE
        </button>
      </div>
    </section>
  );
};

export default CtaSection;
