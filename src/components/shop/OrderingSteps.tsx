import { Search, ListChecks, CreditCard, BadgeCheck, ArrowLeft } from "lucide-react";

/** Four-step ordering flow — mirrors the real checkout journey (no signup). */
const steps = [
    {
        number: "۱",
        title: "انتخاب محصول",
        description: "سرویس موردنظر را از فروشگاه باز کنید و پلن‌های فعال آن را ببینید.",
        icon: Search,
    },
    {
        number: "۲",
        title: "انتخاب پلن",
        description: "مدت و ظرفیت مناسب را با قیمت شفاف و بدون هزینه پنهان انتخاب کنید.",
        icon: ListChecks,
    },
    {
        number: "۳",
        title: "پرداخت مرکزی",
        description: "بدون نیاز به ثبت‌نام، مبلغ دقیق را در سامانه مرکزی نوا پرداخت کنید.",
        icon: CreditCard,
    },
    {
        number: "۴",
        title: "تأیید و تحویل",
        description: "پرداخت خودکار بررسی می‌شود و سفارش بلافاصله وارد مرحله تحویل می‌شود.",
        icon: BadgeCheck,
    },
];

const OrderingSteps = () => {
    return (
        <section className="py-20" aria-labelledby="ordering-steps-title">
            <div className="container mx-auto px-4">
                <div className="max-w-2xl mx-auto text-center mb-12">
                    <h2 id="ordering-steps-title" className="text-3xl md:text-4xl font-black text-foreground mb-4">
                        مراحل سفارش محصول
                    </h2>
                    <p className="text-muted-foreground leading-8">
                        از انتخاب تا تحویل، چهار گام شفاف — بدون نیاز به ساخت حساب کاربری.
                    </p>
                </div>

                <ol className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 list-none" dir="rtl">
                    {steps.map((step, index) => {
                        const Icon = step.icon;
                        const isLast = index === steps.length - 1;
                        return (
                            <li key={step.number} className="relative group">
                                <div className="h-full rounded-2xl bg-card border border-border/70 p-6 transition-all duration-300 group-hover:border-accent/40 group-hover:shadow-[0_24px_48px_-32px_hsl(165_52%_33%/0.45)]">
                                    <div className="flex items-center justify-between mb-5">
                                        <span className="w-12 h-12 rounded-xl bg-accent/10 text-accent flex items-center justify-center transition-colors duration-300 group-hover:bg-accent group-hover:text-accent-foreground">
                                            <Icon className="w-6 h-6" aria-hidden="true" />
                                        </span>
                                        <span className="text-sm font-bold text-muted-foreground" aria-hidden="true">
                                            گام {step.number}
                                        </span>
                                    </div>
                                    <h3 className="font-bold text-foreground text-lg mb-2">{step.title}</h3>
                                    <p className="text-sm text-muted-foreground leading-7">{step.description}</p>
                                </div>

                                {/* Flow arrow toward the next step (desktop, RTL: forward = left).
                                    A fixed-height badge aligned with the icon row — card heights vary
                                    with copy length, so centering on the card made every arrow sit at
                                    a different visual line. */}
                                {!isLast && (
                                    <span
                                        className="hidden lg:flex absolute w-9 h-9 items-center justify-center rounded-full bg-card border border-border/70 shadow-sm text-accent z-10"
                                        style={{ left: -26, top: 30 }}
                                        aria-hidden="true"
                                    >
                                        <ArrowLeft className="w-4 h-4" />
                                    </span>
                                )}
                            </li>
                        );
                    })}
                </ol>
            </div>
        </section>
    );
};

export default OrderingSteps;
