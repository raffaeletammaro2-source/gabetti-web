import { useState } from "react";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { splitName, trackLead } from "@/lib/tracking";
import type { Property } from "@/lib/properties";

const schema = z.object({
  name: z.string().trim().min(2, "Inserisci il tuo nome").max(120),
  email: z.string().trim().email("Email non valida").max(255),
  phone: z.string().trim().max(30).optional(),
  message: z.string().trim().max(2000).optional(),
});

export const ContactForm = ({ property, initialType = "info", onDone }: { property: Property; initialType?: "info" | "visita"; onDone?: () => void }) => {
  const [type, setType] = useState<"info" | "visita">(initialType);
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: `Sono interessato a ${property.title}. Vorrei ricevere maggiori informazioni.`, date: "" });
  const [privacy, setPrivacy] = useState(false);
  const [sending, setSending] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) return toast.error(parsed.error.issues[0].message);
    if (!privacy) return toast.error("Devi accettare la privacy policy");
    setSending(true);
    const { error } = await supabase.from("leads").insert({
      property_id: property.id, name: parsed.data.name, email: parsed.data.email,
      phone: parsed.data.phone || null, message: parsed.data.message || null, type,
      visit_date: type === "visita" && form.date ? form.date : null,
    });
    setSending(false);
    if (error) return toast.error("Invio non riuscito, riprova.");
    trackLead({
      form_name: type === "visita" ? "compra_prenota_visita" : "compra_richiesta_info",
      lead_category: "acquisto",
      lead_type: type,
      project: property.id,
      user: { email: parsed.data.email, phone: parsed.data.phone, ...splitName(parsed.data.name) },
    });
    toast.success("Richiesta inviata! Ti ricontatteremo a breve.");
    onDone?.();
  };

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm({ ...form, [k]: e.target.value });

  return (
    <form onSubmit={submit} className="space-y-3">
      <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label="Tipo di richiesta">
        {(["info", "visita"] as const).map((t) => (
          <button key={t} type="button" role="radio" aria-checked={type === t} onClick={() => setType(t)}
            className={`rounded-lg border py-2 text-sm font-semibold transition-colors ${type === t ? "border-primary bg-primary text-primary-foreground" : "border-border text-foreground hover:border-primary"}`}>
            {t === "info" ? "Richiedi info" : "Prenota visita"}
          </button>
        ))}
      </div>
      <div><Label htmlFor="c-name">Nome e cognome</Label><Input id="c-name" value={form.name} onChange={set("name")} maxLength={120} required /></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div><Label htmlFor="c-email">Email</Label><Input id="c-email" type="email" value={form.email} onChange={set("email")} maxLength={255} required /></div>
        <div><Label htmlFor="c-phone">Telefono</Label><Input id="c-phone" type="tel" value={form.phone} onChange={set("phone")} maxLength={30} /></div>
      </div>
      {type === "visita" && (
        <div><Label htmlFor="c-date">Data preferita</Label><Input id="c-date" type="date" min={new Date().toISOString().slice(0, 10)} value={form.date} onChange={set("date")} /></div>
      )}
      <div><Label htmlFor="c-msg">Messaggio</Label><Textarea id="c-msg" rows={4} value={form.message} onChange={set("message")} maxLength={2000} /></div>
      <label className="flex items-start gap-2 text-xs text-muted-foreground">
        <Checkbox checked={privacy} onCheckedChange={(v) => setPrivacy(v === true)} aria-label="Accetto la privacy policy" className="mt-0.5" />
        <span>Acconsento al trattamento dei dati secondo la <a href="/privacy-policy" target="_blank" className="underline text-primary">Privacy Policy</a> (GDPR).</span>
      </label>
      <Button type="submit" className="w-full font-bold" disabled={sending}>{sending ? "Invio…" : type === "visita" ? "Prenota visita" : "Invia richiesta"}</Button>
    </form>
  );
};

const ContactDialog = ({ property, type, open, onOpenChange }: { property: Property; type: "info" | "visita"; open: boolean; onOpenChange: (o: boolean) => void }) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>{type === "visita" ? "Prenota una visita" : "Richiedi informazioni"}</DialogTitle>
        <DialogDescription>{property.title}</DialogDescription>
      </DialogHeader>
      <ContactForm property={property} initialType={type} onDone={() => onOpenChange(false)} />
    </DialogContent>
  </Dialog>
);

export default ContactDialog;
