import { useEffect, useState } from "react";
import { trackCtaClick } from "@/lib/tracking";

const StickyMobileCta = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleClick = () => {
    trackCtaClick("Valuta Casa Gratis (sticky mobile)");
    document.getElementById("form-section")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div
      className={`md:hidden fixed bottom-0 left-0 right-0 z-50 p-3 bg-background/95 backdrop-blur border-t border-border shadow-[0_-4px_20px_rgba(0,0,0,0.08)] transition-transform ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <button
        onClick={handleClick}
        className="w-full py-3.5 rounded-lg bg-primary text-primary-foreground font-bold text-base"
      >
        Valuta Casa Gratis →
      </button>
    </div>
  );
};

export default StickyMobileCta;
