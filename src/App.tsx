import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
import ScrollToTop from "./components/ScrollToTop";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import ChatGPTPage from "./pages/services/ChatGPTPage";
import GeminiPage from "./pages/services/GeminiPage";
import GrokPage from "./pages/services/GrokPage";
import ClaudePage from "./pages/services/ClaudePage";
import PerplexityPage from "./pages/services/PerplexityPage";
import SpotifyPage from "./pages/services/SpotifyPage";
import CursorPage from "./pages/services/CursorPage";
import TelegramPremiumPage from "./pages/services/TelegramPremiumPage";
import CardsPage from "./pages/services/CardsPage";
import VirtualNumberPage from "./pages/services/VirtualNumberPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/services/chatgpt" element={<ChatGPTPage />} />
            <Route path="/services/gemini" element={<GeminiPage />} />
            <Route path="/services/grok" element={<GrokPage />} />
            <Route path="/services/claude" element={<ClaudePage />} />
            <Route path="/services/perplexity" element={<PerplexityPage />} />
            <Route path="/services/spotify" element={<SpotifyPage />} />
            <Route path="/services/cursor" element={<CursorPage />} />
            <Route path="/services/telegram-premium" element={<TelegramPremiumPage />} />
            <Route path="/services/cards" element={<CardsPage />} />
            <Route path="/services/virtual-number" element={<VirtualNumberPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
