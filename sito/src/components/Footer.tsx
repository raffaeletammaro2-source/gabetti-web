import { Link } from "react-router-dom";
import logo from "@/assets/gabetti-logo.png";
import { WhatsAppIcon, InstagramIcon, FacebookIcon } from "./SocialIcons";
import { cities } from "@/data/cities";
import { trackWhatsAppClick, trackCtaClick } from "@/lib/tracking";

const Footer = () => (
  <footer className="bg-secondary py-12">
    <div className="container">
      <div className="grid md:grid-cols-3 gap-8 mb-8 text-secondary-foreground/90">
        <div className="text-center md:text-left">
          <img src={logo} alt="Gabetti Franchising — Agenzie immobiliari Napoli nord" className="h-12 w-auto object-contain mx-auto md:mx-0 mb-4 brightness-0 invert" loading="lazy" />
          <p className="text-sm leading-relaxed text-secondary-foreground/70">
            Gabetti Franchising Gruppo ADG. 5 agenzie immobiliari nell'area nord di Napoli per la valutazione gratuita e la vendita della tua casa.
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
            <li><a href="/#come-funziona" className="hover:underline">Come funziona</a></li>
            <li><a href="/#faq" className="hover:underline">Domande frequenti</a></li>
            <li><a href="/#form-section" onClick={() => trackCtaClick("Richiedi valutazione gratuita")} className="hover:underline">Richiedi valutazione gratuita</a></li>
          </ul>
          <div className="flex justify-center md:justify-start gap-4 mt-5">
            <a href="https://wa.me/390000000000" target="_blank" rel="noopener noreferrer" aria-label="Contattaci su WhatsApp" onClick={() => trackWhatsAppClick("https://wa.me/390000000000")} className="text-secondary-foreground/70 hover:text-secondary-foreground transition-colors">
              <WhatsAppIcon className="w-5 h-5" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram Gabetti" className="text-secondary-foreground/70 hover:text-secondary-foreground transition-colors">
              <InstagramIcon className="w-5 h-5" />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook Gabetti" className="text-secondary-foreground/70 hover:text-secondary-foreground transition-colors">
              <FacebookIcon className="w-5 h-5" />
            </a>
          </div>
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
