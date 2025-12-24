import { MessageCircle, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import novaLogo from "@/assets/nova-logo.png";

const SUPPORT_USERNAME = "Nova_AI_Support";
const CHANNEL_USERNAME = "nova_ai_shop";

const ShopFooter = () => {
  return (
    <footer className="relative pt-20 pb-8 border-t border-border/50">
      {/* CTA Section */}
      <div className="container mx-auto px-4 mb-16">
        <div className="glass rounded-3xl p-8 md:p-12 text-center relative overflow-hidden">
          {/* Glow Effect */}
          <div className="absolute inset-0 bg-gradient-glow opacity-30" />
          
          <div className="relative z-10">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              سوالی دارید؟
            </h3>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              تیم پشتیبانی ما ۲۴ ساعته آماده پاسخگویی به سوالات شماست. برای مشاوره رایگان و انتخاب بهترین پلن، همین الان پیام بدید!
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                size="lg"
                className="bg-gradient-primary hover:opacity-90 transition-opacity"
                onClick={() => window.open(`https://t.me/${SUPPORT_USERNAME}`, "_blank")}
              >
                <MessageCircle className="w-5 h-5 ml-2" />
                پیام به پشتیبانی
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-primary/50 hover:bg-primary/10"
                onClick={() => window.open(`https://t.me/${CHANNEL_USERNAME}`, "_blank")}
              >
                <Send className="w-5 h-5 ml-2" />
                عضویت در کانال
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer Content */}
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img src={novaLogo} alt="Nova AI Shop" className="w-10 h-10 rounded-xl object-cover" />
            <span className="text-xl font-bold">Nova AI Shop</span>
          </Link>
          
          {/* Links */}
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <a
              href={`https://t.me/${CHANNEL_USERNAME}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              کانال تلگرام
            </a>
            <a
              href={`https://t.me/${SUPPORT_USERNAME}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              پشتیبانی
            </a>
          </div>
          
          {/* Copyright */}
          <p className="text-sm text-muted-foreground">
            © ۱۴۰۴ Nova AI Shop - تمامی حقوق محفوظ است
          </p>
        </div>
      </div>
    </footer>
  );
};

export default ShopFooter;
