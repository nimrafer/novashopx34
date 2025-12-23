import { MessageCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const SUPPORT_USERNAME = "Nova_AI_Support";
const CHANNEL_USERNAME = "nova_ai_shop";

const ShopHeader = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">Nova AI Shop</span>
          </a>
          
          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <a href="#services" className="text-muted-foreground hover:text-foreground transition-colors">
              سرویس‌ها
            </a>
            <a href="#chatgpt" className="text-muted-foreground hover:text-foreground transition-colors">
              ChatGPT
            </a>
            <a href="#gemini" className="text-muted-foreground hover:text-foreground transition-colors">
              Gemini
            </a>
            <a href="#spotify" className="text-muted-foreground hover:text-foreground transition-colors">
              Spotify
            </a>
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
