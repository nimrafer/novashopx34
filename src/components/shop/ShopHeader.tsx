import {
  MessageCircle,
  User,
  LogOut,
  ChevronDown,
  Sparkles,
  Menu,
  X,
  Home,
  Headphones,
  Phone,
  Info,
  LayoutList,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useState, useRef, useEffect } from "react";
import novaLogo from "@/assets/nova-logo.jpeg";

const CHANNEL_USERNAME = "nova_ai_shop";
const ADMIN_EMAILS = String(import.meta.env.VITE_ADMIN_EMAILS || "admin@nova-shop.co")
  .split(",")
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean);

interface ServiceItem {
  name: string;
  nameEn: string;
  description: string;
  href: string;
  icon: string;
  color: string;
}

const services: ServiceItem[] = [
  { name: "چت جی‌پی‌تی", nameEn: "ChatGPT", description: "هوش مصنوعی OpenAI", href: "/services/chatgpt", icon: "🤖", color: "text-green-600" },
  { name: "جمینای", nameEn: "Gemini", description: "هوش مصنوعی گوگل", href: "/services/gemini", icon: "✨", color: "text-blue-600" },
  { name: "گراک", nameEn: "Grok", description: "هوش مصنوعی ایکس", href: "/services/grok", icon: "⚡", color: "text-slate-700" },
  { name: "کرسور", nameEn: "Cursor", description: "کدنویسی با AI", href: "/services/cursor", icon: "💻", color: "text-indigo-600" },
  { name: "پرپلکسیتی", nameEn: "Perplexity", description: "جستجوی هوشمند", href: "/services/perplexity", icon: "🔍", color: "text-cyan-600" },
  { name: "اسپاتیفای", nameEn: "Spotify", description: "موسیقی نامحدود", href: "/services/spotify", icon: "🎵", color: "text-emerald-600" },
  { name: "تلگرام پریمیوم", nameEn: "Telegram", description: "امکانات ویژه", href: "/services/telegram-premium", icon: "📱", color: "text-sky-600" },
];

const ShopHeader = () => {
  const { user, signOut } = useAuth();
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const isAdmin = !!user && ADMIN_EMAILS.includes(user.email.toLowerCase());

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 14);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsServicesOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setIsServicesOpen(false), 130);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/95 backdrop-blur-xl border-b border-border shadow-sm"
          : "bg-background/70 backdrop-blur border-b border-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="h-[72px] flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 min-w-max">
            <img
              src={novaLogo}
              alt="Nova AI Shop"
              className="w-11 h-11 rounded-2xl object-cover border border-border shadow-sm"
            />
            <div>
              <p className="font-black leading-none">Nova AI Shop</p>
              <p className="text-xs text-muted-foreground">Premium AI Subscriptions</p>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            <Link
              to="/"
              className="flex items-center gap-1.5 px-3 py-2 rounded-full text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
            >
              <Home className="w-4 h-4" />
              <span className="font-medium">صفحه اصلی</span>
            </Link>

            <div
              ref={dropdownRef}
              className="relative"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <button
                className={`flex items-center gap-1.5 px-3 py-2 rounded-full transition-all duration-200 text-sm ${
                  isServicesOpen
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span className="font-medium">سرویس‌ها</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isServicesOpen ? "rotate-180" : ""}`} />
              </button>

              {isServicesOpen && (
                <div className="absolute top-full right-0 mt-3 w-[22rem] bg-card rounded-3xl border border-border shadow-xl overflow-hidden">
                  <div className="p-3 space-y-1">
                    <div className="text-xs text-muted-foreground px-3 py-2 font-medium">اشتراک‌های هوش مصنوعی</div>
                    {services.map((service) => (
                      <Link
                        key={service.href}
                        to={service.href}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-2xl hover:bg-secondary transition-colors group"
                        onClick={() => setIsServicesOpen(false)}
                      >
                        <span className="text-xl w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
                          {service.icon}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-foreground group-hover:text-accent transition-colors">{service.name}</span>
                            <span className={`text-[10px] ${service.color} bg-secondary px-1.5 py-0.5 rounded-full`}>{service.nameEn}</span>
                          </div>
                          <span className="text-xs text-muted-foreground line-clamp-1">{service.description}</span>
                        </div>
                      </Link>
                    ))}
                  </div>

                  <div className="p-3 border-t border-border grid grid-cols-2 gap-2 bg-secondary/40">
                    <Link
                      to="/services/cards"
                      className="p-3 rounded-2xl bg-card border border-border text-center font-medium text-sm hover:border-primary/40"
                      onClick={() => setIsServicesOpen(false)}
                    >
                      کارت ارزی
                    </Link>
                    <Link
                      to="/services/virtual-number"
                      className="p-3 rounded-2xl bg-card border border-border text-center font-medium text-sm hover:border-primary/40"
                      onClick={() => setIsServicesOpen(false)}
                    >
                      شماره مجازی
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <Link
              to="/blog"
              className="px-3 py-2 rounded-full text-sm text-muted-foreground hover:text-foreground hover:bg-secondary"
            >
              وبلاگ
            </Link>
            <Link
              to="/support"
              className="px-3 py-2 rounded-full text-sm text-muted-foreground hover:text-foreground hover:bg-secondary"
            >
              پشتیبانی
            </Link>
          </nav>

          <div className="hidden lg:flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="rounded-full"
              onClick={() => window.open(`https://t.me/${CHANNEL_USERNAME}`, "_blank")}
            >
              <MessageCircle className="w-4 h-4 ml-2" />
              کانال
            </Button>

            {user ? (
              <>
                <Button variant="ghost" size="sm" asChild className="rounded-full">
                  <Link to="/dashboard">
                    <LayoutList className="w-4 h-4 ml-2" />
                    پنل کاربری
                  </Link>
                </Button>

                {isAdmin && (
                  <Button variant="outline" size="sm" asChild className="rounded-full border-primary/50">
                    <Link to="/admin/orders">
                      <ShieldCheck className="w-4 h-4 ml-2" />
                      پنل ادمین
                    </Link>
                  </Button>
                )}

                <Button variant="outline" size="icon" onClick={() => signOut()} className="rounded-full w-9 h-9">
                  <LogOut className="w-4 h-4" />
                </Button>
              </>
            ) : (
              <Button
                variant="default"
                size="sm"
                asChild
                className="rounded-full bg-gradient-primary text-primary-foreground hover:opacity-95"
              >
                <Link to="/auth">
                  <User className="w-4 h-4 ml-2" />
                  ورود / ثبت‌نام
                </Link>
              </Button>
            )}
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden rounded-full"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </div>

        {isMobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 top-[72px] bg-background/95 backdrop-blur-xl z-40 overflow-y-auto border-t border-border">
            <div className="p-4 space-y-6">
              <div className="grid grid-cols-2 gap-3">
                {services.map((service) => (
                  <Link
                    key={service.href}
                    to={service.href}
                    className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-card border border-border"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span className="text-2xl">{service.icon}</span>
                    <span className="text-sm font-semibold text-center">{service.name}</span>
                  </Link>
                ))}
              </div>

              <div className="space-y-1 border-t border-border pt-4">
                <Link to="/" className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-secondary" onClick={() => setIsMobileMenuOpen(false)}>
                  <Home className="w-5 h-5 text-muted-foreground" />
                  <span className="font-medium">صفحه اصلی</span>
                </Link>
                <Link to="/blog" className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-secondary" onClick={() => setIsMobileMenuOpen(false)}>
                  <Info className="w-5 h-5 text-muted-foreground" />
                  <span className="font-medium">وبلاگ</span>
                </Link>
                <Link to="/contact" className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-secondary" onClick={() => setIsMobileMenuOpen(false)}>
                  <Phone className="w-5 h-5 text-muted-foreground" />
                  <span className="font-medium">تماس با ما</span>
                </Link>
                <Link to="/support" className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-secondary" onClick={() => setIsMobileMenuOpen(false)}>
                  <Headphones className="w-5 h-5 text-muted-foreground" />
                  <span className="font-medium">پشتیبانی</span>
                </Link>
                <Link to="/services/cards" className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-secondary" onClick={() => setIsMobileMenuOpen(false)}>
                  <span className="text-lg">💳</span>
                  <span className="font-medium">کارت ارزی</span>
                </Link>
                <Link to="/services/virtual-number" className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-secondary" onClick={() => setIsMobileMenuOpen(false)}>
                  <span className="text-lg">📞</span>
                  <span className="font-medium">شماره مجازی</span>
                </Link>

                {user && (
                  <Link to="/dashboard" className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-secondary" onClick={() => setIsMobileMenuOpen(false)}>
                    <LayoutList className="w-5 h-5 text-muted-foreground" />
                    <span className="font-medium">پنل کاربری</span>
                  </Link>
                )}

                {isAdmin && (
                  <Link to="/admin/orders" className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-secondary" onClick={() => setIsMobileMenuOpen(false)}>
                    <ShieldCheck className="w-5 h-5 text-muted-foreground" />
                    <span className="font-medium">پنل ادمین</span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default ShopHeader;
