import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle,
  Clock,
  LogOut,
  MessageCircle,
  Package,
  RefreshCw,
  Shield,
  Wallet,
  Send,
  Loader2,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  fetchMyOrders,
  OrderRecord,
  sendOrderMessage,
  submitOrderPayment,
  PaymentStatus,
  FulfillmentStatus,
  OrderStatus,
} from "@/lib/orders";
import { SUPPORT_USERNAME } from "@/constants/support";
import novaLogo from "@/assets/nova-logo.jpeg";

const ADMIN_EMAILS = String(import.meta.env.VITE_ADMIN_EMAILS || "admin@nova-shop.co")
  .split(",")
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean);

const orderStatusMeta: Record<OrderStatus, { label: string; className: string }> = {
  pending: { label: "در انتظار", className: "bg-amber-100 text-amber-700" },
  processing: { label: "در حال پردازش", className: "bg-sky-100 text-sky-700" },
  completed: { label: "تحویل شده", className: "bg-emerald-100 text-emerald-700" },
  cancelled: { label: "لغو شده", className: "bg-rose-100 text-rose-700" },
  refunded: { label: "مرجوعی / برگشت وجه", className: "bg-orange-100 text-orange-700" },
};

const paymentStatusMeta: Record<PaymentStatus, { label: string; className: string }> = {
  awaiting_payment: { label: "در انتظار پرداخت", className: "bg-zinc-100 text-zinc-700" },
  submitted: { label: "رسید ثبت شده", className: "bg-violet-100 text-violet-700" },
  verified: { label: "پرداخت تایید شد", className: "bg-emerald-100 text-emerald-700" },
  rejected: { label: "پرداخت رد شد", className: "bg-rose-100 text-rose-700" },
  refunded: { label: "مبلغ برگشت خورد", className: "bg-orange-100 text-orange-700" },
};

const fulfillmentStatusMeta: Record<FulfillmentStatus, { label: string; className: string }> = {
  new: { label: "جدید", className: "bg-zinc-100 text-zinc-700" },
  queued: { label: "در صف تحویل", className: "bg-blue-100 text-blue-700" },
  provisioning: { label: "در حال فعالسازی", className: "bg-sky-100 text-sky-700" },
  delivered: { label: "تحویل شده", className: "bg-emerald-100 text-emerald-700" },
  failed: { label: "تحویل ناموفق", className: "bg-rose-100 text-rose-700" },
  returned: { label: "مرجوعی", className: "bg-orange-100 text-orange-700" },
};

const Dashboard = () => {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersError, setOrdersError] = useState<string | null>(null);
  const [lastRefreshAt, setLastRefreshAt] = useState<string | null>(null);

  const [openMessageFor, setOpenMessageFor] = useState<string | null>(null);
  const [openPaymentFor, setOpenPaymentFor] = useState<string | null>(null);

  const [messageDrafts, setMessageDrafts] = useState<Record<string, string>>({});
  const [paymentDrafts, setPaymentDrafts] = useState<
    Record<string, { paymentMethod: string; paymentReference: string; paymentReceipt: string }>
  >({});

  const [sendingMessageId, setSendingMessageId] = useState<string | null>(null);
  const [sendingPaymentId, setSendingPaymentId] = useState<string | null>(null);

  const isAdmin = !!user && (user.isAdmin || ADMIN_EMAILS.includes(user.email.toLowerCase()));

  const loadOrders = async () => {
    if (!user) return;
    setOrdersLoading(true);
    const result = await fetchMyOrders();

    if ("error" in result) {
      setOrdersError(result.error);
      setOrders([]);
      setOrdersLoading(false);
      return;
    }

    setOrders(result.data.orders ?? []);
    setOrdersError(null);
    setOrdersLoading(false);
    setLastRefreshAt(new Date().toISOString());
  };

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [loading, user, navigate]);

  useEffect(() => {
    if (!user) {
      setOrders([]);
      setOrdersLoading(false);
      return;
    }

    let active = true;
    const executeLoad = async () => {
      if (!active) return;
      await loadOrders();
    };

    executeLoad();
    const interval = setInterval(executeLoad, 20000);

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [user]);

  const summary = useMemo(() => {
    const totalPaid = orders
      .filter((order) => order.paymentStatus === "verified" || order.status === "completed")
      .reduce((sum, order) => sum + order.price, 0);

    return {
      total: orders.length,
      pending: orders.filter((order) => order.status === "pending" || order.status === "processing").length,
      done: orders.filter((order) => order.status === "completed").length,
      totalPaid,
    };
  }, [orders]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const getTelegramTrackingUrl = (order: OrderRecord) => {
    const text = encodeURIComponent(
      `سلام وقت بخیر\nمن مشتری نوا شاپ هستم و میخوام وضعیت سفارشم رو پیگیری کنم.\nشناسه سفارش: ${order.id}\nسرویس: ${order.serviceName}\nپلن: ${order.planName}`,
    );
    return `https://t.me/${SUPPORT_USERNAME}?text=${text}`;
  };

  const handleSendMessage = async (order: OrderRecord) => {
    const message = (messageDrafts[order.id] || "").trim();
    if (!message) {
      toast({ title: "پیام خالی است", description: "متن پیام به ادمین را وارد کنید.", variant: "destructive" });
      return;
    }

    setSendingMessageId(order.id);
    const result = await sendOrderMessage(order.id, message);
    setSendingMessageId(null);

    if ("error" in result) {
      toast({ title: "ارسال پیام ناموفق بود", description: result.error, variant: "destructive" });
      return;
    }

    setOrders((prev) => prev.map((item) => (item.id === order.id ? result.data.order : item)));
    setMessageDrafts((prev) => ({ ...prev, [order.id]: "" }));
    setOpenMessageFor(null);

    toast({ title: "پیام ارسال شد", description: "پیام شما در پرونده سفارش ثبت شد." });
  };

  const handleSubmitPayment = async (order: OrderRecord) => {
    const draft = paymentDrafts[order.id] || { paymentMethod: "", paymentReference: "", paymentReceipt: "" };

    if (!draft.paymentMethod.trim() && !draft.paymentReference.trim() && !draft.paymentReceipt.trim()) {
      toast({
        title: "اطلاعات پرداخت ناقص است",
        description: "حداقل یکی از فیلدهای روش پرداخت، کد رهگیری یا توضیح رسید را وارد کنید.",
        variant: "destructive",
      });
      return;
    }

    setSendingPaymentId(order.id);
    const result = await submitOrderPayment(order.id, {
      paymentMethod: draft.paymentMethod.trim() || undefined,
      paymentReference: draft.paymentReference.trim() || undefined,
      paymentReceipt: draft.paymentReceipt.trim() || undefined,
    });
    setSendingPaymentId(null);

    if ("error" in result) {
      toast({ title: "ثبت پرداخت ناموفق بود", description: result.error, variant: "destructive" });
      return;
    }

    setOrders((prev) => prev.map((item) => (item.id === order.id ? result.data.order : item)));
    setOpenPaymentFor(null);
    toast({ title: "اطلاعات پرداخت ثبت شد", description: "رسید شما برای بررسی ادمین ارسال شد." });
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/60 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between gap-3">
          <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">بازگشت به سایت</span>
          </Link>

          <Link to="/">
            <img src={novaLogo} alt="Nova AI Shop" className="w-9 h-9 rounded-lg object-cover" />
          </Link>

          <div className="flex items-center gap-2">
            {isAdmin ? (
              <Button asChild variant="outline" size="sm">
                <Link to="/admin/orders">
                  <Shield className="w-4 h-4 ml-2" />
                  پنل ادمین
                </Link>
              </Button>
            ) : null}
            <Button variant="ghost" size="sm" onClick={handleSignOut} className="text-muted-foreground hover:text-foreground">
              <LogOut className="w-4 h-4 ml-2" />
              خروج
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="glass rounded-3xl p-6 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl font-black mb-1">پنل مشتری</h1>
              <p className="text-sm text-muted-foreground">{user.fullName || "کاربر نوا شاپ"} | {user.email}</p>
            </div>
            <Button variant="outline" onClick={loadOrders}>
              <RefreshCw className="w-4 h-4 ml-2" />
              بروزرسانی دستی
            </Button>
          </div>
          {lastRefreshAt ? (
            <p className="text-xs text-muted-foreground mt-3">آخرین بروزرسانی: {new Date(lastRefreshAt).toLocaleString("fa-IR")}</p>
          ) : null}
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          <div className="glass rounded-2xl p-4">
            <p className="text-xs text-muted-foreground">کل سفارش ها</p>
            <p className="text-2xl font-black mt-1">{summary.total.toLocaleString("fa-IR")}</p>
          </div>
          <div className="glass rounded-2xl p-4">
            <p className="text-xs text-muted-foreground">در حال پیگیری</p>
            <p className="text-2xl font-black text-amber-600 mt-1">{summary.pending.toLocaleString("fa-IR")}</p>
          </div>
          <div className="glass rounded-2xl p-4">
            <p className="text-xs text-muted-foreground">تحویل شده</p>
            <p className="text-2xl font-black text-emerald-600 mt-1">{summary.done.toLocaleString("fa-IR")}</p>
          </div>
          <div className="glass rounded-2xl p-4">
            <p className="text-xs text-muted-foreground">مبالغ تاییدشده</p>
            <p className="text-xl font-black mt-1">{summary.totalPaid.toLocaleString("fa-IR")} تومان</p>
          </div>
        </div>

        {ordersLoading ? (
          <div className="glass rounded-2xl p-12 text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-accent mb-3" />
            <p className="text-muted-foreground">در حال دریافت سفارشات شما...</p>
          </div>
        ) : ordersError ? (
          <div className="glass rounded-2xl p-12 text-center">
            <AlertCircle className="w-10 h-10 mx-auto text-rose-500 mb-3" />
            <p className="text-muted-foreground mb-4">{ordersError}</p>
            <Button onClick={loadOrders}>تلاش مجدد</Button>
          </div>
        ) : orders.length === 0 ? (
          <div className="glass rounded-2xl p-12 text-center">
            <Package className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground mb-4">هنوز سفارشی ثبت نکرده اید</p>
            <Button asChild className="bg-gradient-primary text-primary-foreground">
              <Link to="/">مشاهده سرویس ها</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const status = orderStatusMeta[order.status];
              const payment = paymentStatusMeta[order.paymentStatus];
              const fulfillment = fulfillmentStatusMeta[order.fulfillmentStatus];
              const shortTimeline = [...(order.timeline || [])].slice(-3).reverse();

              return (
                <div key={order.id} className="glass rounded-2xl p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                    <div>
                      <h2 className="text-lg font-black">{order.serviceName}</h2>
                      <p className="text-sm text-muted-foreground">
                        {order.planName}
                        {order.planDuration ? ` | ${order.planDuration}` : ""}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">شناسه سفارش: {order.id}</p>
                    </div>
                    <div className="text-left">
                      <p className="text-xl font-black">{order.price.toLocaleString("fa-IR")} تومان</p>
                      <p className="text-xs text-muted-foreground mt-1">{new Date(order.createdAt).toLocaleString("fa-IR")}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge className={`${status.className} border-0`}>{status.label}</Badge>
                    <Badge className={`${payment.className} border-0`}>{payment.label}</Badge>
                    <Badge className={`${fulfillment.className} border-0`}>{fulfillment.label}</Badge>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 mb-4 text-sm">
                    <div className="rounded-xl border border-border/60 bg-card/40 p-3">
                      <p className="text-xs text-muted-foreground">ایمیل فعالسازی</p>
                      <p className="font-medium mt-1" dir="ltr">{order.activationEmail || "ثبت نشده"}</p>
                    </div>
                    <div className="rounded-xl border border-border/60 bg-card/40 p-3">
                      <p className="text-xs text-muted-foreground">تلگرام کاربر</p>
                      <p className="font-medium mt-1" dir="ltr">{order.customerTelegram || "ثبت نشده"}</p>
                    </div>
                    <div className="rounded-xl border border-border/60 bg-card/40 p-3">
                      <p className="text-xs text-muted-foreground">کد رهگیری پرداخت</p>
                      <p className="font-medium mt-1" dir="ltr">{order.paymentReference || "ثبت نشده"}</p>
                    </div>
                  </div>

                  {shortTimeline.length > 0 ? (
                    <div className="rounded-xl border border-border/60 bg-muted/20 p-3 mb-4">
                      <p className="text-xs text-muted-foreground mb-2">آخرین تغییرات سفارش</p>
                      <div className="space-y-2 text-sm">
                        {shortTimeline.map((item) => (
                          <div key={item.id} className="flex items-start justify-between gap-3">
                            <p className="text-foreground">{item.message}</p>
                            <span className="text-xs text-muted-foreground whitespace-nowrap">
                              {new Date(item.at).toLocaleString("fa-IR")}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null}

                  <div className="flex flex-wrap gap-2">
                    <Button asChild variant="outline">
                      <a href={getTelegramTrackingUrl(order)} target="_blank" rel="noreferrer">
                        <MessageCircle className="w-4 h-4 ml-2" />
                        پیگیری لحظه ای در تلگرام
                      </a>
                    </Button>

                    <Button variant="outline" onClick={() => setOpenMessageFor((prev) => (prev === order.id ? null : order.id))}>
                      <Send className="w-4 h-4 ml-2" />
                      پیام به ادمین
                    </Button>

                    <Button variant="outline" onClick={() => setOpenPaymentFor((prev) => (prev === order.id ? null : order.id))}>
                      <Wallet className="w-4 h-4 ml-2" />
                      ثبت اطلاعات پرداخت
                    </Button>
                  </div>

                  {openMessageFor === order.id ? (
                    <div className="mt-4 rounded-xl border border-border/60 bg-card/40 p-3 space-y-2">
                      <label className="text-sm font-medium">پیام شما برای ادمین</label>
                      <Textarea
                        value={messageDrafts[order.id] || ""}
                        onChange={(e) => setMessageDrafts((prev) => ({ ...prev, [order.id]: e.target.value }))}
                        className="min-h-[80px]"
                        placeholder="متن پیام خود را بنویسید..."
                      />
                      <Button
                        onClick={() => handleSendMessage(order)}
                        disabled={sendingMessageId === order.id}
                        className="bg-gradient-primary text-primary-foreground"
                      >
                        {sendingMessageId === order.id ? <Loader2 className="w-4 h-4 animate-spin ml-2" /> : <Send className="w-4 h-4 ml-2" />}
                        ارسال پیام
                      </Button>
                    </div>
                  ) : null}

                  {openPaymentFor === order.id ? (
                    <div className="mt-4 rounded-xl border border-border/60 bg-card/40 p-3 space-y-2">
                      <label className="text-sm font-medium">روش پرداخت</label>
                      <Input
                        value={paymentDrafts[order.id]?.paymentMethod || ""}
                        onChange={(e) =>
                          setPaymentDrafts((prev) => ({
                            ...prev,
                            [order.id]: {
                              paymentMethod: e.target.value,
                              paymentReference: prev[order.id]?.paymentReference || "",
                              paymentReceipt: prev[order.id]?.paymentReceipt || "",
                            },
                          }))
                        }
                        placeholder="مثال: کارت به کارت"
                      />

                      <label className="text-sm font-medium">کد رهگیری / شماره تراکنش</label>
                      <Input
                        value={paymentDrafts[order.id]?.paymentReference || ""}
                        onChange={(e) =>
                          setPaymentDrafts((prev) => ({
                            ...prev,
                            [order.id]: {
                              paymentMethod: prev[order.id]?.paymentMethod || "",
                              paymentReference: e.target.value,
                              paymentReceipt: prev[order.id]?.paymentReceipt || "",
                            },
                          }))
                        }
                        placeholder="شماره پیگیری تراکنش"
                      />

                      <label className="text-sm font-medium">توضیح رسید / لینک تصویر رسید</label>
                      <Textarea
                        value={paymentDrafts[order.id]?.paymentReceipt || ""}
                        onChange={(e) =>
                          setPaymentDrafts((prev) => ({
                            ...prev,
                            [order.id]: {
                              paymentMethod: prev[order.id]?.paymentMethod || "",
                              paymentReference: prev[order.id]?.paymentReference || "",
                              paymentReceipt: e.target.value,
                            },
                          }))
                        }
                        placeholder="در صورت نیاز لینک رسید یا توضیح را وارد کنید"
                        className="min-h-[80px]"
                      />

                      <Button
                        onClick={() => handleSubmitPayment(order)}
                        disabled={sendingPaymentId === order.id}
                        className="bg-gradient-primary text-primary-foreground"
                      >
                        {sendingPaymentId === order.id ? <Loader2 className="w-4 h-4 animate-spin ml-2" /> : <CheckCircle className="w-4 h-4 ml-2" />}
                        ثبت برای بررسی ادمین
                      </Button>
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
