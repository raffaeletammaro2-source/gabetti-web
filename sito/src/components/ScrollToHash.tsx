import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/** Con la navigazione interna di React i link tipo /vendicasa#form-section non scorrono da soli: lo fa questo componente. */
const ScrollToHash = () => {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
      return;
    }
    const id = decodeURIComponent(hash.slice(1));
    let tries = 0;
    const t = window.setInterval(() => {
      const el = document.getElementById(id);
      if (el || ++tries > 20) {
        window.clearInterval(t);
        el?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 50);
    return () => window.clearInterval(t);
  }, [pathname, hash]);
  return null;
};

export default ScrollToHash;
