import { Shield, Zap, Users, Heart, Target, Award } from "lucide-react";
import ShopHeader from "@/components/shop/ShopHeader";
import ShopFooter from "@/components/shop/ShopFooter";
import SEOHead from "@/components/seo/SEOHead";

const AboutPage = () => {
    return (
        <>
            <SEOHead
                title="درباره ما | نوا شاپ"
                description="درباره نوا شاپ - مرجع تخصصی خرید اکانت‌های پریمیوم هوش مصنوعی در ایران."
                keywords="درباره نوا شاپ, about nova shop, فروشگاه هوش مصنوعی"
                canonicalUrl="/about"
            />
            <div className="min-h-screen bg-background">
                <ShopHeader />
                <main className="pt-24 pb-16">
                    <div className="container mx-auto px-4">
                        {/* Page Title */}
                        <div className="text-center mb-16">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6">
                                <Heart className="w-4 h-4 text-primary" />
                                <span className="text-sm text-muted-foreground">آشنایی با ما</span>
                            </div>
                            <h1 className="text-3xl md:text-5xl font-bold mb-4">
                                <span className="text-gradient">درباره نوا شاپ</span>
                            </h1>
                            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                                مرجع تخصصی خرید اکانت‌های پریمیوم هوش مصنوعی در ایران
                            </p>
                        </div>

                        {/* Story Section */}
                        <div className="max-w-4xl mx-auto mb-16">
                            <div className="glass rounded-3xl p-8 md:p-12">
                                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                                    <Target className="w-7 h-7 text-primary" />
                                    داستان ما
                                </h2>
                                <div className="space-y-4 text-muted-foreground leading-8 text-justify">
                                    <p>
                                        <strong className="text-foreground">نوا شاپ</strong> با هدف حذف تحریم‌ها و موانع پرداخت ارزی، بستری امن و مطمئن برای دسترسی کاربران ایرانی به برترین سرویس‌های هوش مصنوعی جهان فراهم کرده است.
                                    </p>
                                    <p>
                                        ما معتقدیم که هر فردی، صرف‌نظر از محدودیت‌های جغرافیایی، حق دسترسی به ابزارهای پیشرفته هوش مصنوعی را دارد. از <strong className="text-foreground">ChatGPT</strong> و <strong className="text-foreground">Gemini</strong> گرفته تا <strong className="text-foreground">Grok</strong>، <strong className="text-foreground">Perplexity</strong> و <strong className="text-foreground">Cursor</strong> — ما سرویس‌ها را با تحویل فوری و گارانتی کامل ارائه می‌دهیم.
                                    </p>
                                    <p>
                                        تیم ما از متخصصان فناوری اطلاعات تشکیل شده که با تعهد به کیفیت و رضایت مشتری، خدمات خود را ارائه می‌دهند. افتخار ما تعداد بالای مشتریان وفادار و رضایت ۹۸٪ خریداران است.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Values */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto mb-16">
                            <div className="glass rounded-2xl p-6 glass-hover group">
                                <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                    <Shield className="w-7 h-7 text-primary" />
                                </div>
                                <h3 className="font-bold text-lg mb-2">اعتماد و امنیت</h3>
                                <p className="text-sm text-muted-foreground">
                                    تمامی اکانت‌ها ۱۰۰٪ قانونی و اصلی هستند و با گارانتی تعویض ارائه می‌شوند
                                </p>
                            </div>

                            <div className="glass rounded-2xl p-6 glass-hover group">
                                <div className="w-14 h-14 rounded-xl bg-telegram/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                    <Zap className="w-7 h-7 text-telegram" />
                                </div>
                                <h3 className="font-bold text-lg mb-2">سرعت بالا</h3>
                                <p className="text-sm text-muted-foreground">
                                    تحویل اکانت‌ها در کمتر از ۱ ساعت و پشتیبانی ۲۴ ساعته
                                </p>
                            </div>

                            <div className="glass rounded-2xl p-6 glass-hover group">
                                <div className="w-14 h-14 rounded-xl bg-green-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                    <Users className="w-7 h-7 text-green-500" />
                                </div>
                                <h3 className="font-bold text-lg mb-2">مشتری‌مداری</h3>
                                <p className="text-sm text-muted-foreground">
                                    رضایت مشتری اولویت اول ماست. مشاوره رایگان قبل از خرید
                                </p>
                            </div>

                            <div className="glass rounded-2xl p-6 glass-hover group">
                                <div className="w-14 h-14 rounded-xl bg-orange-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                    <Award className="w-7 h-7 text-orange-500" />
                                </div>
                                <h3 className="font-bold text-lg mb-2">کیفیت تضمینی</h3>
                                <p className="text-sm text-muted-foreground">
                                    اکانت‌های اختصاصی با بالاترین کیفیت و پایداری
                                </p>
                            </div>

                            <div className="glass rounded-2xl p-6 glass-hover group">
                                <div className="w-14 h-14 rounded-xl bg-purple-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                    <Heart className="w-7 h-7 text-purple-500" />
                                </div>
                                <h3 className="font-bold text-lg mb-2">تنوع محصولات</h3>
                                <p className="text-sm text-muted-foreground">
                                    فروشگاه چندمحصولی با موجودی دائمی از تمامی سرویس‌ها
                                </p>
                            </div>

                            <div className="glass rounded-2xl p-6 glass-hover group">
                                <div className="w-14 h-14 rounded-xl bg-cyan-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                    <Target className="w-7 h-7 text-cyan-500" />
                                </div>
                                <h3 className="font-bold text-lg mb-2">قیمت مناسب</h3>
                                <p className="text-sm text-muted-foreground">
                                    بهترین قیمت‌ها با تخفیف‌های ویژه برای مشتریان وفادار
                                </p>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="max-w-4xl mx-auto">
                            <div className="glass rounded-3xl p-8 md:p-12">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                                    <div className="text-center">
                                        <div className="text-3xl md:text-4xl font-bold text-gradient mb-2">+۵۰۰۰</div>
                                        <div className="text-sm text-muted-foreground">مشتری فعال</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-3xl md:text-4xl font-bold text-gradient mb-2">۹۸٪</div>
                                        <div className="text-sm text-muted-foreground">رضایت مشتری</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-3xl md:text-4xl font-bold text-gradient mb-2">+۱۰</div>
                                        <div className="text-sm text-muted-foreground">سرویس متنوع</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-3xl md:text-4xl font-bold text-gradient mb-2">۲۴/۷</div>
                                        <div className="text-sm text-muted-foreground">پشتیبانی آنلاین</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
                <ShopFooter />
            </div>
        </>
    );
};

export default AboutPage;
