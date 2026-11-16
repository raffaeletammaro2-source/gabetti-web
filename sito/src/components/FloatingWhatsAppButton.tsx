import { WhatsAppIcon } from "./SocialIcons";
import { trackWhatsAppClick } from "@/lib/tracking";
import { CRM_WHATSAPP as PHONE } from "@/data/agencies";

const FloatingWhatsAppButton = () => {
  const handleClick = () => {
    trackWhatsAppClick(PHONE);
  };

  return (
    <a
      href={PHONE}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chatta su WhatsApp"
      onClick={handleClick}
      className="fixed bottom-4 right-4 z-50 flex items-center justify-center w-14 h-14 bg-[#25D366] rounded-full shadow-lg hover:scale-105 transition-transform"
    >
      <WhatsAppIcon className="w-7 h-7 text-white" />
    </a>
  );
};

export default FloatingWhatsAppButton;
