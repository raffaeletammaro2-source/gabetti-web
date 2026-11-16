import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import FloatingWhatsAppButton from "@/components/FloatingWhatsAppButton";
import CookieBanner from "@/components/CookieBanner";
import Index from "./pages/Index.tsx";
import ThankYou from "./pages/ThankYou.tsx";
import LocalLanding from "./pages/LocalLanding.tsx";
import NuoveCostruzioni from "./pages/NuoveCostruzioni.tsx";
import LavoraConNoi from "./pages/LavoraConNoi.tsx";
import Servizi from "./pages/Servizi.tsx";
import NotFound from "./pages/NotFound.tsx";
import Compra from "./pages/Compra.tsx";
import PropertyDetail from "./pages/PropertyDetail.tsx";
import Preferiti from "./pages/Preferiti.tsx";
import Admin from "./pages/Admin.tsx";
import ResetPassword from "./pages/ResetPassword.tsx";
import PrivacyPolicy from "./pages/PrivacyPolicy.tsx";
import CookiePolicy from "./pages/CookiePolicy.tsx";
import { captureAttribution } from "@/lib/attribution";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => { captureAttribution(); }, []);
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/grazie" element={<ThankYou />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/cookie-policy" element={<CookiePolicy />} />
            <Route path="/nuove-costruzioni" element={<NuoveCostruzioni />} />
            <Route path="/lavora-con-noi" element={<LavoraConNoi />} />
            <Route path="/servizi" element={<Servizi />} />
            <Route path="/compra" element={<Compra />} />
            <Route path="/compra/:citta" element={<Compra />} />
            <Route path="/compra/:citta/:zona" element={<Compra />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/preferiti" element={<Preferiti />} />
            <Route path="/immobile/:slugid" element={<PropertyDetail />} />
            <Route path="/:slug" element={<LocalLanding />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <FloatingWhatsAppButton />
          <CookieBanner />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
