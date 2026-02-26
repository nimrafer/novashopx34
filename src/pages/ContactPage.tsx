import { Mail, MessageCircle, MapPin, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ShopHeader from "@/components/shop/ShopHeader";
import ShopFooter from "@/components/shop/ShopFooter";
import SEOHead from "@/components/seo/SEOHead";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import supportImage from "@/assets/telegram-support.jpg";
import { CHANNEL_USERNAME, SUPPORT_USERNAME } from "@/constants/support";

const ContactPage = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const { toast } = useToast();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Open telegram with the message pre-filled
        const text = encodeURIComponent(`نام: ${name}\nایمیل: ${email}\n\nپیام:\n${message}`);
        window.open(`https://t.me/${SUPPORT_USERNAME}?text=${text}`, "_blank");
        toast({
            title: "پیام ارسال شد",
            description: "در حال انتقال به تلگرام پشتیبانی...",
        });
    };

    return (
        <>
            <SEOHead
                title="تماس با ما | نوا شاپ"
                description="راه‌های ارتباط با تیم نوا شاپ. ایمیل، تلگرام و فرم تماس."
                keywords="تماس با نوا شاپ, ارتباط با ما, contact"
                canonicalUrl="/contact"
            />
            <div className="min-h-screen bg-background">
                <ShopHeader />
                <main className="pt-24 pb-16">
                    <div className="container mx-auto px-4">
                        {/* Page Title */}
                        <div className="text-center mb-16">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6">
                                <Mail className="w-4 h-4 text-primary" />
                                <span className="text-sm text-muted-foreground">ارتباط با ما</span>
                            </div>
                            <h1 className="text-3xl md:text-5xl font-bold mb-4">
                                <span className="text-gradient">تماس با ما</span>
                            </h1>
                            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                                ما همیشه مشتاق شنیدن نظرات و سوالات شما هستیم
                            </p>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
                            {/* Contact Info */}
                            <div className="space-y-6">
                                <div className="glass rounded-2xl p-4">
                                    <img
                                        src={supportImage}
                                        alt="تصویر پیوی پشتیبانی تلگرام"
                                        className="w-full rounded-xl border border-border object-cover"
                                    />
                                    <p className="text-xs text-muted-foreground mt-3">
                                        برای ارتباط فوری، از دکمه‌های پشتیبانی تلگرام استفاده کنید.
                                    </p>
                                </div>

                                <div className="glass rounded-2xl p-6 glass-hover">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                                            <Mail className="w-6 h-6 text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg">ایمیل</h3>
                                            <a href="mailto:admin@nova-shop.co" className="text-sm text-muted-foreground hover:text-primary transition-colors" dir="ltr">
                                                admin@nova-shop.co
                                            </a>
                                        </div>
                                    </div>
                                </div>

                                <div className="glass rounded-2xl p-6 glass-hover">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-telegram/20 flex items-center justify-center flex-shrink-0">
                                            <MessageCircle className="w-6 h-6 text-telegram" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg">پشتیبانی تلگرام</h3>
                                            <a
                                                href={`https://t.me/${SUPPORT_USERNAME}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-sm text-muted-foreground hover:text-telegram transition-colors"
                                                dir="ltr"
                                            >
                                                @{SUPPORT_USERNAME}
                                            </a>
                                        </div>
                                    </div>
                                </div>

                                <div className="glass rounded-2xl p-6 glass-hover">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center flex-shrink-0">
                                            <Send className="w-6 h-6 text-green-500" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg">کانال تلگرام</h3>
                                            <a
                                                href={`https://t.me/${CHANNEL_USERNAME}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-sm text-muted-foreground hover:text-green-500 transition-colors"
                                                dir="ltr"
                                            >
                                                @{CHANNEL_USERNAME}
                                            </a>
                                        </div>
                                    </div>
                                </div>

                                <div className="glass rounded-2xl p-6 glass-hover">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center flex-shrink-0">
                                            <MapPin className="w-6 h-6 text-orange-500" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg">موقعیت</h3>
                                            <p className="text-sm text-muted-foreground">
                                                تهران، خیابان انقلاب، خیابان ۱۹ آذر - پلاک ۳۱
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Contact Form */}
                            <div className="glass rounded-3xl p-8">
                                <h2 className="text-xl font-bold mb-6">ارسال پیام</h2>
                                <form onSubmit={handleSubmit} className="space-y-5">
                                    <div className="space-y-2">
                                        <Label htmlFor="name" className="text-foreground">نام شما</Label>
                                        <Input
                                            id="name"
                                            type="text"
                                            placeholder="نام و نام خانوادگی"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="bg-secondary/50 border-border"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="contactEmail" className="text-foreground">ایمیل</Label>
                                        <Input
                                            id="contactEmail"
                                            type="email"
                                            placeholder="example@email.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="bg-secondary/50 border-border"
                                            dir="ltr"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="message" className="text-foreground">پیام</Label>
                                        <textarea
                                            id="message"
                                            placeholder="پیام خود را بنویسید..."
                                            value={message}
                                            onChange={(e) => setMessage(e.target.value)}
                                            className="flex min-h-[120px] w-full rounded-md border border-border bg-secondary/50 px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
                                            required
                                        />
                                    </div>
                                    <Button
                                        type="submit"
                                        className="w-full bg-gradient-primary hover:opacity-90 py-6"
                                    >
                                        <Send className="w-5 h-5 ml-2" />
                                        ارسال پیام
                                    </Button>
                                </form>
                            </div>
                        </div>
                    </div>
                </main>
                <ShopFooter />
            </div>
        </>
    );
};

export default ContactPage;
