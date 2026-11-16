import { VALUTA_URL } from "@/lib/properties";
import { trackCtaClick } from "@/lib/tracking";

const AcquisitionBanner = ({ title, text, campaign = "compra_listing" }: { title: string; text: string; campaign?: string }) => (
  <aside className="rounded-xl bg-[hsl(var(--primary-dark))] p-6 md:p-8 text-primary-foreground flex flex-col md:flex-row md:items-center gap-4 justify-between">
    <div>
      <h3 className="text-xl md:text-2xl font-extrabold">{title}</h3>
      <p className="mt-1 opacity-90">{text}</p>
    </div>
    <a href={`${VALUTA_URL}/?utm_source=sito&utm_medium=banner&utm_campaign=${campaign}`} target="_blank" rel="noopener noreferrer"
      onClick={() => trackCtaClick("Valuta casa gratis")}
      className="shrink-0 rounded-lg bg-background px-6 py-3 text-center font-bold text-primary hover:bg-muted transition-colors">
      Valuta casa gratis
    </a>
  </aside>
);

export default AcquisitionBanner;
