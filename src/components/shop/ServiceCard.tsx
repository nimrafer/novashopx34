import { LucideIcon, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Plan {
  name: string;
  duration: string;
  price: number;
  features?: string[];
  popular?: boolean;
}

interface ServiceCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  color: string;
  plans: Plan[];
  features?: string[];
  badge?: string;
}

const SUPPORT_USERNAME = "Nova_AI_Support";

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("fa-IR").format(price / 1000) + " هزار تومان";
};

const ServiceCard = ({
  icon: Icon,
  title,
  description,
  color,
  plans,
  features,
  badge,
}: ServiceCardProps) => {
  const handleOrder = (planName: string) => {
    const message = encodeURIComponent(`سلام! میخوام ${title} - ${planName} رو سفارش بدم.`);
    window.open(`https://t.me/${SUPPORT_USERNAME}?text=${message}`, "_blank");
  };

  return (
    <div className="glass rounded-3xl p-6 md:p-8 glass-hover">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center"
            style={{ backgroundColor: `${color}20` }}
          >
            <Icon className="w-7 h-7" style={{ color }} />
          </div>
          <div>
            <h3 className="text-xl font-bold">{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
        {badge && (
          <Badge className="bg-gradient-primary text-primary-foreground">
            {badge}
          </Badge>
        )}
      </div>

      {/* Features List */}
      {features && features.length > 0 && (
        <ul className="space-y-2 mb-6">
          {features.map((feature, idx) => (
            <li key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
              {feature}
            </li>
          ))}
        </ul>
      )}

      {/* Plans Grid */}
      <div className="grid gap-4">
        {plans.map((plan, idx) => (
          <div
            key={idx}
            className={`relative rounded-2xl p-4 border transition-all ${
              plan.popular
                ? "border-primary bg-primary/5"
                : "border-border/50 bg-secondary/30 hover:border-primary/30"
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-2.5 right-4">
                <Badge className="bg-gradient-primary text-xs">پرفروش</Badge>
              </div>
            )}
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold">{plan.name}</h4>
                <p className="text-sm text-muted-foreground">{plan.duration}</p>
              </div>
              <div className="text-left">
                <div className="font-bold text-lg" style={{ color }}>
                  {formatPrice(plan.price)}
                </div>
              </div>
            </div>
            
            {plan.features && (
              <div className="mt-3 pt-3 border-t border-border/50">
                <ul className="space-y-1">
                  {plan.features.map((f, i) => (
                    <li key={i} className="text-xs text-muted-foreground">• {f}</li>
                  ))}
                </ul>
              </div>
            )}
            
            <Button
              className="w-full mt-4"
              style={{ backgroundColor: color }}
              onClick={() => handleOrder(plan.name)}
            >
              <MessageCircle className="w-4 h-4 ml-2" />
              ثبت سفارش
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServiceCard;
