import { MessageCircle, User, LogOut, ChevronDown, Sparkles, Bot, Music, Code, Search, Zap, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
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
  { name: "چت جی‌پی‌تی", nameEn: "ChatGPT", description: "هوش مصنوعی OpenAI", href: "/services/chatgpt", icon: "🤖", color: "text-chatgpt" },
  { name: "جمینای", nameEn: "Gemini", description: "هوش مصنوعی گوگل", href: "/services/gemini", icon: "✨", color: "text-gemini" },
  { name: "گراک", nameEn: "Grok", description: "هوش مصنوعی ایکس", href: "/services/grok", icon: "⚡", color: "text-white" },
  { name: "کلود", nameEn: "Claude", description: "هوش مصنوعی Anthropic", href: "/services/claude", icon: "🧠", color: "text-purple-400" },
  { name: "کرسور", nameEn: "Cursor", description: "کدنویسی با AI", href: "/services/cursor", icon: "💻", color: "text-cursor" },
  { name: "پرپلکسیتی", nameEn: "Perplexity", description: "جستجوی هوشمند", href: "/services/perplexity", icon: "🔍", color: "text-perplexity" },
  { name: "اسپاتیفای", nameEn: "Spotify", description: "موسیقی نامحدود", href: "/services/spotify", icon: "🎵", color: "text-spotify" },
  { name: "تلگرام پریمیوم", nameEn: "Telegram", description: "امکانات ویژه", href: "/services/telegram-premium", icon: "📱", color: "text-telegram" },
];

const ShopHeader = () => {
  const { user, signOut } = useAuth();
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

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
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img src={novaLogo} alt="Nova AI Shop" className="w-10 h-10 rounded-xl object-cover" />
            <span className="text-xl font-bold">Nova AI Shop</span>
          </Link>
          
          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center gap-1">
            {/* Services Dropdown */}
            <div 
              ref={dropdownRef}
              className="relative"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <button 
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all"
              >
                <Sparkles className="w-4 h-4" />
                <span>سرویس‌ها</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isServicesOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {/* Dropdown Menu */}
              {isServicesOpen && (
                <div 
                  className="absolute top-full right-0 mt-2 w-80 glass rounded-2xl border border-border/50 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200"
                >
                  <div className="p-2">
                    <div className="text-xs text-muted-foreground px-3 py-2 font-medium">خدمات هوش مصنوعی</div>
                    {services.map((service) => (
                      <Link
                        key={service.href}
                        to={service.href}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-muted/50 transition-colors group"
                        onClick={() => setIsServicesOpen(false)}
                      >
                        <span className="text-xl">{service.icon}</span>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-foreground group-hover:text-primary transition-colors">{service.name}</span>
                            <span className={`text-xs ${service.color} opacity-70`}>{service.nameEn}</span>
                          </div>
                          <span className="text-xs text-muted-foreground">{service.description}</span>
                        </div>
                      </Link>
                    ))}
                    <div className="border-t border-border/50 mt-2 pt-2">
                      <Link
                        to="/services/cards"
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-muted/50 transition-colors"
                        onClick={() => setIsServicesOpen(false)}
                      >
                        <span className="text-xl">💳</span>
                        <div className="flex-1">
                          <span className="font-medium text-foreground">کارت‌های بین‌المللی</span>
                          <span className="text-xs text-muted-foreground block">ویزا و مسترکارت</span>
                        </div>
                      </Link>
                      <Link
                        to="/services/virtual-number"
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-muted/50 transition-colors"
                        onClick={() => setIsServicesOpen(false)}
                      >
                        <span className="text-xl">📞</span>
                        <div className="flex-1">
                          <span className="font-medium text-foreground">شماره مجازی</span>
                          <span className="text-xs text-muted-foreground block">انگلیس، آمریکا، کانادا</span>
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Link 
              to="/services/chatgpt"
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all"
            >
              <Bot className="w-4 h-4 text-chatgpt" />
              <span>ChatGPT</span>
            </Link>
            
            <Link 
              to="/services/gemini"
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all"
            >
              <Sparkles className="w-4 h-4 text-gemini" />
              <span>Gemini</span>
            </Link>
            
            <Link 
              to="/blog"
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all"
            >
              <span>📝</span>
              <span>بلاگ</span>
            </Link>
          </nav>
          
          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="hidden sm:flex"
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
                  className="hidden sm:flex"
                >
                  <Link to="/dashboard">
                    <User className="w-4 h-4 ml-2" />
                    پنل
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => signOut()}
                  className="hidden sm:flex"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </>
            ) : (
              <Button
                variant="outline"
                size="sm"
                asChild
                className="hidden sm:flex"
              >
                <Link to="/auth">
                  <User className="w-4 h-4 ml-2" />
                  ورود
                </Link>
              </Button>
            )}
            
            <Button
              className="bg-gradient-primary hover:opacity-90 transition-opacity"
              size="sm"
              onClick={() => window.open(`https://t.me/${SUPPORT_USERNAME}`, "_blank")}
            >
              <MessageCircle className="w-4 h-4 ml-1.5" />
              <span className="hidden sm:inline">پشتیبانی</span>
              <span className="sm:hidden">چت</span>
            </Button>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border/50 animate-in slide-in-from-top-2">
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground px-3 py-2 font-medium">سرویس‌های AI</div>
              {services.slice(0, 6).map((service) => (
                <Link
                  key={service.href}
                  to={service.href}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-muted/50 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="text-lg">{service.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{service.name}</span>
                      <span className={`text-xs ${service.color} opacity-70`}>{service.nameEn}</span>
                    </div>
                  </div>
                </Link>
              ))}
              <div className="border-t border-border/50 my-2" />
              <Link
                to="/blog"
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-muted/50 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span className="text-lg">📝</span>
                <span className="font-medium">بلاگ</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default ShopHeader;
