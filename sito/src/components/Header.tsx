import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Heart, Menu, X } from "lucide-react";
import { useFavorites } from "@/lib/favorites";
import logo from "@/assets/gabetti-logo.png";
import { WhatsAppIcon, InstagramIcon, FacebookIcon } from "./SocialIcons";
import { trackWhatsAppClick } from "@/lib/tracking";
import { useCompraEnabled } from "@/lib/siteSettings";

const NAV = [
  { to: "/", label: "Vendi" },
  { to: "/compra", label: "Compra" },
  { to: "/nuove-costruzioni", label: "Nuove Costruzioni" },
  { to: "/servizi", label: "I servizi" },
  { to: "/lavora-con-noi", label: "Lavora con noi" },
];

const linkCls = ({ isActive }: { isActive: boolean }) =>
  `font-semibold text-sm transition-colors hover:text-primary ${isActive ? "text-primary" : "text-foreground"}`;

const Header = () => {
  const [open, setOpen] = useState(false);
  const favCount = useFavorites().length;
  const { data: compraOn = true } = useCompraEnabled();
  const guard = (to: string) => (e: React.MouseEvent) => { if (to === "/compra" && !compraOn) e.preventDefault(); };
  const fav = (
    <Link to="/preferiti" aria-label={`Preferiti (${favCount})`} className="relative p-2 text-foreground hover:text-primary">
      <Heart className="w-5 h-5" />
      {favCount > 0 && <span className="absolute -right-0.5 -top-0.5 min-w-[18px] rounded-full bg-primary px-1 text-center text-[11px] font-bold leading-[18px] text-primary-foreground">{favCount}</span>}
    </Link>
  );
  return (
    <header className="bg-background z-50 border-b-2 border-primary relative">
      <div className="container flex items-center justify-between py-3">
        <Link to="/" aria-label="Home">
          <img src={logo} alt="Gabetti Franchising" className="h-14 md:h-20 w-auto object-contain" />
        </Link>
        <nav className="hidden md:flex items-center gap-6" aria-label="Menu principale">
          {NAV.map((n) => (
            <NavLink key={n.to} to={n.to} end className={linkCls} onClick={guard(n.to)}>{n.label}</NavLink>
          ))}
        </nav>
        <div className="hidden md:flex items-center gap-4">
          {fav}
          <a href="https://wa.me/390000000000" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"
            onClick={() => trackWhatsAppClick("https://wa.me/390000000000")} className="hover:opacity-80 transition-opacity">
            <WhatsAppIcon className="w-5 h-5 text-[#25D366]" />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:opacity-80 transition-opacity">
            <InstagramIcon className="w-5 h-5 text-[#E4405F]" />
          </a>
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="hover:opacity-80 transition-opacity">
            <FacebookIcon className="w-5 h-5 text-[#1877F2]" />
          </a>
        </div>
        <div className="md:hidden flex items-center">{fav}
        <button type="button" className="md:hidden p-2 text-foreground" aria-label="Apri menu" aria-expanded={open} onClick={() => setOpen(!open)}>
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button></div>
      </div>
      {open && (
        <nav className="md:hidden border-t border-border bg-background" aria-label="Menu mobile">
          <ul className="container flex flex-col py-3">
            {NAV.map((n) => (
              <li key={n.to}>
                <NavLink to={n.to} end className={linkCls} onClick={(e) => { guard(n.to)(e); setOpen(false); }}>
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
