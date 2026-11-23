import { Link } from "react-router-dom";
import logo from "@/assets/gabetti-logo.png";
import { WhatsAppIcon, InstagramIcon, FacebookIcon } from "./SocialIcons";
import { cities } from "@/data/cities";
import { agencies, CRM_WHATSAPP } from "@/data/agencies";
import { trackWhatsAppClick, trackCtaClick } from "@/lib/tracking";

const Footer = () => (
  <footer className="bg-secondary py-12">
    <div className="container">
      <div className="grid md:grid-cols-3 gap-8 mb-8 text-secondary-foreground/90">
        <div className="text-center md:text-left">
          <img src={logo} alt="Gabetti Franchising — Gruppo ADG" className="h-12 w-auto object-contain mx-auto md:mx-0 mb-4 brightness-0 invert" loading="lazy" />
          <p className="text-sm leading-relaxed text-secondary-foreground/70">
            Gabetti Franchising Gruppo ADG: agenzie immobiliari per la valutazione gratuita e la vendita della tua casa.
          </p>
        </div>
        <div className="text-center md:text-left">
          <h3 className="font-bold mb-3 text-sm uppercase tracking-wide">Valutazione casa per zona</h3>
          <ul className="grid grid-cols-2 gap-y-1.5 text-sm text-secondary-foreground/75">
            {cities.map((c) => (
              <li key={c.slug}>
                <Link to={`/${c.slug}`} className="hover:underline hover:text-secondary-foreground">
                  Valutazione {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="text-center md:text-left">
          <h3 className="font-bold mb-3 text-sm uppercase tracking-wide">Link utili</h3>
          <ul className="space-y-1.5 text-sm text-secondary-foreground/75">
            <li><a href="/vendicasa#come-funziona" className="hover:underline">Come funziona</a></li>
            <li><a href="/vendicasa#faq" className="hover:underline">Domande frequenti</a></li>
            <li><a href="/vendicasa#form-section" onClick={() => trackCtaClick("Richiedi valutazione gratuita")} className="hover:underline">Richiedi valutazione gratuita</a></li>
          </ul>
          <a href={CRM_WHATSAPP} target="_blank" rel="noopener noreferrer" onClick={() => trackWhatsAppClick(CRM_WHATSAPP)}
            className="inline-flex items-center gap-2 mt-5 text-sm font-semibold text-secondary-foreground/90 hover:text-secondary-foreground">
            <WhatsAppIcon className="w-5 h-5" /> Scrivici su WhatsApp
          </a>
          <h3 className="font-bold mt-6 mb-3 text-sm uppercase tracking-wide">Le nostre agenzie</h3>
          <ul className="space-y-2 text-sm text-secondary-foreground/75">
            {agencies.map((a) => (
              <li key={a.name} className="flex items-center justify-center md:justify-start gap-3">
                <span className="min-w-0 flex-1 md:flex-none md:w-44 truncate text-left">{a.name.replace("Gabetti ", "")}</span>
                <a href={a.whatsapp} target="_blank" rel="noopener noreferrer" aria-label={`WhatsApp ${a.name}`} onClick={() => trackWhatsAppClick(a.whatsapp)} className="text-secondary-foreground/70 hover:text-secondary-foreground transition-colors"><WhatsAppIcon className="w-4 h-4" /></a>
                {a.instagram && <a href={a.instagram} target="_blank" rel="noopener noreferrer" aria-label={`Instagram ${a.name}`} className="text-secondary-foreground/70 hover:text-secondary-foreground transition-colors"><InstagramIcon className="w-4 h-4" /></a>}
                <a href={a.facebook} target="_blank" rel="noopener noreferrer" aria-label={`Facebook ${a.name}`} className="text-secondary-foreground/70 hover:text-secondary-foreground transition-colors"><FacebookIcon className="w-4 h-4" /></a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-secondary-foreground/10 pt-5 text-center">
        <div className="flex flex-wrap justify-center gap-4 text-xs text-secondary-foreground/60 mb-2">
          <Link to="/privacy-policy" className="hover:underline">Privacy Policy</Link>
          <Link to="/cookie-policy" className="hover:underline">Cookie Policy</Link>
          <button
            type="button"
            onClick={() => window.dispatchEvent(new CustomEvent("open-cookie-settings"))}
            className="hover:underline"
          >
            Preferenze cookie
          </button>
        </div>
        <p className="text-xs text-secondary-foreground/50">© 2026 Gabetti Franchising — Gruppo ADG. Tutti i diritti riservati.</p>
      </div>
    </div>
  </footer>
);

export default Footer;
