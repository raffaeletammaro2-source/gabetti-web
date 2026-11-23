import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Heart, Menu, X } from "lucide-react";
import { useFavorites } from "@/lib/favorites";
import logo from "@/assets/gabetti-logo.png";
import { WhatsAppIcon } from "./SocialIcons";
import { CRM_WHATSAPP } from "@/data/agencies";
import { trackWhatsAppClick } from "@/lib/tracking";
import { useCompraEnabled } from "@/lib/siteSettings";

const NAV = [
  { to: "/vendicasa", label: "Vendi" },
  { to: "/compra", label: "Compra" },
  { to: "/nuove-costruzioni", label: "Nuove Costruzioni" },
  { to: "/servizi", label: "I servizi" },
  { to: "/lavora-con-noi", label: "Lavora con noi" },
];

const linkCls = ({ isActive }: { isActive: boolean }) =>
  `font-semibold text-sm transition-colors hover:text-primary ${isActive ? "text-primary" : "text-foreground"}`;
const linkClsLight = ({ isActive }: { isActive: boolean }) =>
  `font-semibold text-sm tracking-wide transition-colors hover:text-white ${isActive ? "text-white" : "text-white/80"}`;

/** overlay: header trasparente sopra il video della home, diventa bianco quando si scorre. */
const Header = ({ overlay = false }: { overlay?: boolean }) => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    if (!overlay) return;
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [overlay]);
  const light = overlay && !scrolled && !open;
  const favCount = useFavorites().length;
  const { data: compraOn } = useCompraEnabled();
  // La voce Compra si vede solo se attivata dall'area admin (impostazione compra_enabled)
  const nav = NAV.filter((n) => n.to !== "/compra" || compraOn === true);
  const fav = (
    <Link to="/preferiti" aria-label={`Preferiti (${favCount})`} className={`relative p-2 hover:text-primary ${light ? "text-white" : "text-foreground"}`}>
      <Heart className="w-5 h-5" />
      {favCount > 0 && <span className="absolute -right-0.5 -top-0.5 min-w-[18px] rounded-full bg-primary px-1 text-center text-[11px] font-bold leading-[18px] text-primary-foreground">{favCount}</span>}
    </Link>
  );
  return (
    <header
      className={
        overlay
          ? `fixed inset-x-0 top-0 z-50 transition-all duration-500 ${light ? "bg-transparent border-b border-white/15" : "bg-background/95 backdrop-blur border-b border-border shadow-sm"}`
          : "bg-background z-50 border-b-2 border-primary relative"
      }
    >
      <div className={`container flex items-center justify-between transition-all duration-500 ${overlay && scrolled ? "py-2" : "py-3"}`}>
        <Link to="/" aria-label="Gabetti Franchising Gruppo ADG — Home">
          <img
            src={logo}
            alt="Gabetti Franchising"
            className={`w-auto object-contain transition-all duration-500 ${light ? "brightness-0 invert" : ""} ${overlay && scrolled ? "h-12 md:h-14" : "h-14 md:h-20"}`}
          />
        </Link>
        <nav className="hidden md:flex items-center gap-6" aria-label="Menu principale">
          {nav.map((n) => (
            <NavLink key={n.to} to={n.to} end className={light ? linkClsLight : linkCls}>{n.label}</NavLink>
          ))}
        </nav>
        <div className="hidden md:flex items-center gap-4">
          {fav}
          <a href={CRM_WHATSAPP} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"
            onClick={() => trackWhatsAppClick(CRM_WHATSAPP)} className="hover:opacity-80 transition-opacity">
            <WhatsAppIcon className="w-5 h-5 text-[#25D366]" />
          </a>
        </div>
        <div className="md:hidden flex items-center">{fav}
        <button type="button" className={`md:hidden p-2 ${light ? "text-white" : "text-foreground"}`} aria-label="Apri menu" aria-expanded={open} onClick={() => setOpen(!open)}>
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button></div>
      </div>
      {open && (
        <nav className="md:hidden border-t border-border bg-background" aria-label="Menu mobile">
          <ul className="container flex flex-col py-3">
            {nav.map((n) => (
              <li key={n.to}>
                <NavLink to={n.to} end className={linkCls} onClick={() => setOpen(false)}>
                  <span className="block py-3">{n.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
};

export default Header;
