import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Plan {
  name: string;
  duration: string;
  price: number;
  features?: string[];
  popular?: boolean;
}

interface ServiceCardProps {
  id: string;
  logo?: string;
  emoji?: string;
  title: string;
  description: string;
  color: string;
  plans: Plan[];
  features?: string[];
  badge?: string;
  discount?: number;
}

const formatPrice = (price: number) => {
  if (price === 0) return "تماس بگیرید";
  return new Intl.NumberFormat("fa-IR").format(price / 1000);
};

const serviceRoutes: Record<string, string> = {
  chatgpt: "/services/chatgpt",
  gemini: "/services/gemini",
  grok: "/services/grok",
  claude: "/services/claude",
  perplexity: "/services/perplexity",
  spotify: "/services/spotify",
  cursor: "/services/cursor",
  telegram: "/services/telegram-premium",
  cards: "/services/cards",
  vnum: "/services/virtual-number",
};

const ServiceCard = ({
  id,
  logo,
  emoji,
  title,
  description,
  color,
  plans,
  badge,
  discount,
}: ServiceCardProps) => {
  // Get the lowest price from plans
  const lowestPrice = Math.min(...plans.map((p) => p.price));
  const originalPrice = discount ? Math.round(lowestPrice / (1 - discount / 100)) : null;

  return (
    <Link 
      to={serviceRoutes[id] || "/"} 
      className="group relative rounded-2xl overflow-hidden transition-all duration-500 ease-out hover:scale-[1.02] hover:shadow-2xl hover:shadow-primary/10 block cursor-pointer"
      title={`اطلاعات بیشتر و خرید ${title}`}
    >
      {/* Discount Badge */}
      {discount && (
        <div className="absolute top-3 right-3 z-20">
          <Badge className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            تخفیف {discount}٪
          </Badge>
        </div>
      )}

      {/* Badge (Popular, New, etc.) */}
      {badge && !discount && (
        <div className="absolute top-3 right-3 z-20">
          <Badge className="bg-gradient-primary text-white text-xs font-bold px-2 py-1 rounded-full">
            {badge}
          </Badge>
        </div>
      )}

      {/* Top Section - Logo Area */}
      <div
        className="relative h-48 flex items-center justify-center overflow-hidden transition-all duration-500 ease-out group-hover:brightness-110"
        style={{
          background: `linear-gradient(135deg, ${color}30 0%, ${color}60 50%, ${color}40 100%)`,
        }}
      >
        {/* Glow Effect */}
        <div
          className="absolute inset-0 opacity-50 transition-opacity duration-500 group-hover:opacity-70"
          style={{
            background: `radial-gradient(circle at center, ${color}40 0%, transparent 70%)`,
          }}
        />

        {/* Logo */}
        <div className="relative z-10 w-24 h-24 rounded-2xl bg-background/20 backdrop-blur-sm flex items-center justify-center shadow-xl border border-white/10 transition-all duration-500 ease-out group-hover:scale-110 group-hover:shadow-2xl group-hover:bg-background/30">
          {logo ? (
            <img src={logo} alt={title} className="w-16 h-16 object-contain transition-transform duration-500 ease-out group-hover:scale-105" />
          ) : emoji ? (
            <span className="text-5xl transition-transform duration-500 ease-out group-hover:scale-110">{emoji}</span>
          ) : null}
        </div>
      </div>

      {/* Bottom Section - Info Area */}
      <div className="bg-card/80 backdrop-blur-sm p-4 border-t border-border/30">
        {/* Title & Description */}
        <h3 className="font-bold text-foreground mb-1 line-clamp-1">{title}</h3>
        <p className="text-sm text-muted-foreground mb-3 line-clamp-1">{description}</p>

        {/* Price Section */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col items-start">
            {originalPrice && (
              <span className="text-xs text-muted-foreground line-through">
                {formatPrice(originalPrice)} هزار تومان
              </span>
            )}
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-bold" style={{ color }}>
                {formatPrice(lowestPrice)}
              </span>
              <span className="text-xs text-muted-foreground">هزار تومان</span>
            </div>
            <span className="text-xs text-muted-foreground">قیمت از</span>
          </div>

          <Button
            size="sm"
            variant="outline"
            className="rounded-full border-border/50 bg-background/50 hover:bg-background transition-all"
          >
            مشاهده
          </Button>
        </div>
      </div>
    </Link>
  );
};

export default ServiceCard;
