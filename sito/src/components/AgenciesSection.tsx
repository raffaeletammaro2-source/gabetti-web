import { MapPin } from "lucide-react";
import { WhatsAppIcon, InstagramIcon, FacebookIcon } from "./SocialIcons";
import { trackWhatsAppClick } from "@/lib/tracking";
import { agencies } from "@/data/agencies";

const GoogleIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className}>
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);



const SocialLink = ({ href, label, children, onClick }: { href: string; label: string; children: React.ReactNode; onClick?: () => void }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={label}
    onClick={onClick}
    className="hover:opacity-80 transition-opacity"
  >
    {children}
  </a>
);

const AgenciesSection = () => (
  <section className="bg-background py-10 md:py-14">
    <div className="container text-center">
      <h2 className="text-2xl md:text-4xl font-extrabold mb-3">5 agenzie Gabetti al tuo servizio</h2>
      <p className="text-muted-foreground mb-10 max-w-2xl mx-auto">
        Siamo presenti capillarmente nell'area a nord di Napoli per offrirti il consulente più vicino a casa tua.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {agencies.map((a) => (
          <div key={a.name} className="bg-muted rounded-xl p-5 flex flex-col items-center gap-2">
            <MapPin className="w-8 h-8 text-primary" />
            <span className="font-bold text-sm">{a.name}</span>
            <span className="text-xs text-muted-foreground">{a.area}</span>
            <div className="flex items-center gap-3 mt-3 pt-3 border-t border-border w-full justify-center">
              <SocialLink href={a.whatsapp} label={`WhatsApp ${a.name}`} onClick={() => trackWhatsAppClick(a.whatsapp)}>
                <WhatsAppIcon className="w-5 h-5 text-[#25D366]" />
              </SocialLink>
              {a.instagram && (
                <SocialLink href={a.instagram} label={`Instagram ${a.name}`}>
                  <InstagramIcon className="w-5 h-5 text-[#E4405F]" />
                </SocialLink>
              )}
              <SocialLink href={a.facebook} label={`Facebook ${a.name}`}>
                <FacebookIcon className="w-5 h-5 text-[#1877F2]" />
              </SocialLink>
              <SocialLink href={a.google} label={`Google ${a.name}`}>
                <GoogleIcon className="w-5 h-5" />
              </SocialLink>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default AgenciesSection;
