import MultiStepForm from "./MultiStepForm";

const badges = [
  "+500 immobili venduti in zona",
  "5 agenzie sul territorio",
  "Valutazione 100% gratuita",
];

const whatsappMessages = [
  {
    name: "Marco R.",
    time: "09:42",
    text: "Andrea grazie mille!! Non ci speravo più, 8 mesi da solo e niente.. voi in 6 settimane avete chiuso 🙏🙏",
  },
  {
    name: "Anna T.",
    time: "14:15",
    text: "Gianni buongiorno! Volevo ringraziarti ancora per tutto, sei stato gentilissimo e super disponibile. Mio marito è rimasto colpito 😊",
  },
  {
    name: "Giuseppe L.",
    time: "11:30",
    text: "Fabio io e mia moglie volevamo ringraziarti, sei un professionista serio e super meticoloso. Grazie al tuo operato abbiamo venduto al prezzo giusto di mercato, anzi anche superiore rispetto alle nostre aspettative. Grazie Ancora😉",
  },
  {
    name: "Laura S.",
    time: "16:05",
    text: "Dario ti scrivo x ringraziarti,  non ci credo ancora che siamo riusciti a vendere la nostra casa in tempi così brevi, senza rotture di scatole e soprattutto ad un prezzo che non ci aspettavamo proprio. 🎉🎉 grazie di cuore",
  },
  {
    name: "Roberto M.",
    time: "10:22",
    text: "Enzo buongiorno, volevo dirti che ci siamo trovati benissimo. Mai una pressione, sempre chiari. Vi consiglierò sicuramente 👍",
  },
];

const WhatsAppBubble = ({
  name,
  time,
  text,
  className,
  style,
}: {
  name: string;
  time: string;
  text: string;
  className?: string;
  style?: React.CSSProperties;
}) => (
  <div
    className={`bg-[#dcf8c6] rounded-xl px-3.5 py-2.5 shadow-md max-w-[280px] border border-[#c6e9ac] ${className ?? ""}`}
    style={style}
  >
    <p className="text-[12px] font-bold text-[#075e54] mb-0.5">{name}</p>
    <p className="text-[13px] text-[#303030] leading-snug">{text}</p>
    <div className="flex items-center justify-end gap-1 mt-1">
      <span className="text-[10px] text-[#8a8a8a]">{time}</span>
      <svg width="16" height="11" viewBox="0 0 16 11" fill="none" className="text-[#53bdeb]">
        <path d="M11.071.653a.457.457 0 0 0-.304-.102.493.493 0 0 0-.381.178L6.12 5.683 4.16 3.723a.46.46 0 0 0-.329-.142.457.457 0 0 0-.33.142l-.468.462a.46.46 0 0 0-.14.33c0 .126.046.234.14.33l2.606 2.606a.46.46 0 0 0 .312.152.504.504 0 0 0 .39-.178l4.83-5.27a.46.46 0 0 0 .127-.317.457.457 0 0 0-.152-.33l-.475-.455z" fill="currentColor"/>
        <path d="M14.757.653a.457.457 0 0 0-.305-.102.493.493 0 0 0-.38.178L9.806 5.683 9.26 5.1l-.447.488 1.063 1.063a.46.46 0 0 0 .312.152.504.504 0 0 0 .39-.178l4.83-5.27a.46.46 0 0 0 .127-.317.457.457 0 0 0-.152-.33l-.475-.455z" fill="currentColor"/>
      </svg>
    </div>
  </div>
);

const HeroSection = () => (
  <section id="form-section" className="bg-background py-8 md:py-16">
    <div className="container">
      <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-start">
        <div>
          <h1 className="text-[2.25rem] leading-tight md:text-[3.5rem] md:leading-[1.1] font-extrabold text-foreground mb-4">
            Scopri quanto vale <span className="text-primary">davvero</span> la tua casa nella tua zona
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-6 leading-relaxed">
            Valutazione gratuita basata sui prezzi reali di vendita degli ultimi 6 mesi nel tuo quartiere. Senza impegno, senza chiamate insistenti.
          </p>
          <div className="flex flex-wrap gap-3 mb-8">
            {badges.map((b) => (
              <span key={b} className="inline-flex items-center gap-1.5 bg-muted px-3 py-1.5 rounded-full text-sm font-medium text-foreground">
                <span className="text-primary">✓</span> {b}
              </span>
            ))}
          </div>
          <div className="hidden md:block relative h-[420px]">
            <WhatsAppBubble
              {...whatsappMessages[0]}
              className="absolute"
              style={{ top: 0, left: 0, transform: "rotate(-3deg)" }}
            />
            <WhatsAppBubble
              {...whatsappMessages[1]}
              className="absolute"
              style={{ top: 20, right: 0, transform: "rotate(2deg)" }}
            />
            <WhatsAppBubble
              {...whatsappMessages[2]}
              className="absolute"
              style={{ top: 140, left: 30, transform: "rotate(1.5deg)" }}
            />
            <WhatsAppBubble
              {...whatsappMessages[3]}
              className="absolute"
              style={{ top: 180, right: 20, transform: "rotate(-2deg)" }}
            />
            <WhatsAppBubble
              {...whatsappMessages[4]}
              className="absolute"
              style={{ top: 310, left: 10, transform: "rotate(-1deg)" }}
            />
          </div>
        </div>
        <div>
          <MultiStepForm />
        </div>
      </div>
    </div>
  </section>
);

export default HeroSection;
