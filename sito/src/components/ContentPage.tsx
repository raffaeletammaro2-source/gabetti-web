import { ReactNode } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SeoHead from "@/components/SeoHead";
import { trackCtaClick } from "@/lib/tracking";

interface Props {
  title: string;
  description: string;
  canonical: string;
  eyebrow: string;
  heading: string;
  intro: string;
  cards: { title: string; text: string }[];
  ctaText: string;
  ctaHref: string;
  children?: ReactNode;
}

const ContentPage = ({ title, description, canonical, eyebrow, heading, intro, cards, ctaText, ctaHref, children }: Props) => (
  <>
    <SeoHead title={title} description={description} canonical={canonical} />
    <Header />
    <main>
      <section className="bg-muted py-14 md:py-20">
        <div className="container max-w-3xl text-center">
          <p className="text-primary font-bold uppercase tracking-wide text-sm mb-3">{eyebrow}</p>
          <h1 className="text-3xl md:text-5xl font-extrabold text-foreground mb-5">{heading}</h1>
          <p className="text-lg text-muted-foreground">{intro}</p>
        </div>
      </section>
      <section className="bg-background py-14">
        <div className="container grid gap-6 md:grid-cols-3">
          {cards.map((c) => (
            <article key={c.title} className="rounded-lg border border-border bg-card p-6">
              <h2 className="text-xl font-bold text-foreground mb-2">{c.title}</h2>
              <p className="text-muted-foreground leading-relaxed">{c.text}</p>
            </article>
          ))}
        </div>
        {children}
      </section>
      <section className="bg-primary py-12">
        <div className="container text-center">
          {ctaHref.startsWith("/") ? (
            <Link to={ctaHref} onClick={() => trackCtaClick(ctaText)} className="inline-block bg-primary-foreground text-primary font-bold py-4 px-8 rounded-lg hover:opacity-90">
              {ctaText}
            </Link>
          ) : (
            <a href={ctaHref} onClick={() => trackCtaClick(ctaText)} className="inline-block bg-primary-foreground text-primary font-bold py-4 px-8 rounded-lg hover:opacity-90">
              {ctaText}
            </a>
          )}
        </div>
      </section>
    </main>
    <Footer />
  </>
);

export default ContentPage;
