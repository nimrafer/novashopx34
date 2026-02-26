import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Loader2,
  Plus,
  RefreshCw,
  ShieldAlert,
  ShieldCheck,
  Trash2,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import {
  AdminDashboardStats,
  CatalogPlanRecord,
  CatalogServiceRecord,
  createAdminDiscount,
  createAdminOffer,
  createAdminPlan,
  createAdminPrice,
  createAdminService,
  deleteAdminDiscount,
  deleteAdminOffer,
  deleteAdminPlan,
  deleteAdminPrice,
  deleteAdminService,
  DiscountRecord,
  fetchAdminCatalog,
  fetchAdminDashboard,
  fetchAdminDiscounts,
  fetchAdminOffers,
  fetchAdminOrders,
  fetchAdminPrices,
  OfferRecord,
  OrderRecord,
  OrderStatus,
  PaymentStatus,
  FulfillmentStatus,
  PriceModifierType,
  PriceRecord,
  updateAdminDiscount,
  updateAdminOffer,
  updateAdminOrder,
  updateAdminPlan,
  updateAdminPrice,
  updateAdminService,
} from "@/lib/orders";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const ADMIN_EMAILS = String(import.meta.env.VITE_ADMIN_EMAILS || "admin@nova-shop.co")
  .split(",")
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean);

const TAB_ITEMS = [
  { id: "orders", label: "سفارشات" },
  { id: "prices", label: "قیمت ها" },
  { id: "catalog", label: "سرویس و پلن" },
  { id: "discounts", label: "آفر و کد تخفیف" },
] as const;

type TabId = (typeof TAB_ITEMS)[number]["id"];

const ORDER_STATUS_OPTIONS: { value: OrderStatus; label: string }[] = [
  { value: "pending", label: "در انتظار" },
  { value: "processing", label: "در حال پردازش" },
  { value: "completed", label: "تکمیل شده" },
  { value: "cancelled", label: "لغو شده" },
  { value: "refunded", label: "برگشت وجه" },
];

const PAYMENT_STATUS_OPTIONS: { value: PaymentStatus; label: string }[] = [
  { value: "awaiting_payment", label: "در انتظار پرداخت" },
  { value: "submitted", label: "رسید ثبت شده" },
  { value: "verified", label: "تایید شده" },
  { value: "rejected", label: "رد شده" },
  { value: "refunded", label: "مسترد شده" },
];

const FULFILLMENT_STATUS_OPTIONS: { value: FulfillmentStatus; label: string }[] = [
  { value: "new", label: "جدید" },
  { value: "queued", label: "در صف" },
  { value: "provisioning", label: "در حال فعالسازی" },
  { value: "delivered", label: "تحویل شده" },
  { value: "failed", label: "ناموفق" },
  { value: "returned", label: "مرجوعی" },
];

const toDateTimeLocal = (value?: string | null) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return localDate.toISOString().slice(0, 16);
};

const AdminOrders = () => {
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<TabId>("orders");
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [prices, setPrices] = useState<PriceRecord[]>([]);
  const [services, setServices] = useState<CatalogServiceRecord[]>([]);
  const [plans, setPlans] = useState<CatalogPlanRecord[]>([]);
  const [discounts, setDiscounts] = useState<DiscountRecord[]>([]);
  const [offers, setOffers] = useState<OfferRecord[]>([]);

  const [search, setSearch] = useState("");
  const [savingMap, setSavingMap] = useState<Record<string, boolean>>({});
  const [orderTimelineNotes, setOrderTimelineNotes] = useState<Record<string, string>>({});

  const [newPrice, setNewPrice] = useState({ key: "", name: "", price: "" });
  const [newService, setNewService] = useState({
    id: "",
    name: "",
    description: "",
    logo: "",
    routePath: "",
    color: "#0f766e",
    sortOrder: "100",
  });
  const [newPlan, setNewPlan] = useState({
    serviceId: "",
    id: "",
    name: "",
    subtitle: "",
    duration: "",
    priceKey: "",
    price: "",
    badge: "",
    sortOrder: "100",
    requiresActivationEmail: false,
    activationEmailLabel: "",
  });

  const [newDiscount, setNewDiscount] = useState({
    code: "",
    title: "",
    type: "fixed" as PriceModifierType,
    value: "",
    serviceId: "",
    planId: "",
    maxUses: "100",
    expiresAt: "",
    description: "",
    active: true,
  });

  const [newOffer, setNewOffer] = useState({
    title: "",
    type: "percent" as PriceModifierType,
    value: "",
    serviceId: "",
    planId: "",
    expiresAt: "",
    description: "",
    active: true,
  });

  const isAdmin = !!user && (user.isAdmin || ADMIN_EMAILS.includes(user.email.toLowerCase()));

  const filteredOrders = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return orders;
    return orders.filter((order) =>
      [
        order.id,
        order.userEmail,
        order.userFullName || "",
        order.serviceName,
        order.planName,
        order.activationEmail || "",
        order.customerTelegram || "",
      ]
        .join(" ")
        .toLowerCase()
        .includes(q),
    );
  }, [orders, search]);

  const plansByService = useMemo(() => {
    return plans.reduce<Record<string, CatalogPlanRecord[]>>((acc, plan) => {
      if (!acc[plan.serviceId]) acc[plan.serviceId] = [];
      acc[plan.serviceId].push(plan);
      return acc;
    }, {});
  }, [plans]);

  const runWithSaving = async (key: string, action: () => Promise<void>) => {
    setSavingMap((prev) => ({ ...prev, [key]: true }));
    try {
      await action();
    } finally {
      setSavingMap((prev) => ({ ...prev, [key]: false }));
    }
  };

  const loadAll = async () => {
    setPageLoading(true);

    const [statsRes, ordersRes, pricesRes, catalogRes, discountsRes, offersRes] = await Promise.all([
      fetchAdminDashboard(),
      fetchAdminOrders(),
      fetchAdminPrices(),
      fetchAdminCatalog(),
      fetchAdminDiscounts(),
      fetchAdminOffers(),
    ]);

    if ("error" in statsRes || "error" in ordersRes || "error" in pricesRes || "error" in catalogRes || "error" in discountsRes || "error" in offersRes) {
      const failed = [statsRes, ordersRes, pricesRes, catalogRes, discountsRes, offersRes].find((item) => "error" in item) as {
        error: string;
      };
      setError(failed.error);
      setPageLoading(false);
      return;
    }

    setStats(statsRes.data.stats);
    setOrders(ordersRes.data.orders || []);
    setPrices(pricesRes.data.prices || []);
    setServices(catalogRes.data.services || []);
    setPlans(catalogRes.data.plans || []);
    setDiscounts(discountsRes.data.discounts || []);
    setOffers(offersRes.data.offers || []);

    setError(null);
    setPageLoading(false);
  };

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [loading, user, navigate]);

  useEffect(() => {
    if (!user || !isAdmin) return;
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isAdmin]);

  const saveOrder = async (order: OrderRecord) => {
    await runWithSaving(order.id, async () => {
      const noteMessage = (orderTimelineNotes[order.id] || "").trim();
      const result = await updateAdminOrder(order.id, {
        status: order.status,
        paymentStatus: order.paymentStatus,
        fulfillmentStatus: order.fulfillmentStatus,
        activationEmail: order.activationEmail || "",
        customerTelegram: order.customerTelegram || "",
        notes: order.notes || "",
        adminNotes: order.adminNotes || "",
        paymentMethod: order.paymentMethod || "",
        paymentReference: order.paymentReference || "",
        paymentReceipt: order.paymentReceipt || "",
        deliveryAccount: order.deliveryAccount || "",
        appendTimelineMessage: noteMessage || undefined,
      });

      if ("error" in result) {
        toast({ title: "خطا", description: result.error, variant: "destructive" });
        return;
      }

      setOrders((prev) => prev.map((item) => (item.id === order.id ? result.data.order : item)));
      setOrderTimelineNotes((prev) => ({ ...prev, [order.id]: "" }));
      toast({ title: "ذخیره شد", description: `سفارش ${order.id} بروزرسانی شد.` });
    });
  };

  const savePrice = async (price: PriceRecord) => {
    await runWithSaving(`price-${price.key}`, async () => {
      const result = await updateAdminPrice(price.key, {
        name: price.name,
        price: Number(price.price),
      });
      if ("error" in result) {
        toast({ title: "خطا", description: result.error, variant: "destructive" });
        return;
      }
      setPrices((prev) => prev.map((item) => (item.key === price.key ? result.data.price : item)));
      toast({ title: "ذخیره شد", description: `قیمت ${price.key} بروزرسانی شد.` });
    });
  };

  const addPrice = async () => {
    if (!newPrice.key.trim() || !newPrice.name.trim() || !newPrice.price.trim()) {
      toast({ title: "خطا", description: "فیلدهای قیمت کامل نیست", variant: "destructive" });
      return;
    }

    await runWithSaving("new-price", async () => {
      const result = await createAdminPrice({
        key: newPrice.key,
        name: newPrice.name,
        price: Number(newPrice.price),
      });

      if ("error" in result) {
        toast({ title: "خطا", description: result.error, variant: "destructive" });
        return;
      }

      setPrices((prev) => [result.data.price, ...prev]);
      setNewPrice({ key: "", name: "", price: "" });
      toast({ title: "ثبت شد", description: "قیمت جدید اضافه شد." });
    });
  };

  const addService = async () => {
    if (!newService.name.trim()) {
      toast({ title: "خطا", description: "نام سرویس الزامی است", variant: "destructive" });
      return;
    }

    await runWithSaving("new-service", async () => {
      const result = await createAdminService({
        id: newService.id || undefined,
        name: newService.name,
        description: newService.description,
        logo: newService.logo,
        routePath: newService.routePath,
        color: newService.color,
        sortOrder: Number(newService.sortOrder || "100"),
        isActive: true,
      });

      if ("error" in result) {
        toast({ title: "خطا", description: result.error, variant: "destructive" });
        return;
      }

      setServices((prev) => [...prev, result.data.service].sort((a, b) => a.sortOrder - b.sortOrder));
      setNewService({ id: "", name: "", description: "", logo: "", routePath: "", color: "#0f766e", sortOrder: "100" });
      toast({ title: "ثبت شد", description: "سرویس جدید اضافه شد." });
    });
  };

  const addPlan = async () => {
    if (!newPlan.serviceId || !newPlan.name.trim()) {
      toast({ title: "خطا", description: "سرویس و نام پلن الزامی است", variant: "destructive" });
      return;
    }

    await runWithSaving("new-plan", async () => {
      const result = await createAdminPlan({
        serviceId: newPlan.serviceId,
        id: newPlan.id || undefined,
        name: newPlan.name,
        subtitle: newPlan.subtitle,
        duration: newPlan.duration,
        priceKey: newPlan.priceKey || undefined,
        price: newPlan.price ? Number(newPlan.price) : undefined,
        badge: newPlan.badge,
        sortOrder: Number(newPlan.sortOrder || "100"),
        requiresActivationEmail: newPlan.requiresActivationEmail,
        activationEmailLabel: newPlan.activationEmailLabel,
        isActive: true,
      });

      if ("error" in result) {
        toast({ title: "خطا", description: result.error, variant: "destructive" });
        return;
      }

      setPlans((prev) => [...prev, result.data.plan]);
      setNewPlan({
        serviceId: newPlan.serviceId,
        id: "",
        name: "",
        subtitle: "",
        duration: "",
        priceKey: "",
        price: "",
        badge: "",
        sortOrder: "100",
        requiresActivationEmail: false,
        activationEmailLabel: "",
      });
      toast({ title: "ثبت شد", description: "پلن جدید اضافه شد." });
      loadAll();
    });
  };

  const addDiscount = async () => {
    if (!newDiscount.code.trim() || !newDiscount.title.trim() || !newDiscount.value.trim()) {
      toast({ title: "خطا", description: "اطلاعات کد تخفیف کامل نیست", variant: "destructive" });
      return;
    }

    await runWithSaving("new-discount", async () => {
      const result = await createAdminDiscount({
        code: newDiscount.code,
        title: newDiscount.title,
        description: newDiscount.description,
        type: newDiscount.type,
        value: Number(newDiscount.value),
        serviceId: newDiscount.serviceId || undefined,
        planId: newDiscount.planId || undefined,
        maxUses: Number(newDiscount.maxUses || "100"),
        active: newDiscount.active,
        expiresAt: newDiscount.expiresAt || undefined,
      });

      if ("error" in result) {
        toast({ title: "خطا", description: result.error, variant: "destructive" });
        return;
      }

      setDiscounts((prev) => [result.data.discount, ...prev]);
      setNewDiscount({
        code: "",
        title: "",
        type: "fixed",
        value: "",
        serviceId: "",
        planId: "",
        maxUses: "100",
        expiresAt: "",
        description: "",
        active: true,
      });
      toast({ title: "ثبت شد", description: "کد تخفیف اضافه شد." });
    });
  };

  const addOffer = async () => {
    if (!newOffer.title.trim() || !newOffer.value.trim()) {
      toast({ title: "خطا", description: "اطلاعات آفر کامل نیست", variant: "destructive" });
      return;
    }

    await runWithSaving("new-offer", async () => {
      const result = await createAdminOffer({
        title: newOffer.title,
        description: newOffer.description,
        type: newOffer.type,
        value: Number(newOffer.value),
        serviceId: newOffer.serviceId || undefined,
        planId: newOffer.planId || undefined,
        active: newOffer.active,
        expiresAt: newOffer.expiresAt || undefined,
      });

      if ("error" in result) {
        toast({ title: "خطا", description: result.error, variant: "destructive" });
        return;
      }

      setOffers((prev) => [result.data.offer, ...prev]);
      setNewOffer({
        title: "",
        type: "percent",
        value: "",
        serviceId: "",
        planId: "",
        expiresAt: "",
        description: "",
        active: true,
      });
      toast({ title: "ثبت شد", description: "آفر جدید اضافه شد." });
    });
  };

  const saveDiscount = async (discount: DiscountRecord) => {
    await runWithSaving(`discount-${discount.id}`, async () => {
      const result = await updateAdminDiscount(discount.id, {
        code: discount.code,
        title: discount.title,
        description: discount.description || "",
        type: discount.type,
        value: Number(discount.value),
        serviceId: discount.serviceId || "",
        planId: discount.planId || "",
        maxUses: Number(discount.maxUses || 0),
        active: discount.active,
        expiresAt: discount.expiresAt || "",
      });
      if ("error" in result) {
        toast({ title: "خطا", description: result.error, variant: "destructive" });
        return;
      }
      setDiscounts((prev) => prev.map((item) => (item.id === discount.id ? result.data.discount : item)));
      toast({ title: "ذخیره شد", description: `کد ${discount.code} بروزرسانی شد.` });
    });
  };

  const saveOffer = async (offer: OfferRecord) => {
    await runWithSaving(`offer-${offer.id}`, async () => {
      const result = await updateAdminOffer(offer.id, {
        title: offer.title,
        description: offer.description || "",
        type: offer.type,
        value: Number(offer.value),
        serviceId: offer.serviceId || "",
        planId: offer.planId || "",
        active: offer.active,
        expiresAt: offer.expiresAt || "",
      });
      if ("error" in result) {
        toast({ title: "خطا", description: result.error, variant: "destructive" });
        return;
      }
      setOffers((prev) => prev.map((item) => (item.id === offer.id ? result.data.offer : item)));
      toast({ title: "ذخیره شد", description: `آفر ${offer.title} بروزرسانی شد.` });
    });
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background">
        <main className="container mx-auto px-4 py-20">
          <div className="max-w-xl mx-auto glass rounded-3xl p-8 text-center">
            <ShieldAlert className="w-12 h-12 mx-auto text-rose-500 mb-4" />
            <h1 className="text-2xl font-black mb-2">دسترسی غیرمجاز</h1>
            <p className="text-muted-foreground mb-6">این بخش فقط برای مدیر فروشگاه فعال است.</p>
            <Button asChild>
              <Link to="/dashboard">بازگشت به پنل کاربری</Link>
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary border border-border text-sm mb-2">
              <ShieldCheck className="w-4 h-4 text-accent" />
              <span>پنل مدیریت فروشگاه</span>
            </div>
            <h1 className="text-3xl font-black">مدیریت جامع نوا شاپ</h1>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link to="/dashboard">
                <ArrowLeft className="w-4 h-4 ml-2" />
                پنل مشتری
              </Link>
            </Button>
            <Button onClick={loadAll} className="bg-gradient-primary text-primary-foreground">
              <RefreshCw className="w-4 h-4 ml-2" />
              بروزرسانی داده ها
            </Button>
          </div>
        </div>

        {stats ? (
          <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 mb-6">
            <div className="glass rounded-2xl p-4">
              <p className="text-xs text-muted-foreground">کل سفارش ها</p>
              <p className="text-2xl font-black mt-1">{stats.totalOrders.toLocaleString("fa-IR")}</p>
            </div>
            <div className="glass rounded-2xl p-4">
              <p className="text-xs text-muted-foreground">در انتظار</p>
              <p className="text-2xl font-black mt-1 text-amber-600">{stats.pendingOrders.toLocaleString("fa-IR")}</p>
            </div>
            <div className="glass rounded-2xl p-4">
              <p className="text-xs text-muted-foreground">پرداخت ثبت شده</p>
              <p className="text-2xl font-black mt-1 text-violet-600">{stats.paymentSubmitted.toLocaleString("fa-IR")}</p>
            </div>
            <div className="glass rounded-2xl p-4">
              <p className="text-xs text-muted-foreground">تحویل شده</p>
              <p className="text-2xl font-black mt-1 text-emerald-600">{stats.delivered.toLocaleString("fa-IR")}</p>
            </div>
            <div className="glass rounded-2xl p-4">
              <p className="text-xs text-muted-foreground">درآمد کل</p>
              <p className="text-lg font-black mt-1">{stats.totalRevenue.toLocaleString("fa-IR")} تومان</p>
            </div>
            <div className="glass rounded-2xl p-4">
              <p className="text-xs text-muted-foreground">درآمد امروز</p>
              <p className="text-lg font-black mt-1">{stats.todayRevenue.toLocaleString("fa-IR")} تومان</p>
            </div>
          </div>
        ) : null}

        <div className="glass rounded-2xl p-3 mb-5">
          <div className="flex flex-wrap gap-2">
            {TAB_ITEMS.map((tab) => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "default" : "outline"}
                className={activeTab === tab.id ? "bg-gradient-primary text-primary-foreground" : ""}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </Button>
            ))}
          </div>
        </div>

        {pageLoading ? (
          <div className="glass rounded-2xl p-12 text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-accent mb-3" />
            <p className="text-muted-foreground">در حال بارگذاری اطلاعات...</p>
          </div>
        ) : error ? (
          <div className="glass rounded-2xl p-12 text-center">
            <AlertCircle className="w-10 h-10 mx-auto text-rose-500 mb-3" />
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={loadAll}>تلاش مجدد</Button>
          </div>
        ) : null}

        {!pageLoading && !error && activeTab === "orders" ? (
          <div className="space-y-4">
            <div className="glass rounded-2xl p-4">
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="جستجو با شناسه سفارش، ایمیل کاربر، سرویس، ایمیل فعالسازی یا تلگرام"
              />
            </div>

            {filteredOrders.map((order, index) => (
              <div key={order.id} className="glass rounded-2xl p-4">
                <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                  <div>
                    <p className="font-black">{order.serviceName}</p>
                    <p className="text-sm text-muted-foreground">{order.planName}</p>
                    <p className="text-xs text-muted-foreground mt-1">{order.id} | {order.userEmail}</p>
                  </div>
                  <p className="text-lg font-black">{order.price.toLocaleString("fa-IR")} تومان</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">وضعیت سفارش</label>
                    <select
                      className="h-10 rounded-md border border-border bg-background px-3 text-sm w-full"
                      value={order.status}
                      onChange={(e) => {
                        const value = e.target.value as OrderStatus;
                        setOrders((prev) => prev.map((item, i) => (i === index ? { ...item, status: value } : item)));
                      }}
                    >
                      {ORDER_STATUS_OPTIONS.map((item) => (
                        <option key={item.value} value={item.value}>{item.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">وضعیت پرداخت</label>
                    <select
                      className="h-10 rounded-md border border-border bg-background px-3 text-sm w-full"
                      value={order.paymentStatus}
                      onChange={(e) => {
                        const value = e.target.value as PaymentStatus;
                        setOrders((prev) => prev.map((item, i) => (i === index ? { ...item, paymentStatus: value } : item)));
                      }}
                    >
                      {PAYMENT_STATUS_OPTIONS.map((item) => (
                        <option key={item.value} value={item.value}>{item.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">وضعیت تحویل</label>
                    <select
                      className="h-10 rounded-md border border-border bg-background px-3 text-sm w-full"
                      value={order.fulfillmentStatus}
                      onChange={(e) => {
                        const value = e.target.value as FulfillmentStatus;
                        setOrders((prev) => prev.map((item, i) => (i === index ? { ...item, fulfillmentStatus: value } : item)));
                      }}
                    >
                      {FULFILLMENT_STATUS_OPTIONS.map((item) => (
                        <option key={item.value} value={item.value}>{item.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                  <Input
                    dir="ltr"
                    value={order.activationEmail || ""}
                    onChange={(e) =>
                      setOrders((prev) => prev.map((item, i) => (i === index ? { ...item, activationEmail: e.target.value } : item)))
                    }
                    placeholder="ایمیل فعالسازی"
                  />

                  <Input
                    dir="ltr"
                    value={order.customerTelegram || ""}
                    onChange={(e) =>
                      setOrders((prev) => prev.map((item, i) => (i === index ? { ...item, customerTelegram: e.target.value } : item)))
                    }
                    placeholder="تلگرام کاربر"
                  />

                  <Input
                    value={order.paymentMethod || ""}
                    onChange={(e) =>
                      setOrders((prev) => prev.map((item, i) => (i === index ? { ...item, paymentMethod: e.target.value } : item)))
                    }
                    placeholder="روش پرداخت"
                  />

                  <Input
                    value={order.paymentReference || ""}
                    onChange={(e) =>
                      setOrders((prev) => prev.map((item, i) => (i === index ? { ...item, paymentReference: e.target.value } : item)))
                    }
                    placeholder="شماره پیگیری پرداخت"
                  />

                  <Input
                    value={order.paymentReceipt || ""}
                    onChange={(e) =>
                      setOrders((prev) => prev.map((item, i) => (i === index ? { ...item, paymentReceipt: e.target.value } : item)))
                    }
                    placeholder="رسید/توضیح پرداخت"
                  />
                </div>

                <div className="space-y-2 mb-3">
                  <Textarea
                    value={order.deliveryAccount || ""}
                    onChange={(e) =>
                      setOrders((prev) => prev.map((item, i) => (i === index ? { ...item, deliveryAccount: e.target.value } : item)))
                    }
                    className="min-h-[68px]"
                    placeholder="جزئیات تحویل اکانت / لینک / اطلاعات نهایی"
                  />

                  <Textarea
                    value={order.adminNotes || ""}
                    onChange={(e) =>
                      setOrders((prev) => prev.map((item, i) => (i === index ? { ...item, adminNotes: e.target.value } : item)))
                    }
                    className="min-h-[68px]"
                    placeholder="یادداشت داخلی ادمین"
                  />

                  <Textarea
                    value={orderTimelineNotes[order.id] || ""}
                    onChange={(e) => setOrderTimelineNotes((prev) => ({ ...prev, [order.id]: e.target.value }))}
                    className="min-h-[68px]"
                    placeholder="پیام بروزرسانی برای تایم‌لاین سفارش مشتری (اختیاری)"
                  />
                </div>

                <Button
                  onClick={() => saveOrder(order)}
                  disabled={!!savingMap[order.id]}
                  className="bg-gradient-primary text-primary-foreground"
                >
                  {savingMap[order.id] ? <Loader2 className="w-4 h-4 animate-spin ml-2" /> : <CheckCircle2 className="w-4 h-4 ml-2" />}
                  ذخیره تغییرات سفارش
                </Button>
              </div>
            ))}
          </div>
        ) : null}

        {!pageLoading && !error && activeTab === "prices" ? (
          <div className="space-y-4">
            <div className="glass rounded-2xl p-4">
              <p className="font-semibold mb-3">افزودن قیمت جدید</p>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                <Input value={newPrice.key} onChange={(e) => setNewPrice((prev) => ({ ...prev, key: e.target.value }))} placeholder="کلید price" />
                <Input value={newPrice.name} onChange={(e) => setNewPrice((prev) => ({ ...prev, name: e.target.value }))} placeholder="نام نمایشی" />
                <Input value={newPrice.price} onChange={(e) => setNewPrice((prev) => ({ ...prev, price: e.target.value }))} placeholder="قیمت" />
                <Button onClick={addPrice} disabled={!!savingMap["new-price"]}>
                  {savingMap["new-price"] ? <Loader2 className="w-4 h-4 animate-spin ml-2" /> : <Plus className="w-4 h-4 ml-2" />}
                  افزودن
                </Button>
              </div>
            </div>

            {prices.map((price, index) => (
              <div key={price.key} className="glass rounded-2xl p-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-2 items-end">
                  <Input value={price.key} disabled />
                  <Input
                    value={price.name}
                    onChange={(e) =>
                      setPrices((prev) => prev.map((item, i) => (i === index ? { ...item, name: e.target.value } : item)))
                    }
                  />
                  <Input
                    value={String(price.price)}
                    onChange={(e) =>
                      setPrices((prev) => prev.map((item, i) => (i === index ? { ...item, price: Number(e.target.value) || 0 } : item)))
                    }
                  />
                  <div className="flex gap-2">
                    <Button onClick={() => savePrice(price)} disabled={!!savingMap[`price-${price.key}`]}>
                      {savingMap[`price-${price.key}`] ? <Loader2 className="w-4 h-4 animate-spin" /> : "ذخیره"}
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() =>
                        runWithSaving(`price-del-${price.key}`, async () => {
                          const result = await deleteAdminPrice(price.key);
                          if ("error" in result) {
                            toast({ title: "خطا", description: result.error, variant: "destructive" });
                            return;
                          }
                          setPrices((prev) => prev.filter((item) => item.key !== price.key));
                        })
                      }
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : null}

        {!pageLoading && !error && activeTab === "catalog" ? (
          <div className="space-y-4">
            <div className="glass rounded-2xl p-4 space-y-3">
              <p className="font-semibold">افزودن سرویس جدید (با لوگو)</p>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                <Input value={newService.id} onChange={(e) => setNewService((p) => ({ ...p, id: e.target.value }))} placeholder="service id" />
                <Input value={newService.name} onChange={(e) => setNewService((p) => ({ ...p, name: e.target.value }))} placeholder="نام سرویس" />
                <Input value={newService.logo} onChange={(e) => setNewService((p) => ({ ...p, logo: e.target.value }))} placeholder="آدرس لوگو" />
                <Input value={newService.routePath} onChange={(e) => setNewService((p) => ({ ...p, routePath: e.target.value }))} placeholder="مسیر (مثلا /services/...)" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <Input value={newService.description} onChange={(e) => setNewService((p) => ({ ...p, description: e.target.value }))} placeholder="توضیح" />
                <Input value={newService.color} onChange={(e) => setNewService((p) => ({ ...p, color: e.target.value }))} placeholder="رنگ" />
                <Input value={newService.sortOrder} onChange={(e) => setNewService((p) => ({ ...p, sortOrder: e.target.value }))} placeholder="ترتیب" />
              </div>
              <Button onClick={addService} disabled={!!savingMap["new-service"]}>
                {savingMap["new-service"] ? <Loader2 className="w-4 h-4 animate-spin ml-2" /> : <Plus className="w-4 h-4 ml-2" />}
                افزودن سرویس
              </Button>
            </div>

            <div className="glass rounded-2xl p-4 space-y-3">
              <p className="font-semibold">افزودن پلن جدید</p>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                <select
                  className="h-10 rounded-md border border-border bg-background px-3 text-sm"
                  value={newPlan.serviceId}
                  onChange={(e) => setNewPlan((prev) => ({ ...prev, serviceId: e.target.value }))}
                >
                  <option value="">انتخاب سرویس</option>
                  {services.map((service) => (
                    <option key={service.id} value={service.id}>{service.name}</option>
                  ))}
                </select>
                <Input value={newPlan.id} onChange={(e) => setNewPlan((p) => ({ ...p, id: e.target.value }))} placeholder="plan id" />
                <Input value={newPlan.name} onChange={(e) => setNewPlan((p) => ({ ...p, name: e.target.value }))} placeholder="نام پلن" />
                <Input value={newPlan.subtitle} onChange={(e) => setNewPlan((p) => ({ ...p, subtitle: e.target.value }))} placeholder="زیرعنوان" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                <Input value={newPlan.duration} onChange={(e) => setNewPlan((p) => ({ ...p, duration: e.target.value }))} placeholder="مدت" />
                <Input value={newPlan.priceKey} onChange={(e) => setNewPlan((p) => ({ ...p, priceKey: e.target.value }))} placeholder="price key" />
                <Input value={newPlan.price} onChange={(e) => setNewPlan((p) => ({ ...p, price: e.target.value }))} placeholder="قیمت" />
                <Input value={newPlan.badge} onChange={(e) => setNewPlan((p) => ({ ...p, badge: e.target.value }))} placeholder="badge" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <Input value={newPlan.sortOrder} onChange={(e) => setNewPlan((p) => ({ ...p, sortOrder: e.target.value }))} placeholder="ترتیب" />
                <Input
                  value={newPlan.activationEmailLabel}
                  onChange={(e) => setNewPlan((p) => ({ ...p, activationEmailLabel: e.target.value }))}
                  placeholder="برچسب ایمیل فعالسازی"
                />
                <label className="h-10 rounded-md border border-border bg-background px-3 text-sm flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={newPlan.requiresActivationEmail}
                    onChange={(e) => setNewPlan((p) => ({ ...p, requiresActivationEmail: e.target.checked }))}
                  />
                  نیاز به ایمیل فعالسازی
                </label>
              </div>
              <Button onClick={addPlan} disabled={!!savingMap["new-plan"]}>
                {savingMap["new-plan"] ? <Loader2 className="w-4 h-4 animate-spin ml-2" /> : <Plus className="w-4 h-4 ml-2" />}
                افزودن پلن
              </Button>
            </div>

            {services.map((service, serviceIndex) => (
              <div key={service.id} className="glass rounded-2xl p-4 space-y-3">
                <div className="space-y-2">
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-2 items-end">
                    <Input value={service.id} disabled />
                    <Input
                      value={service.name}
                      onChange={(e) =>
                        setServices((prev) => prev.map((item, i) => (i === serviceIndex ? { ...item, name: e.target.value } : item)))
                      }
                      placeholder="نام سرویس"
                    />
                    <Input
                      value={service.logo}
                      onChange={(e) =>
                        setServices((prev) => prev.map((item, i) => (i === serviceIndex ? { ...item, logo: e.target.value } : item)))
                      }
                      placeholder="آدرس لوگو"
                    />
                    <Input
                      value={service.routePath || ""}
                      onChange={(e) =>
                        setServices((prev) => prev.map((item, i) => (i === serviceIndex ? { ...item, routePath: e.target.value } : item)))
                      }
                      placeholder="مسیر صفحه"
                    />
                    <Input
                      value={String(service.sortOrder)}
                      onChange={(e) =>
                        setServices((prev) =>
                          prev.map((item, i) =>
                            i === serviceIndex ? { ...item, sortOrder: Number(e.target.value || 0) } : item,
                          ),
                        )
                      }
                      placeholder="ترتیب"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-5 gap-2 items-end">
                    <Input
                      value={service.description}
                      onChange={(e) =>
                        setServices((prev) => prev.map((item, i) => (i === serviceIndex ? { ...item, description: e.target.value } : item)))
                      }
                      placeholder="توضیحات سرویس"
                    />
                    <Input
                      value={service.color}
                      onChange={(e) =>
                        setServices((prev) => prev.map((item, i) => (i === serviceIndex ? { ...item, color: e.target.value } : item)))
                      }
                      placeholder="رنگ"
                    />
                    <label className="h-10 rounded-md border border-border bg-background px-3 text-sm flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={service.isActive}
                        onChange={(e) =>
                          setServices((prev) =>
                            prev.map((item, i) => (i === serviceIndex ? { ...item, isActive: e.target.checked } : item)),
                          )
                        }
                      />
                      فعال
                    </label>
                    <div className="md:col-span-2 flex gap-2">
                      <Button
                        onClick={() =>
                          runWithSaving(`svc-${service.id}`, async () => {
                            const result = await updateAdminService(service.id, {
                              name: service.name,
                              logo: service.logo,
                              routePath: service.routePath || "",
                              description: service.description,
                              color: service.color,
                              sortOrder: service.sortOrder,
                              isActive: service.isActive,
                            });
                            if ("error" in result) {
                              toast({ title: "خطا", description: result.error, variant: "destructive" });
                              return;
                            }
                            setServices((prev) => prev.map((item) => (item.id === service.id ? result.data.service : item)));
                          })
                        }
                        disabled={!!savingMap[`svc-${service.id}`]}
                      >
                        ذخیره سرویس
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() =>
                          runWithSaving(`svc-del-${service.id}`, async () => {
                            const result = await deleteAdminService(service.id);
                            if ("error" in result) {
                              toast({ title: "خطا", description: result.error, variant: "destructive" });
                              return;
                            }
                            setServices((prev) => prev.filter((item) => item.id !== service.id));
                            setPlans((prev) => prev.filter((item) => item.serviceId !== service.id));
                          })
                        }
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">پلن های این سرویس</p>
                  {(plansByService[service.id] || []).map((plan, planIndex) => {
                    const localPlans = plansByService[service.id] || [];
                    const realIndex = plans.findIndex((item) => item.id === localPlans[planIndex].id);

                    return (
                      <div key={plan.id} className="rounded-xl border border-border/60 p-3 space-y-2 bg-card/40">
                        <div className="grid grid-cols-1 md:grid-cols-7 gap-2">
                          <Input value={plan.id} disabled />
                          <select
                            className="h-10 rounded-md border border-border bg-background px-3 text-sm"
                            value={plan.serviceId}
                            onChange={(e) =>
                              setPlans((prev) =>
                                prev.map((item, i) => (i === realIndex ? { ...item, serviceId: e.target.value } : item)),
                              )
                            }
                          >
                            {services.map((s) => (
                              <option key={s.id} value={s.id}>
                                {s.name}
                              </option>
                            ))}
                          </select>
                          <Input
                            value={plan.name}
                            onChange={(e) =>
                              setPlans((prev) => prev.map((item, i) => (i === realIndex ? { ...item, name: e.target.value } : item)))
                            }
                            placeholder="نام پلن"
                          />
                          <Input
                            value={plan.subtitle}
                            onChange={(e) =>
                              setPlans((prev) => prev.map((item, i) => (i === realIndex ? { ...item, subtitle: e.target.value } : item)))
                            }
                            placeholder="زیرعنوان"
                          />
                          <Input
                            value={plan.duration}
                            onChange={(e) =>
                              setPlans((prev) => prev.map((item, i) => (i === realIndex ? { ...item, duration: e.target.value } : item)))
                            }
                            placeholder="مدت"
                          />
                          <Input
                            value={plan.priceKey}
                            onChange={(e) =>
                              setPlans((prev) => prev.map((item, i) => (i === realIndex ? { ...item, priceKey: e.target.value } : item)))
                            }
                            placeholder="price key"
                          />
                          <Input
                            value={String(plan.price)}
                            onChange={(e) =>
                              setPlans((prev) => prev.map((item, i) => (i === realIndex ? { ...item, price: Number(e.target.value) || 0 } : item)))
                            }
                            placeholder="قیمت"
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-6 gap-2">
                          <Input
                            value={plan.badge}
                            onChange={(e) =>
                              setPlans((prev) => prev.map((item, i) => (i === realIndex ? { ...item, badge: e.target.value } : item)))
                            }
                            placeholder="برچسب"
                          />
                          <Input
                            value={String(plan.sortOrder)}
                            onChange={(e) =>
                              setPlans((prev) =>
                                prev.map((item, i) =>
                                  i === realIndex ? { ...item, sortOrder: Number(e.target.value || 0) } : item,
                                ),
                              )
                            }
                            placeholder="ترتیب"
                          />
                          <Input
                            value={plan.activationEmailLabel}
                            onChange={(e) =>
                              setPlans((prev) =>
                                prev.map((item, i) =>
                                  i === realIndex ? { ...item, activationEmailLabel: e.target.value } : item,
                                ),
                              )
                            }
                            placeholder="برچسب ایمیل فعالسازی"
                          />
                          <label className="h-10 rounded-md border border-border bg-background px-3 text-sm flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={plan.requiresActivationEmail}
                              onChange={(e) =>
                                setPlans((prev) =>
                                  prev.map((item, i) =>
                                    i === realIndex ? { ...item, requiresActivationEmail: e.target.checked } : item,
                                  ),
                                )
                              }
                            />
                            نیاز به ایمیل
                          </label>
                          <label className="h-10 rounded-md border border-border bg-background px-3 text-sm flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={plan.isActive}
                              onChange={(e) =>
                                setPlans((prev) =>
                                  prev.map((item, i) => (i === realIndex ? { ...item, isActive: e.target.checked } : item)),
                                )
                              }
                            />
                            فعال
                          </label>
                          <div className="flex gap-2">
                            <Button
                              onClick={() =>
                                runWithSaving(`plan-${plan.id}`, async () => {
                                  const result = await updateAdminPlan(plan.id, {
                                    serviceId: plan.serviceId,
                                    name: plan.name,
                                    duration: plan.duration,
                                    priceKey: plan.priceKey,
                                    price: Number(plan.price),
                                    subtitle: plan.subtitle,
                                    badge: plan.badge,
                                    sortOrder: plan.sortOrder,
                                    requiresActivationEmail: plan.requiresActivationEmail,
                                    activationEmailLabel: plan.activationEmailLabel,
                                    isActive: plan.isActive,
                                  });
                                  if ("error" in result) {
                                    toast({ title: "خطا", description: result.error, variant: "destructive" });
                                    return;
                                  }
                                  setPlans((prev) => prev.map((item) => (item.id === plan.id ? result.data.plan : item)));
                                })
                              }
                              disabled={!!savingMap[`plan-${plan.id}`]}
                            >
                              ذخیره
                            </Button>
                            <Button
                              variant="destructive"
                              onClick={() =>
                                runWithSaving(`plan-del-${plan.id}`, async () => {
                                  const result = await deleteAdminPlan(plan.id);
                                  if ("error" in result) {
                                    toast({ title: "خطا", description: result.error, variant: "destructive" });
                                    return;
                                  }
                                  setPlans((prev) => prev.filter((item) => item.id !== plan.id));
                                })
                              }
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        ) : null}

        {!pageLoading && !error && activeTab === "discounts" ? (
          <div className="space-y-4">
            <div className="glass rounded-2xl p-4 space-y-3">
              <p className="font-semibold">افزودن کد تخفیف</p>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                <Input value={newDiscount.code} onChange={(e) => setNewDiscount((p) => ({ ...p, code: e.target.value }))} placeholder="CODE" />
                <Input value={newDiscount.title} onChange={(e) => setNewDiscount((p) => ({ ...p, title: e.target.value }))} placeholder="عنوان" />
                <select
                  className="h-10 rounded-md border border-border bg-background px-3 text-sm"
                  value={newDiscount.type}
                  onChange={(e) => setNewDiscount((p) => ({ ...p, type: e.target.value as PriceModifierType }))}
                >
                  <option value="fixed">مبلغ ثابت</option>
                  <option value="percent">درصدی</option>
                </select>
                <Input value={newDiscount.value} onChange={(e) => setNewDiscount((p) => ({ ...p, value: e.target.value }))} placeholder="مقدار" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                <Input value={newDiscount.serviceId} onChange={(e) => setNewDiscount((p) => ({ ...p, serviceId: e.target.value }))} placeholder="serviceId (اختیاری)" />
                <Input value={newDiscount.planId} onChange={(e) => setNewDiscount((p) => ({ ...p, planId: e.target.value }))} placeholder="planId (اختیاری)" />
                <Input value={newDiscount.maxUses} onChange={(e) => setNewDiscount((p) => ({ ...p, maxUses: e.target.value }))} placeholder="حداکثر استفاده" />
                <Input type="datetime-local" value={newDiscount.expiresAt} onChange={(e) => setNewDiscount((p) => ({ ...p, expiresAt: e.target.value }))} />
              </div>
              <Textarea value={newDiscount.description} onChange={(e) => setNewDiscount((p) => ({ ...p, description: e.target.value }))} placeholder="توضیحات" />
              <Button onClick={addDiscount} disabled={!!savingMap["new-discount"]}>
                {savingMap["new-discount"] ? <Loader2 className="w-4 h-4 animate-spin ml-2" /> : <Plus className="w-4 h-4 ml-2" />}
                افزودن کد تخفیف
              </Button>
            </div>

            <div className="glass rounded-2xl p-4 space-y-3">
              <p className="font-semibold">افزودن آفر</p>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                <Input value={newOffer.title} onChange={(e) => setNewOffer((p) => ({ ...p, title: e.target.value }))} placeholder="عنوان آفر" />
                <select
                  className="h-10 rounded-md border border-border bg-background px-3 text-sm"
                  value={newOffer.type}
                  onChange={(e) => setNewOffer((p) => ({ ...p, type: e.target.value as PriceModifierType }))}
                >
                  <option value="percent">درصدی</option>
                  <option value="fixed">مبلغ ثابت</option>
                </select>
                <Input value={newOffer.value} onChange={(e) => setNewOffer((p) => ({ ...p, value: e.target.value }))} placeholder="مقدار" />
                <Input type="datetime-local" value={newOffer.expiresAt} onChange={(e) => setNewOffer((p) => ({ ...p, expiresAt: e.target.value }))} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <Input value={newOffer.serviceId} onChange={(e) => setNewOffer((p) => ({ ...p, serviceId: e.target.value }))} placeholder="serviceId (اختیاری)" />
                <Input value={newOffer.planId} onChange={(e) => setNewOffer((p) => ({ ...p, planId: e.target.value }))} placeholder="planId (اختیاری)" />
              </div>
              <Textarea value={newOffer.description} onChange={(e) => setNewOffer((p) => ({ ...p, description: e.target.value }))} placeholder="توضیحات" />
              <Button onClick={addOffer} disabled={!!savingMap["new-offer"]}>
                {savingMap["new-offer"] ? <Loader2 className="w-4 h-4 animate-spin ml-2" /> : <Plus className="w-4 h-4 ml-2" />}
                افزودن آفر
              </Button>
            </div>

            <div className="glass rounded-2xl p-4 space-y-2">
              <p className="font-semibold">کدهای تخفیف ثبت شده</p>
              {discounts.map((discount, index) => (
                <div key={discount.id} className="rounded-xl border border-border/60 bg-card/40 p-3 space-y-2">
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
                    <Input
                      value={discount.code}
                      onChange={(e) =>
                        setDiscounts((prev) => prev.map((item, i) => (i === index ? { ...item, code: e.target.value.toUpperCase() } : item)))
                      }
                      placeholder="CODE"
                    />
                    <Input
                      value={discount.title}
                      onChange={(e) =>
                        setDiscounts((prev) => prev.map((item, i) => (i === index ? { ...item, title: e.target.value } : item)))
                      }
                      placeholder="عنوان"
                    />
                    <select
                      className="h-10 rounded-md border border-border bg-background px-3 text-sm"
                      value={discount.type}
                      onChange={(e) =>
                        setDiscounts((prev) =>
                          prev.map((item, i) => (i === index ? { ...item, type: e.target.value as PriceModifierType } : item)),
                        )
                      }
                    >
                      <option value="fixed">مبلغ ثابت</option>
                      <option value="percent">درصدی</option>
                    </select>
                    <Input
                      value={String(discount.value)}
                      onChange={(e) =>
                        setDiscounts((prev) =>
                          prev.map((item, i) => (i === index ? { ...item, value: Number(e.target.value || 0) } : item)),
                        )
                      }
                      placeholder="مقدار"
                    />
                    <Input
                      value={String(discount.maxUses)}
                      onChange={(e) =>
                        setDiscounts((prev) =>
                          prev.map((item, i) => (i === index ? { ...item, maxUses: Number(e.target.value || 0) } : item)),
                        )
                      }
                      placeholder="حداکثر استفاده"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                    <Input
                      value={discount.serviceId || ""}
                      onChange={(e) =>
                        setDiscounts((prev) => prev.map((item, i) => (i === index ? { ...item, serviceId: e.target.value || null } : item)))
                      }
                      placeholder="serviceId (اختیاری)"
                    />
                    <Input
                      value={discount.planId || ""}
                      onChange={(e) =>
                        setDiscounts((prev) => prev.map((item, i) => (i === index ? { ...item, planId: e.target.value || null } : item)))
                      }
                      placeholder="planId (اختیاری)"
                    />
                    <Input
                      type="datetime-local"
                      value={toDateTimeLocal(discount.expiresAt)}
                      onChange={(e) =>
                        setDiscounts((prev) =>
                          prev.map((item, i) => (i === index ? { ...item, expiresAt: e.target.value || null } : item)),
                        )
                      }
                    />
                    <label className="h-10 rounded-md border border-border bg-background px-3 text-sm flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={discount.active}
                        onChange={(e) =>
                          setDiscounts((prev) =>
                            prev.map((item, i) => (i === index ? { ...item, active: e.target.checked } : item)),
                          )
                        }
                      />
                      فعال
                    </label>
                  </div>

                  <Textarea
                    value={discount.description || ""}
                    onChange={(e) =>
                      setDiscounts((prev) => prev.map((item, i) => (i === index ? { ...item, description: e.target.value } : item)))
                    }
                    placeholder="توضیحات"
                    className="min-h-[80px]"
                  />

                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-xs text-muted-foreground">
                      استفاده: {discount.usedCount}/{discount.maxUses}
                    </p>
                    <div className="flex items-center gap-2">
                      <Badge className={discount.active ? "bg-emerald-100 text-emerald-700" : "bg-zinc-100 text-zinc-700"}>
                        {discount.active ? "فعال" : "غیرفعال"}
                      </Badge>
                      <Button size="sm" onClick={() => saveDiscount(discount)} disabled={!!savingMap[`discount-${discount.id}`]}>
                        {savingMap[`discount-${discount.id}`] ? <Loader2 className="w-4 h-4 animate-spin" /> : "ذخیره"}
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() =>
                          runWithSaving(`discount-del-${discount.id}`, async () => {
                            const result = await deleteAdminDiscount(discount.id);
                            if ("error" in result) {
                              toast({ title: "خطا", description: result.error, variant: "destructive" });
                              return;
                            }
                            setDiscounts((prev) => prev.filter((item) => item.id !== discount.id));
                          })
                        }
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="glass rounded-2xl p-4 space-y-2">
              <p className="font-semibold">آفرهای ثبت شده</p>
              {offers.map((offer, index) => (
                <div key={offer.id} className="rounded-xl border border-border/60 bg-card/40 p-3 space-y-2">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                    <Input
                      value={offer.title}
                      onChange={(e) =>
                        setOffers((prev) => prev.map((item, i) => (i === index ? { ...item, title: e.target.value } : item)))
                      }
                      placeholder="عنوان آفر"
                    />
                    <select
                      className="h-10 rounded-md border border-border bg-background px-3 text-sm"
                      value={offer.type}
                      onChange={(e) =>
                        setOffers((prev) =>
                          prev.map((item, i) => (i === index ? { ...item, type: e.target.value as PriceModifierType } : item)),
                        )
                      }
                    >
                      <option value="percent">درصدی</option>
                      <option value="fixed">مبلغ ثابت</option>
                    </select>
                    <Input
                      value={String(offer.value)}
                      onChange={(e) =>
                        setOffers((prev) =>
                          prev.map((item, i) => (i === index ? { ...item, value: Number(e.target.value || 0) } : item)),
                        )
                      }
                      placeholder="مقدار"
                    />
                    <Input
                      type="datetime-local"
                      value={toDateTimeLocal(offer.expiresAt)}
                      onChange={(e) =>
                        setOffers((prev) =>
                          prev.map((item, i) => (i === index ? { ...item, expiresAt: e.target.value || null } : item)),
                        )
                      }
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    <Input
                      value={offer.serviceId || ""}
                      onChange={(e) =>
                        setOffers((prev) => prev.map((item, i) => (i === index ? { ...item, serviceId: e.target.value || null } : item)))
                      }
                      placeholder="serviceId (اختیاری)"
                    />
                    <Input
                      value={offer.planId || ""}
                      onChange={(e) =>
                        setOffers((prev) => prev.map((item, i) => (i === index ? { ...item, planId: e.target.value || null } : item)))
                      }
                      placeholder="planId (اختیاری)"
                    />
                    <label className="h-10 rounded-md border border-border bg-background px-3 text-sm flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={offer.active}
                        onChange={(e) =>
                          setOffers((prev) => prev.map((item, i) => (i === index ? { ...item, active: e.target.checked } : item)))
                        }
                      />
                      فعال
                    </label>
                  </div>

                  <Textarea
                    value={offer.description || ""}
                    onChange={(e) =>
                      setOffers((prev) => prev.map((item, i) => (i === index ? { ...item, description: e.target.value } : item)))
                    }
                    className="min-h-[80px]"
                    placeholder="توضیحات آفر"
                  />

                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs text-muted-foreground">
                      service: {offer.serviceId || "all"} | plan: {offer.planId || "all"}
                    </p>
                    <div className="flex items-center gap-2">
                      <Badge className={offer.active ? "bg-emerald-100 text-emerald-700" : "bg-zinc-100 text-zinc-700"}>
                        {offer.active ? "فعال" : "غیرفعال"}
                      </Badge>
                      <Button size="sm" onClick={() => saveOffer(offer)} disabled={!!savingMap[`offer-${offer.id}`]}>
                        {savingMap[`offer-${offer.id}`] ? <Loader2 className="w-4 h-4 animate-spin" /> : "ذخیره"}
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() =>
                          runWithSaving(`offer-del-${offer.id}`, async () => {
                            const result = await deleteAdminOffer(offer.id);
                            if ("error" in result) {
                              toast({ title: "خطا", description: result.error, variant: "destructive" });
                              return;
                            }
                            setOffers((prev) => prev.filter((item) => item.id !== offer.id));
                          })
                        }
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </main>
    </div>
  );
};

export default AdminOrders;
