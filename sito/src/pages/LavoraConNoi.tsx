import { useState, FormEvent } from "react";
import { Link } from "react-router-dom";
import { GraduationCap, Users, TrendingUp, KeyRound, CheckCircle2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SeoHead from "@/components/SeoHead";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { supabase } from "@/integrations/supabase/client";
import teamImg from "@/assets/lavora-con-noi.jpg";

const benefits = [
  { icon: GraduationCap, title: "Formazione continua", text: "Programmi di formazione di livello nazionale per affinare le tue abilità e restare aggiornato sul mercato." },
  { icon: Users, title: "Supporto professionale", text: "Lavori fianco a fianco con professionisti esperti, condividi esperienze e impari dai migliori." },
  { icon: TrendingUp, title: "Opportunità di crescita", text: "Da agente di successo a responsabile di agenzia: nel Gruppo Gabetti c'è spazio per crescere." },
  { icon: KeyRound, title: "Un marchio di prestigio", text: "Gabetti è sinonimo di eccellenza: entri in una squadra fondata su integrità, professionalità e dedizione." },
];

const EXPERIENCES = ["No", "Sì - da meno di 2 anni", "Sì - da più di 2 anni"];

const LavoraConNoi = () => {
  const [form, setForm] = useState({ name: "", phone: "", email: "", experience: "", letter: "", website: "" });
  const [gdpr, setGdpr] = useState(false);
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [k]: e.target.value });

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    if (form.website) return; // honeypot anti-spam
    if (!form.name.trim() || !form.phone.trim() || !form.email.trim() || !form.experience || !form.letter.trim()) {
      setError("Compila tutti i campi obbligatori.");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(form.email)) { setError("Inserisci un'email valida."); return; }
    if (!gdpr) { setError("Devi acconsentire al trattamento dei dati personali."); return; }
    setSending(true);
    const id = `job_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    const { error: err } = await supabase.functions.invoke("send-transactional-email", {
      body: {
        templateName: "job-application-admin",
        recipientEmail: "candidature@gabetti-adg.it",
        idempotencyKey: id,
        templateData: {
          name: form.name.trim(), phone: form.phone.trim(), email: form.email.trim(),
          experience: form.experience, letter: form.letter.trim().slice(0, 5000),
          submittedAt: new Date().toLocaleString("it-IT"),
        },
      },
    });
    if (!err) {
      supabase.functions.invoke("send-transactional-email", {
        body: {
          templateName: "job-application-confirmation",
          recipientEmail: form.email.trim(),
          idempotencyKey: `${id}-confirm`,
          templateData: { name: form.name.trim().split(" ")[0] },
        },
      }).catch((e) => console.error("Confirmation email error", e));
    }
    setSending(false);
    if (err) { setError("Si è verificato un errore. Riprova tra poco."); return; }
    (window as any).dataLayer = (window as any).dataLayer || [];
    (window as any).dataLayer.push({ event: "job_application_submitted", form_name: "lavora_con_noi" });
    setSent(true);
  };

  return (
    <>
      <SeoHead
        title="Lavora con noi | Diventa agente immobiliare Gabetti Napoli Nord"
        description="Unisciti al Gruppo Gabetti: formazione continua, supporto professionale e crescita nelle agenzie dell'Area Nord di Napoli. Candidati ora."
        canonical="/lavora-con-noi"
      />
      <Header />
      <main>
        <section className="bg-muted py-14 md:py-20">
          <div className="container grid gap-10 md:grid-cols-2 items-center">
            <div>
              <p className="text-primary font-bold uppercase tracking-wide text-sm mb-3">Lavora con noi</p>
              <h1 className="text-3xl md:text-5xl font-extrabold text-foreground mb-5">Unisciti a noi!</h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Diventare agente immobiliare è solo l'inizio del tuo percorso con il Gruppo Gabetti. Entrare in una realtà consolidata
                come la nostra è il trampolino di lancio ideale per una carriera di successo nel settore immobiliare.
              </p>
              <a href="#candidati" className="mt-8 inline-block bg-primary text-primary-foreground font-bold py-4 px-8 rounded-lg hover:opacity-90">
                Candidati ora
              </a>
            </div>
            <img src={teamImg} alt="Team di consulenti immobiliari Gabetti" className="rounded-lg w-full h-auto object-cover" width={1280} height={864} loading="lazy" />
          </div>
        </section>

        <section className="bg-background py-14">
          <div className="container">
            <h2 className="text-2xl md:text-3xl font-extrabold text-foreground mb-8 text-center">Entrare nel Gruppo Gabetti significa avere</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {benefits.map(({ icon: Icon, title, text }) => (
                <article key={title} className="rounded-lg border border-border bg-card p-6">
                  <Icon className="w-8 h-8 text-primary mb-3" aria-hidden />
                  <h3 className="text-lg font-bold text-foreground mb-2">{title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{text}</p>
                </article>
              ))}
            </div>
            <div className="max-w-2xl mx-auto text-center mt-12">
              <h2 className="text-2xl font-extrabold text-foreground mb-3">Fai il primo passo verso un futuro di successi</h2>
              <p className="text-muted-foreground">
                Non importa da dove vieni o quale sia il tuo background: se hai passione, determinazione e voglia di crescere, c'è un posto per te nella nostra squadra.
              </p>
            </div>
          </div>
        </section>

        <section id="candidati" className="bg-muted py-14 scroll-mt-4">
          <div className="container max-w-2xl">
            <div className="bg-card rounded-lg border border-border p-6 md:p-10">
              {sent ? (
                <div className="text-center py-8">
                  <CheckCircle2 className="w-14 h-14 text-primary mx-auto mb-4" aria-hidden />
                  <h2 className="text-2xl font-extrabold text-foreground mb-2">Candidatura inviata!</h2>
                  <p className="text-muted-foreground">Grazie {form.name.split(" ")[0]}, ti ricontatteremo al più presto.</p>
                </div>
              ) : (
                <form onSubmit={onSubmit} noValidate className="space-y-5">
                  <div>
                    <h2 className="text-2xl md:text-3xl font-extrabold text-foreground">Candidati ora!</h2>
                    <p className="text-sm text-muted-foreground mt-1">I campi contrassegnati con * sono obbligatori.</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="job-name">Il tuo nome *</Label>
                    <Input id="job-name" autoComplete="name" maxLength={100} value={form.name} onChange={set("name")} required />
                  </div>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="job-phone">Telefono *</Label>
                      <Input id="job-phone" type="tel" autoComplete="tel" maxLength={20} value={form.phone} onChange={set("phone")} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="job-email">Email *</Label>
                      <Input id="job-email" type="email" autoComplete="email" maxLength={255} value={form.email} onChange={set("email")} required />
                    </div>
                  </div>
                  <fieldset className="space-y-3">
                    <legend className="text-sm font-medium mb-2">Hai già esperienza nel settore immobiliare? *</legend>
                    <RadioGroup value={form.experience} onValueChange={(v) => setForm({ ...form, experience: v })}>
                      {EXPERIENCES.map((x, i) => (
                        <div key={x} className="flex items-center gap-2">
                          <RadioGroupItem id={`exp-${i}`} value={x} />
                          <Label htmlFor={`exp-${i}`} className="font-normal">{x}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </fieldset>
                  <div className="space-y-2">
                    <Label htmlFor="job-letter">Lettera di presentazione *</Label>
                    <Textarea id="job-letter" rows={6} maxLength={5000} value={form.letter} onChange={set("letter")}
                      placeholder="Raccontaci chi sei e perché vuoi lavorare con noi" required />
                  </div>
                  <input type="text" tabIndex={-1} autoComplete="off" value={form.website} onChange={set("website")}
                    className="hidden" aria-hidden="true" />
                  <div className="flex items-start gap-3">
                    <Checkbox id="job-gdpr" checked={gdpr} onCheckedChange={(v) => setGdpr(v === true)} className="mt-1" />
                    <Label htmlFor="job-gdpr" className="font-normal leading-relaxed">
                      Acconsento al trattamento dei dati personali * per le finalità espresse nell'
                      <Link to="/privacy-policy" className="text-primary underline">informativa privacy</Link>.
                    </Label>
                  </div>
                  {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
                  <button type="submit" disabled={sending}
                    className="w-full bg-primary text-primary-foreground font-bold py-4 rounded-lg hover:opacity-90 disabled:opacity-60">
                    {sending ? "Invio in corso..." : "INVIA CANDIDATURA"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default LavoraConNoi;
