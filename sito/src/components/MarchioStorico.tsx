import { useState } from "react";

/**
 * Simbolo ufficiale "Marchio Storico di interesse nazionale" (registro MIMIT, Gabetti iscritto dal 14/01/2021).
 * Il file ufficiale va messo in sito/public/img/marchio-storico.png (o .svg, cambiando SRC):
 * finché manca, si vede solo la scritta.
 */
const SRC = "/img/marchio-storico.png";

const MarchioStorico = ({ light = false, className = "" }: { light?: boolean; className?: string }) => {
  const [hasImg, setHasImg] = useState(true);
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      {hasImg && (
        <img
          src={SRC}
          alt="Marchio Storico di interesse nazionale"
          className="h-16 w-auto shrink-0 object-contain md:h-20"
          loading="lazy"
          onError={() => setHasImg(false)}
        />
      )}
      <p className={`text-sm leading-snug ${light ? "text-white/80" : "text-muted-foreground"}`}>
        <span className={`block font-semibold uppercase tracking-[0.15em] ${light ? "text-white" : "text-foreground"}`}>
          Marchio Storico
        </span>
        di interesse nazionale
      </p>
    </div>
  );
};

export default MarchioStorico;
