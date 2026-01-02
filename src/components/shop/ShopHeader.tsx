import { MessageCircle, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import novaLogo from "@/assets/nova-logo.png";

const SUPPORT_USERNAME = "Nova_AI_Support";
const CHANNEL_USERNAME = "nova_ai_shop";

const ShopHeader = () => {
  const { user, signOut } = useAuth();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img src={novaLogo} alt="Nova AI Shop" className="w-10 h-10 rounded-xl object-cover" />
            <span className="text-xl font-bold">Nova AI Shop</span>
          </Link>
          
          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/#services" className="text-muted-foreground hover:text-foreground transition-colors">
              سرویس‌ها
            </Link>
            <Link to="/#services" className="text-muted-foreground hover:text-foreground transition-colors">
              ChatGPT
            </Link>
            <Link to="/#services" className="text-muted-foreground hover:text-foreground transition-colors">
              Gemini
            </Link>
            <Link to="/#services" className="text-muted-foreground hover:text-foreground transition-colors">
              Spotify
            </Link>
          </nav>
          
          {/* Actions */}
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              className="hidden sm:flex"
              onClick={() => window.open(`https://t.me/${CHANNEL_USERNAME}`, "_blank")}
            >
              <MessageCircle className="w-4 h-4 ml-2" />
              کانال تلگرام
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
                    پنل کاربری
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => signOut()}
                  className="hidden sm:flex"
                >
                  <LogOut className="w-4 h-4 ml-2" />
                  خروج
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
                  ورود / ثبت‌نام
                </Link>
              </Button>
            )}
            
            <Button
              className="bg-gradient-primary hover:opacity-90 transition-opacity"
              onClick={() => window.open(`https://t.me/${SUPPORT_USERNAME}`, "_blank")}
            >
              <MessageCircle className="w-4 h-4 ml-2" />
              پشتیبانی
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default ShopHeader;
