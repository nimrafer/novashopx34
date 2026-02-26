import { UserPlus, Search, ShoppingCart, CreditCard, ArrowLeft } from "lucide-react";

const steps = [
    {
        number: "۱",
        title: "ثبت‌نام و ورود",
        titleEn: "Sign Up",
        icon: UserPlus,
        color: "from-blue-500 to-cyan-500",
        glowColor: "blue-500",
    },
    {
        number: "۲",
        title: "جستجو و انتخاب محصول",
        titleEn: "Search & Choose",
        icon: Search,
        color: "from-purple-500 to-pink-500",
        glowColor: "purple-500",
    },
    {
        number: "۳",
        title: "ثبت سفارش در سایت",
        titleEn: "Place Order",
        icon: ShoppingCart,
        color: "from-emerald-500 to-teal-500",
        glowColor: "emerald-500",
    },
    {
        number: "۴",
        title: "پرداخت و تحویل فوری",
        titleEn: "Pay & Receive",
        icon: CreditCard,
        color: "from-amber-500 to-orange-500",
        glowColor: "amber-500",
    },
];

const OrderingSteps = () => {
    return (
        <section className="py-20 relative overflow-hidden">
            {/* Background glow */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />

            <div className="container mx-auto px-4 relative z-10">
                {/* Section Title */}
                <div className="text-center mb-14">
                    <h2 className="text-3xl md:text-4xl font-bold mb-3">
                        <span className="text-gradient">مراحل سفارش محصول</span>
                    </h2>
                    <p className="text-muted-foreground text-lg">Ordering Steps</p>
                </div>

                {/* Steps Container */}
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-4 relative">
                        {/* Connection Line (Desktop only) */}
                        <div className="hidden lg:block absolute top-1/2 left-[12%] right-[12%] h-[2px] -translate-y-1/2 z-0">
                            <div className="w-full h-full bg-gradient-to-r from-blue-500/30 via-purple-500/30 via-emerald-500/30 to-amber-500/30 rounded-full" />
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 via-emerald-500/20 to-amber-500/20 rounded-full blur-sm" />
                        </div>

                        {steps.map((step, index) => {
                            const IconComponent = step.icon;
                            return (
                                <div key={index} className="relative flex flex-col items-center group">
                                    {/* Arrow between steps (mobile: hidden, desktop: shown between items) */}
                                    {index < steps.length - 1 && (
                                        <div className="hidden lg:flex absolute -left-4 top-1/2 -translate-y-1/2 z-20">
                                            <ArrowLeft className="w-5 h-5 text-muted-foreground/40" />
                                        </div>
                                    )}

                                    {/* Step Card */}
                                    <div className="relative z-10 glass rounded-2xl p-6 w-full text-center glass-hover group-hover:border-primary/30 transition-all duration-500">
                                        {/* Glow effect on hover */}
                                        <div className={`absolute -inset-px rounded-2xl bg-gradient-to-br ${step.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500 blur`} />

                                        {/* Step Number Badge */}
                                        <div className={`relative w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:shadow-xl transition-all duration-500`}>
                                            <IconComponent className="w-8 h-8 text-white" />
                                        </div>

                                        {/* Step Number */}
                                        <div className="absolute top-3 right-3">
                                            <span className={`text-xs font-bold px-2 py-1 rounded-full bg-gradient-to-br ${step.color} text-white shadow-sm`}>
                                                {step.number}
                                            </span>
                                        </div>

                                        {/* Title */}
                                        <h3 className="font-bold text-foreground mb-1 text-base">
                                            {step.title}
                                        </h3>
                                        <p className="text-xs text-muted-foreground font-medium" dir="ltr">
                                            {step.titleEn}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default OrderingSteps;
