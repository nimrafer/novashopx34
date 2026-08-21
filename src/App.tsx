import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import { AuthProvider } from "./hooks/useAuth";
import { PricesProvider } from "./contexts/PricesContext";
import ScrollToTop from "./components/ScrollToTop";

const Index = lazy(() => import("./pages/Index"));
const StoreServicePage = lazy(() => import("./pages/services/StoreServicePage"));
const GeminiServicePage = lazy(() => import("./pages/services/GeminiServicePage"));
const ChatGPTServicePage = lazy(() => import("./pages/services/ChatGPTServicePage"));
const ClaudeServicePage = lazy(() => import("./pages/services/ClaudeServicePage"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Auth = lazy(() => import("./pages/Auth"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const CheckoutPage = lazy(() => import("./pages/store/CheckoutPage"));
const OrderPage = lazy(() => import("./pages/store/OrderPage"));
const OrdersPage = lazy(() => import("./pages/store/OrdersPage"));
const AdminOrders = lazy(() => import("./pages/AdminOrders"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const SupportPage = lazy(() => import("./pages/SupportPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const EnglishHome = lazy(() => import("./pages/EnglishHome"));
const TextAICategoryPage = lazy(() => import("./pages/categories/TextAICategoryPage"));
const MediaAICategoryPage = lazy(() => import("./pages/categories/MediaAICategoryPage"));
const DevAICategoryPage = lazy(() => import("./pages/categories/DevAICategoryPage"));
const GeminiOfferTermsPage = lazy(() => import("./pages/GeminiOfferTermsPage"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <PricesProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ScrollToTop />
            <Suspense
              fallback={
                <div className="min-h-screen flex items-center justify-center bg-background">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
                </div>
              }
            >
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/en" element={<EnglishHome />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/admin/orders" element={<AdminOrders />} />
                <Route path="/checkout/:planId" element={<CheckoutPage />} />
                <Route path="/order/:publicId" element={<OrderPage />} />
                <Route path="/orders" element={<OrdersPage />} />
                <Route path="/services/chatgpt" element={<ChatGPTServicePage />} />
                <Route path="/services/gemini" element={<GeminiServicePage />} />
                <Route path="/services/grok" element={<StoreServicePage slug="grok" />} />
                <Route path="/services/perplexity" element={<StoreServicePage slug="perplexity" />} />
                <Route path="/services/spotify" element={<StoreServicePage slug="spotify" />} />
                <Route path="/services/cursor" element={<StoreServicePage slug="cursor" />} />
                <Route path="/services/claude" element={<ClaudeServicePage />} />
                <Route path="/services/telegram-premium" element={<StoreServicePage slug="telegram-premium" />} />
                <Route path="/services/cards" element={<StoreServicePage slug="cards" />} />
                <Route path="/services/virtual-number" element={<StoreServicePage slug="virtual-number" />} />
                <Route path="/services/:serviceSlug" element={<StoreServicePage />} />
                <Route path="/categories/text-ai" element={<TextAICategoryPage />} />
                <Route path="/categories/media-ai" element={<MediaAICategoryPage />} />
                <Route path="/categories/dev-ai" element={<DevAICategoryPage />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:slug" element={<BlogPost />} />
                <Route path="/support" element={<SupportPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/gemini-offer-terms" element={<GeminiOfferTermsPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </TooltipProvider>
      </PricesProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
