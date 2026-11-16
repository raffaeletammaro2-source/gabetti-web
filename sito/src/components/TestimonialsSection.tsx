import { Star } from "lucide-react";
import { useEffect, useState, useCallback } from "react";

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const testimonials = [
  { text: "Avevo provato a vendere da solo per 8 mesi senza risultati. Con Gabetti Marano abbiamo trovato l'acquirente in 6 settimane e a un prezzo migliore di quanto chiedessi io.", author: "Marco R.", zone: "Marano" },
  { text: "Professionalità e trasparenza dal primo contatto. La valutazione era precisa, niente promesse irrealistiche. Consigliato.", author: "Anna T.", zone: "Giugliano" },
  { text: "Mi ha colpito che non mi abbiano mai messo pressione. Mi hanno mandato il report, ho avuto tempo di pensarci, e poi ho deciso io di affidarmi a loro.", author: "Giuseppe L.", zone: "Frattamaggiore" },
  { text: "Venduta casa in meno di un mese! Il team di Gabetti Villaricca è stato eccezionale, sempre disponibili e precisi in ogni passaggio.", author: "Lucia D.", zone: "Villaricca" },
  { text: "Dopo due agenzie che non concludevano nulla, mi sono affidato a Gabetti Mugnano. Risultato? Vendita chiusa in 40 giorni al prezzo richiesto.", author: "Salvatore M.", zone: "Mugnano" },
  { text: "Ottima esperienza. Dalla valutazione alla firma dal notaio tutto è filato liscio. Personale competente e molto umano.", author: "Francesca P.", zone: "Giugliano" },
  { text: "Li ho scelti per la trasparenza. Nessuna sorpresa, nessun costo nascosto. Il prezzo di vendita è stato addirittura superiore alla valutazione iniziale.", author: "Antonio C.", zone: "Frattamaggiore" },
  { text: "Consiglio Gabetti a chiunque debba vendere casa nella zona nord di Napoli. Serietà e risultati concreti.", author: "Rosa V.", zone: "Marano" },
];

const TestimonialsSection = () => {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const getVisibleCount = useCallback(() => {
    if (typeof window === "undefined") return 3;
    if (window.innerWidth < 768) return 1;
    if (window.innerWidth < 1024) return 2;
    return 3;
  }, []);

  const [visibleCount, setVisibleCount] = useState(getVisibleCount);

  useEffect(() => {
    const handleResize = () => setVisibleCount(getVisibleCount());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [getVisibleCount]);

  const maxIndex = testimonials.length - visibleCount;

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 4000);
    return () => clearInterval(timer);
  }, [isPaused, maxIndex]);

  return (
    <section className="bg-muted md:py-14 py-[50px] my-0">
      <div className="container">
        <h2 className="text-2xl md:text-4xl font-extrabold text-center mb-10">Cosa dicono i nostri clienti</h2>
        <div
          className="overflow-hidden"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${current * (100 / visibleCount)}%)` }}
          >
            {testimonials.map((t) => (
              <div
                key={t.author}
                className="shrink-0 px-3"
                style={{ width: `${100 / visibleCount}%` }}
              >
                <div className="bg-card rounded-xl p-6 shadow-sm h-full flex flex-col">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <GoogleIcon />
                  </div>
                  <p className="text-sm leading-relaxed text-foreground mb-4 flex-1">"{t.text}"</p>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-bold">{t.author}, <span className="font-normal text-muted-foreground">{t.zone}</span></p>
                    <span className="text-xs text-muted-foreground">Recensione da Google</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Dots */}
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: maxIndex + 1 }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-2 h-2 rounded-full transition-colors ${i === current ? "bg-primary" : "bg-border"}`}
              aria-label={`Vai alla slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
