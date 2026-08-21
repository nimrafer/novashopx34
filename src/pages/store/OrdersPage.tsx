import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Loader2, ShoppingBag } from "lucide-react";
import ShopHeader from "@/components/shop/ShopHeader";
import ShopFooter from "@/components/shop/ShopFooter";
import SEOHead from "@/components/seo/SEOHead";
import { formatToman } from "@/hooks/useStoreCatalog";
import { ensureNovaSession, novaApi } from "@/lib/novaApi";

/** «سفارش‌های من» for the website — same orders, same session as the mini app. */

interface OrderRow {
  public_id: string;
  status: string;
  total: number;
  created_at: string;
  items: { product_name: string; plan_name: string }[];
}

const STATUS_FA: Record<string, [string, string]> = {
  awaiting_payment: ["در انتظار پرداخت", "bg-amber-100 text-amber-800"],
  payment_review: ["در حال بررسی", "bg-blue-100 text-blue-800"],
  paid: ["پرداخت‌شده", "bg-blue-100 text-blue-800"],
  processing: ["در حال انجام", "bg-blue-100 text-blue-800"],
  fulfilled: ["تکمیل‌شده", "bg-emerald-100 text-emerald-800"],
  cancelled: ["لغوشده", "bg-zinc-200 text-zinc-700"],
};

const OrdersPage = () => {
  const [orders, setOrders] = useState<OrderRow[] | null>(null);

  useEffect(() => {
    ensureNovaSession().then(async () => {
      try {
        const data = await novaApi<{ orders: OrderRow[] }>("/api/v1/orders");
        setOrders(data.orders || []);
      } catch {
        setOrders([]);
      }
    });
  }, []);

  return (
    <>
      <SEOHead title="سفارش‌های من | نوا شاپ" description="پیگیری سفارش‌های شما در نوا شاپ" canonicalUrl="/orders" />
      <div className="nv-scope min-h-screen">
        <ShopHeader />
        <main className="pt-28 md:pt-32 pb-20">
          <div className="container mx-auto px-4 max-w-3xl">
            <h1 className="text-2xl font-black mb-2">سفارش‌های من</h1>
            <p className="text-sm text-muted-foreground mb-8">
              سفارش‌های سایت و مینی‌اپ تلگرام یکجا — با هر تغییری، وضعیت همین‌جا به‌روز می‌شود.
            </p>

            {orders === null && (
              <div className="flex justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-accent" aria-label="در حال بارگذاری" />
              </div>
            )}

            {orders && orders.length === 0 && (
              <div className="rounded-2xl bg-card border border-border/70 p-10 text-center">
                <ShoppingBag className="w-10 h-10 text-muted-foreground mx-auto mb-4" aria-hidden="true" />
                <h2 className="font-black mb-2">هنوز سفارشی ثبت نکرده‌اید</h2>
                <p className="text-sm text-muted-foreground mb-6">از میان سرویس‌های فعال، پلن مناسب‌تان را انتخاب کنید.</p>
                <Link to="/#services" className="inline-block rounded-xl bg-accent text-accent-foreground font-bold px-6 py-3 text-sm">
                  مشاهده سرویس‌ها
                </Link>
              </div>
            )}

            {orders && orders.length > 0 && (
              <div className="space-y-3">
                {orders.map((order) => {
                  const [label, cls] = STATUS_FA[order.status] || [order.status, "bg-zinc-100 text-zinc-700"];
                  const item = order.items[0];
                  return (
                    <Link
                      key={order.public_id}
                      to={`/order/${encodeURIComponent(order.public_id)}`}
                      className="group flex items-center gap-4 rounded-2xl bg-card border border-border/70 p-5 transition-colors hover:border-accent/40"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-bold truncate">{item?.product_name} — {item?.plan_name}</p>
                        <p className="text-xs text-muted-foreground mt-1" dir="ltr">{order.public_id}</p>
                      </div>
                      <span className={`text-xs font-bold rounded-full px-3 py-1.5 shrink-0 ${cls}`}>{label}</span>
                      <b className="text-sm shrink-0">{formatToman(order.total)} تومان</b>
                      <ArrowLeft className="w-4 h-4 text-muted-foreground group-hover:text-accent shrink-0" aria-hidden="true" />
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </main>
        <ShopFooter />
      </div>
    </>
  );
};

export default OrdersPage;
