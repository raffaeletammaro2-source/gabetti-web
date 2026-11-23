import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import WhyGabetti from "@/components/WhyGabetti";
import HowItWorks from "@/components/HowItWorks";
import AgenciesSection from "@/components/AgenciesSection";
import BenefitsSection from "@/components/BenefitsSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import FaqSection, { faqs } from "@/components/FaqSection";
import CtaSection from "@/components/CtaSection";
import Footer from "@/components/Footer";
import StickyMobileCta from "@/components/StickyMobileCta";
import SeoHead from "@/components/SeoHead";
import {
  organizationSchema,
  websiteSchema,
  buildFaqSchema,
  reviewsAggregateSchema,
} from "@/lib/seoSchemas";

const VendiCasa = () => (
  <>
    <SeoHead
      title="Valutazione Casa Gratuita Napoli Nord | Gabetti Franchising"
      description="Scopri quanto vale la tua casa a Marano, Mugnano, Giugliano, Villaricca, Qualiano, Frattamaggiore. Valutazione immobiliare gratuita, basata su prezzi reali. Senza impegno."
      canonical="/vendicasa"
      jsonLd={[
        organizationSchema,
        websiteSchema,
        buildFaqSchema(faqs),
        reviewsAggregateSchema(127, 4.9),
      ]}
    />
    <Header />
    <main>
      <HeroSection />
      <WhyGabetti />
      <HowItWorks />
      <AgenciesSection />
      <BenefitsSection />
      
      <TestimonialsSection />
      <FaqSection />
      <CtaSection />
    </main>
    <Footer />
    <StickyMobileCta />
  </>
);

export default VendiCasa;
