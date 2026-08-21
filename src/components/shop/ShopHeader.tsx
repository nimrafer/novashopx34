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
  Sun,
  Moon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "next-themes";
import { useState, useRef, useEffect } from "react";
import novaLogo from "@/assets/nova-logo.webp";

const CHANNEL_USERNAME = "Nova_Ai_Shop";

interface ServiceItem {
  name: string;
  nameEn: string;
  description: string;
  href: string;
  icon: string;
  color: string;
}

const services: ServiceItem[] = [
  { name: "چت جی پی تی", nameEn: "ChatGPT", description: "پلن‌های Plus، Go و Team — اشتراکی و اختصاصی", href: "/services/chatgpt", icon: "/logos/chatgpt.svg", color: "text-green-600" },
  { name: "جمینای", nameEn: "Gemini", description: "Google AI Pro — آفر ۱۲ و ۱۸ ماهه با گارانتی", href: "/services/gemini", icon: "/logos/gemini-2025.svg", color: "text-blue-600" },
  { name: "کلود", nameEn: "Claude", description: "Claude Pro — بهترین برای کدنویسی", href: "/services/claude", icon: "/logos/claude.webp", color: "text-violet-600" },
  { name: "گراک", nameEn: "Grok", description: "SuperGrok و X Premium از xAI", href: "/services/grok", icon: "/logos/grok.svg", color: "text-slate-700" },
  { name: "کرسور", nameEn: "Cursor", description: "ادیتور کدنویسی هوش مصنوعی", href: "/services/cursor", icon: "/logos/cursor.svg", color: "text-indigo-600" },
  { name: "پرپلکسیتی", nameEn: "Perplexity", description: "جستجوی هوشمند با ذکر منبع", href: "/services/perplexity", icon: "/logos/perplexity.svg", color: "text-cyan-600" },
  { name: "اسپاتیفای", nameEn: "Spotify", description: "موسیقی بدون تبلیغ و آفلاین", href: "/services/spotify", icon: "/logos/spotify.svg", color: "text-emerald-600" },
  { name: "تلگرام پریمیوم", nameEn: "Telegram", description: "بدون نیاز به ورود به اکانت شما", href: "/services/telegram-premium", icon: "/logos/telegram.svg", color: "text-sky-600" },
];

const ShopHeader = () => {
  const { user, signOut } = useAuth();
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const isAdmin = !!user?.isAdmin;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 14);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Touch devices have no mouseleave: close the services menu on any tap
  // outside it, and on Escape for keyboards.
  useEffect(() => {
    const closeOnOutside = (event: MouseEvent | TouchEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsServicesOpen(false);
      }
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsServicesOpen(false);
    };
    document.addEventListener("pointerdown", closeOnOutside);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutside);
      document.removeEventListener("keydown", closeOnEscape);
    };
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
      className={`nv-glass-header fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "is-scrolled border-b border-border shadow-sm" : "border-b border-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="h-[72px] flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 min-w-max">
            <img
              src={novaLogo}
              alt="Nova AI Shop"
              width={44}
              height={44}
              loading="eager"
              decoding="async"
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
                type="button"
                aria-expanded={isServicesOpen}
                aria-haspopup="menu"
                onClick={() => setIsServicesOpen((prev) => !prev)}
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
                        <span className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center overflow-hidden shrink-0">
                          <img src={service.icon} alt="" width={24} height={24} loading="lazy" className="w-6 h-6 object-contain" />
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

            <Link to="/about" className="px-3 py-2 rounded-full text-sm text-muted-foreground hover:text-foreground hover:bg-secondary">
              درباره ما
            </Link>
            <Link to="/blog" className="px-3 py-2 rounded-full text-sm text-muted-foreground hover:text-foreground hover:bg-secondary">
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
              size="icon"
              className="rounded-full w-9 h-9"
              aria-label="تغییر تم روشن/تیره"
              onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            >
              {mounted && resolvedTheme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="rounded-full"
              onClick={() => window.open(`https://t.me/${CHANNEL_USERNAME}`, "_blank")}
            >
              <MessageCircle className="w-4 h-4 ml-2" />
              کانال
            </Button>

            <Button variant="ghost" size="sm" asChild className="rounded-full">
              <Link to="/orders">
                <LayoutList className="w-4 h-4 ml-2" />
                پنل کاربری
              </Link>
            </Button>

            {user ? (
              <>
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

          <div className="lg:hidden flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              aria-label="تغییر تم روشن/تیره"
              onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            >
              {mounted && resolvedTheme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>

        {isMobileMenuOpen && (
          // absolute (not fixed): the header's backdrop-filter makes it the
          // containing block for fixed children, which collapsed this panel
          // to a 1px sliver on phones.
          <div
            className="lg:hidden absolute top-full left-0 right-0 bg-background/95 backdrop-blur-xl z-40 overflow-y-auto border-t border-border"
            style={{ height: "calc(100dvh - 72px)" }}
          >
            <div className="p-4 space-y-6">
              <div className="grid grid-cols-2 gap-3">
                {services.map((service) => (
                  <Link
                    key={service.href}
                    to={service.href}
                    className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-card border border-border"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span className="w-11 h-11 rounded-xl bg-secondary flex items-center justify-center overflow-hidden">
                      <img src={service.icon} alt="" width={28} height={28} loading="lazy" className="w-7 h-7 object-contain" />
                    </span>
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
                <Link to="/about" className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-secondary" onClick={() => setIsMobileMenuOpen(false)}>
                  <Info className="w-5 h-5 text-muted-foreground" />
                  <span className="font-medium">درباره ما</span>
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
                  <img src="/logos/visa.svg" alt="" width={20} height={20} className="w-5 h-5 object-contain" />
                  <span className="font-medium">کارت ارزی</span>
                </Link>
                <Link to="/services/virtual-number" className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-secondary" onClick={() => setIsMobileMenuOpen(false)}>
                  <Phone className="w-5 h-5 text-muted-foreground" />
                  <span className="font-medium">شماره مجازی</span>
                </Link>

                <Link to="/orders" className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-secondary" onClick={() => setIsMobileMenuOpen(false)}>
                  <LayoutList className="w-5 h-5 text-muted-foreground" />
                  <span className="font-medium">پنل کاربری</span>
                </Link>

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
