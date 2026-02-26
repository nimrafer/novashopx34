import { MessageCircle, Send, Clock, Shield, Headphones } from "lucide-react";
import { Button } from "@/components/ui/button";
import ShopHeader from "@/components/shop/ShopHeader";
import ShopFooter from "@/components/shop/ShopFooter";
import SEOHead from "@/components/seo/SEOHead";

const SUPPORT_USERNAME = "Nova_AI_Support";
const CHANNEL_USERNAME = "nova_ai_shop";

const SupportPage = () => {
    return (
        <>
            <SEOHead
                title="پشتیبانی | نوا شاپ"
                description="پشتیبانی ۲۴ ساعته نوا شاپ. از طریق تلگرام با تیم پشتیبانی ما در ارتباط باشید."
                keywords="پشتیبانی نوا شاپ, تماس با پشتیبانی, support"
                canonicalUrl="/support"
            />
            <div className="min-h-screen bg-background">
                <ShopHeader />
                <main className="pt-24 pb-16">
                    <div className="container mx-auto px-4">
                        {/* Page Title */}
                        <div className="text-center mb-16">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6">
                                <Headphones className="w-4 h-4 text-primary" />
                                <span className="text-sm text-muted-foreground">پشتیبانی آنلاین</span>
                            </div>
                            <h1 className="text-3xl md:text-5xl font-bold mb-4">
                                <span className="text-gradient">تیم پشتیبانی نوا شاپ</span>
                            </h1>
                            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                                ما ۲۴ ساعته و ۷ روز هفته آماده پاسخگویی به سوالات شما هستیم
                            </p>
                        </div>

                        {/* Support Profile Card */}
                        <div className="max-w-lg mx-auto mb-16">
                            <div className="glass rounded-3xl overflow-hidden group hover:border-primary/30 transition-all duration-500">
                                {/* Profile Header with gradient */}
                                <div className="relative h-32 bg-gradient-to-br from-[#0088cc] via-[#0077b5] to-[#006699] flex items-center justify-center">
                                    <div className="absolute inset-0 bg-gradient-to-br from-telegram/20 to-transparent" />
                                    {/* Telegram logo */}
                                    <svg className="w-16 h-16 text-white/30" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                                    </svg>
                                </div>

                                {/* Profile Info */}
                                <div className="relative px-8 pb-8">
                                    {/* Profile Avatar */}
                                    <div className="relative -mt-12 mb-4 flex justify-center">
                                        <div className="relative">
                                            <div className="absolute -inset-1 bg-gradient-to-r from-telegram to-primary rounded-full blur opacity-50 group-hover:opacity-75 transition duration-500"></div>
                                            <img
                                                src="/support-profile.png"
                                                alt="Nova AI Support"
                                                className="relative w-24 h-24 rounded-full ring-4 ring-background object-cover bg-card"
                                                onError={(e) => {
                                                    const target = e.target as HTMLImageElement;
                                                    target.style.display = 'none';
                                                    const parent = target.parentElement;
                                                    if (parent) {
                                                        const fallback = document.createElement('div');
                                                        fallback.className = 'relative w-24 h-24 rounded-full ring-4 ring-background bg-gradient-to-br from-telegram to-primary flex items-center justify-center';
                                                        fallback.innerHTML = '<span class="text-3xl">🤖</span>';
                                                        parent.appendChild(fallback);
                                                    }
                                                }}
                                            />
                                        </div>
                                    </div>

                                    <div className="text-center space-y-3">
                                        <div>
                                            <h2 className="text-xl font-bold text-foreground flex items-center justify-center gap-2">
                                                Nova AI Support
                                                <span className="flex items-center justify-center w-5 h-5 bg-telegram rounded-full">
                                                    <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                                        <polyline points="20 6 9 17 4 12" />
                                                    </svg>
                                                </span>
                                            </h2>
                                            <p className="text-sm text-telegram font-medium mt-1" dir="ltr">@{SUPPORT_USERNAME}</p>
                                        </div>

                                        <p className="text-sm text-muted-foreground">
                                            پشتیبانی رسمی فروشگاه نوا شاپ
                                        </p>

                                        <div className="flex flex-col gap-3 pt-4">
                                            <Button
                                                size="lg"
                                                className="w-full bg-[#0088cc] hover:bg-[#0077b5] text-white shadow-lg shadow-telegram/20 transition-all duration-300"
                                                onClick={() => window.open(`https://t.me/${SUPPORT_USERNAME}`, "_blank")}
                                            >
                                                <MessageCircle className="w-5 h-5 ml-2" />
                                                شروع چت با پشتیبانی
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="lg"
                                                className="w-full border-primary/50 hover:bg-primary/10"
                                                onClick={() => window.open(`https://t.me/${CHANNEL_USERNAME}`, "_blank")}
                                            >
                                                <Send className="w-5 h-5 ml-2" />
                                                عضویت در کانال تلگرام
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Support Features */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                            <div className="glass rounded-2xl p-6 text-center glass-hover">
                                <div className="w-14 h-14 rounded-xl bg-telegram/20 flex items-center justify-center mx-auto mb-4">
                                    <Clock className="w-7 h-7 text-telegram" />
                                </div>
                                <h3 className="font-bold text-lg mb-2">پاسخگویی سریع</h3>
                                <p className="text-sm text-muted-foreground">
                                    تیم ما معمولاً در کمتر از ۱۰ دقیقه به پیام‌های شما پاسخ می‌دهد
                                </p>
                            </div>

                            <div className="glass rounded-2xl p-6 text-center glass-hover">
                                <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center mx-auto mb-4">
                                    <Shield className="w-7 h-7 text-primary" />
                                </div>
                                <h3 className="font-bold text-lg mb-2">گارانتی خدمات</h3>
                                <p className="text-sm text-muted-foreground">
                                    تمامی خدمات با گارانتی تعویض و بازگشت وجه ارائه می‌شوند
                                </p>
                            </div>

                            <div className="glass rounded-2xl p-6 text-center glass-hover">
                                <div className="w-14 h-14 rounded-xl bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                                    <Headphones className="w-7 h-7 text-green-500" />
                                </div>
                                <h3 className="font-bold text-lg mb-2">مشاوره رایگان</h3>
                                <p className="text-sm text-muted-foreground">
                                    قبل از خرید، مشاوره تخصصی رایگان دریافت کنید
                                </p>
                            </div>
                        </div>
                    </div>
                </main>
                <ShopFooter />
            </div>
        </>
    );
};

export default SupportPage;
