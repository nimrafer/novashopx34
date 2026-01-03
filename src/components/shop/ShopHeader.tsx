import { MessageCircle, User, LogOut, ChevronDown, Sparkles, Bot, Search, Menu, X, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useState, useRef, useEffect } from "react";
import novaLogo from "@/assets/nova-logo.png";

const SUPPORT_USERNAME = "Nova_AI_Support";
const CHANNEL_USERNAME = "nova_ai_shop";

interface ServiceItem {
  name: string;
  nameEn: string;
  description: string;
  href: string;
  icon: string;
  color: string;
}

const services: ServiceItem[] = [
  { name: "چت جی‌پی‌تی", nameEn: "ChatGPT", description: "هوش مصنوعی OpenAI", href: "/services/chatgpt", icon: "🤖", color: "text-green-500" },
  { name: "جمینای", nameEn: "Gemini", description: "هوش مصنوعی گوگل", href: "/services/gemini", icon: "✨", color: "text-blue-500" },
  { name: "گراک", nameEn: "Grok", description: "هوش مصنوعی ایکس", href: "/services/grok", icon: "⚡", color: "text-gray-200" },
  { name: "کلود", nameEn: "Claude", description: "هوش مصنوعی Anthropic", href: "/services/claude", icon: "🧠", color: "text-orange-500" },
  { name: "کرسور", nameEn: "Cursor", description: "کدنویسی با AI", href: "/services/cursor", icon: "💻", color: "text-blue-400" },
  { name: "پرپلکسیتی", nameEn: "Perplexity", description: "جستجوی هوشمند", href: "/services/perplexity", icon: "🔍", color: "text-teal-500" },
  { name: "اسپاتیفای", nameEn: "Spotify", description: "موسیقی نامحدود", href: "/services/spotify", icon: "🎵", color: "text-green-400" },
  { name: "تلگرام پریمیوم", nameEn: "Telegram", description: "امکانات ویژه", href: "/services/telegram-premium", icon: "📱", color: "text-blue-400" },
];

const ShopHeader = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsServicesOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsServicesOpen(false);
    }, 150);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
        ? "bg-background/80 backdrop-blur-xl border-b border-border/50 shadow-lg"
        : "bg-background/20 backdrop-blur-sm border-b border-transparent"
        }`}
    >
      {/* Animated Gradient Border on Scroll */}
      <div className={`absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent transition-opacity duration-300 ${scrolled ? 'opacity-100' : 'opacity-0'}`} />

      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary to-purple-600 rounded-xl blur opacity-25 group-hover:opacity-75 transition duration-500"></div>
              <img src={novaLogo} alt="Nova AI Shop" className="relative w-10 h-10 rounded-xl object-cover ring-1 ring-border" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
              Nova AI Shop
            </span>
          </Link>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center gap-2">
            {/* Services Dropdown */}
            <div
              ref={dropdownRef}
              className="relative"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <button
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full transition-all duration-300 ${isServicesOpen
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
              >
                <Sparkles className="w-4 h-4" />
                <span className="font-medium">سرویس‌ها</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isServicesOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {isServicesOpen && (
                <div
                  className="absolute top-full right-0 mt-4 w-80 glass rounded-3xl border border-border/50 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 ring-1 ring-white/10"
                >
                  <div className="p-3 space-y-1">
                    <div className="text-xs text-muted-foreground px-3 py-2 font-medium flex items-center gap-2">
                      <Sparkles className="w-3 h-3" />
                      خدمات هوش مصنوعی
                    </div>
                    {services.map((service) => (
                      <Link
                        key={service.href}
                        to={service.href}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-2xl hover:bg-primary/10 transition-colors group"
                        onClick={() => setIsServicesOpen(false)}
                      >
                        <span className="text-xl bg-background/50 w-10 h-10 flex items-center justify-center rounded-xl group-hover:scale-110 transition-transform duration-300 shadow-sm">
                          {service.icon}
                        </span>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-foreground group-hover:text-primary transition-colors">{service.name}</span>
                            <span className={`text-[10px] px-1.5 py-0.5 rounded-full bg-muted/50 ${service.color} opacity-70`}>{service.nameEn}</span>
                          </div>
                          <span className="text-xs text-muted-foreground line-clamp-1">{service.description}</span>
                        </div>
                      </Link>
                    ))}
                  </div>

                  <div className="bg-muted/30 p-3 border-t border-border/50 grid grid-cols-2 gap-2">
                    <Link
                      to="/services/cards"
                      className="flex flex-col items-center justify-center gap-2 p-3 rounded-2xl hover:bg-background/80 transition-colors text-center group"
                      onClick={() => setIsServicesOpen(false)}
                    >
                      <span className="text-2xl group-hover:-translate-y-1 transition-transform duration-300">💳</span>
                      <span className="text-xs font-medium">کارت ارزی</span>
                    </Link>
                    <Link
                      to="/services/virtual-number"
                      className="flex flex-col items-center justify-center gap-2 p-3 rounded-2xl hover:bg-background/80 transition-colors text-center group"
                      onClick={() => setIsServicesOpen(false)}
                    >
                      <span className="text-2xl group-hover:-translate-y-1 transition-transform duration-300">📞</span>
                      <span className="text-xs font-medium">شماره مجازی</span>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <Link
              to="/services/chatgpt"
              className="flex items-center gap-1.5 px-4 py-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all"
            >
              <Bot className="w-4 h-4 text-green-500" />
              <span className="font-medium">ChatGPT</span>
            </Link>

            <Link
              to="/services/gemini"
              className="flex items-center gap-1.5 px-4 py-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all"
            >
              <Sparkles className="w-4 h-4 text-blue-500" />
              <span className="font-medium">Gemini</span>
            </Link>

            <Link
              to="/blog"
              className="flex items-center gap-1.5 px-4 py-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all"
            >
              <span className="text-lg">📝</span>
              <span className="font-medium">بلاگ</span>
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* Search Button (Desktop) */}
            <Button
              variant="ghost"
              size="icon"
              className="hidden md:flex rounded-full hover:bg-muted/50"
              onClick={() => { }} // TODO: Implement search modal
            >
              <Search className="w-5 h-5 text-muted-foreground" />
            </Button>

            <div className="h-6 w-[1px] bg-border/50 hidden md:block" />

            <Button
              variant="ghost"
              size="sm"
              className="hidden sm:flex rounded-full"
              onClick={() => window.open(`https://t.me/${CHANNEL_USERNAME}`, "_blank")}
            >
              <MessageCircle className="w-4 h-4 ml-2" />
              کانال
            </Button>

            {user ? (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  className="hidden sm:flex rounded-full"
                >
                  <Link to="/dashboard">
                    <User className="w-4 h-4 ml-2" />
                    پنل
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => signOut()}
                  className="hidden sm:flex rounded-full w-9 h-9"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </>
            ) : (
              <Button
                variant="default"
                size="sm"
                asChild
                className="hidden sm:flex rounded-full bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20"
              >
                <Link to="/auth">
                  <User className="w-4 h-4 ml-2" />
                  ورود / ثبت‌نام
                </Link>
              </Button>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden rounded-full"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden fixed inset-0 top-16 bg-background/95 backdrop-blur-xl z-40 animate-in slide-in-from-top-5 duration-300 overflow-y-auto">
            <div className="p-4 space-y-6">
              {/* Mobile Search */}
              <div className="relative">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="جستجو در سرویس‌ها..."
                  className="w-full bg-muted/50 border border-border/50 rounded-xl py-3 pr-10 pl-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>

              <div className="space-y-2">
                <div className="text-xs text-muted-foreground px-2 font-medium">سرویس‌های محبوب</div>
                <div className="grid grid-cols-2 gap-3">
                  {services.slice(0, 4).map((service) => (
                    <Link
                      key={service.href}
                      to={service.href}
                      className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-muted/30 border border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <span className="text-2xl">{service.icon}</span>
                      <span className="text-sm font-medium">{service.name}</span>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-xs text-muted-foreground px-2 font-medium mb-2">سایر خدمات</div>
                {services.slice(4).map((service) => (
                  <Link
                    key={service.href}
                    to={service.href}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-muted/50 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span className="text-xl">{service.icon}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{service.name}</span>
                        <span className={`text-xs ${service.color} opacity-70`}>{service.nameEn}</span>
                      </div>
                    </div>
                  </Link>
                ))}
                <Link
                  to="/blog"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-muted/50 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="text-xl">📝</span>
                  <span className="font-medium">وبلاگ آموزشی</span>
                </Link>
              </div>

              <div className="border-t border-border/50 pt-6 space-y-3">
                {!user ? (
                  <Button className="w-full rounded-xl py-6 text-lg shadow-lg shadow-primary/20" asChild>
                    <Link to="/auth" onClick={() => setIsMobileMenuOpen(false)}>
                      ورود به حساب کاربری
                    </Link>
                  </Button>
                ) : (
                  <Button className="w-full rounded-xl py-6" variant="outline" asChild>
                    <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                      پنل کاربری
                    </Link>
                  </Button>
                )}

                <Button
                  variant="ghost"
                  className="w-full rounded-xl text-muted-foreground"
                  onClick={() => window.open(`https://t.me/${SUPPORT_USERNAME}`, "_blank")}
                >
                  <MessageCircle className="w-4 h-4 ml-2" />
                  پشتیبانی آنلاین
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default ShopHeader;
