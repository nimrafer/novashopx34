import { useEffect, useMemo, useState, type ComponentType } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Clock3,
  Loader2,
  Package,
  Search,
  Settings2,
  ShieldAlert,
  ShieldCheck,
  XCircle,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { fetchAdminOrders, OrderRecord, OrderStatus, updateAdminOrder } from "@/lib/orders";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const ADMIN_EMAILS = String(import.meta.env.VITE_ADMIN_EMAILS || "admin@nova-shop.co")
  .split(",")
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean);

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; icon: ComponentType<{ className?: string }> }> = {
  pending: { label: "در انتظار", color: "bg-amber-100 text-amber-700", icon: Clock3 },
  processing: { label: "در حال پردازش", color: "bg-sky-100 text-sky-700", icon: Package },
  completed: { label: "تکمیل شده", color: "bg-emerald-100 text-emerald-700", icon: CheckCircle2 },
  cancelled: { label: "لغو شده", color: "bg-rose-100 text-rose-700", icon: XCircle },
  refunded: { label: "برگشت وجه", color: "bg-orange-100 text-orange-700", icon: ShieldAlert },
};

type EditableRow = {
  status: OrderStatus;
  notes: string;
  saving?: boolean;
  error?: string;
};

const AdminOrders = () => {
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | OrderStatus>("all");
  const [serviceFilter, setServiceFilter] = useState<string>("all");
  const [editable, setEditable] = useState<Record<string, EditableRow>>({});

  const isAdmin = !!user && ADMIN_EMAILS.includes(user.email.toLowerCase());

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [loading, user, navigate]);

  const loadOrders = async () => {
    setOrdersLoading(true);
    const result = await fetchAdminOrders();

    if ("error" in result) {
      setError(result.error);
      setOrders([]);
      setOrdersLoading(false);
      return;
    }

    setError(null);
    setOrders(result.data.orders || []);
    setEditable(
      Object.fromEntries(
        (result.data.orders || []).map((order) => [
          order.id,
          {
            status: order.status,
            notes: order.notes || "",
            saving: false,
            error: "",
          },
        ]),
      ),
    );
    setOrdersLoading(false);
  };

  useEffect(() => {
    if (!user || !isAdmin) return;
    loadOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isAdmin]);

  const services = useMemo(() => {
    return Array.from(new Set(orders.map((order) => order.serviceName))).sort((a, b) => a.localeCompare(b, "fa"));
  }, [orders]);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      if (statusFilter !== "all" && order.status !== statusFilter) return false;
      if (serviceFilter !== "all" && order.serviceName !== serviceFilter) return false;

      const q = search.trim().toLowerCase();
      if (!q) return true;

      return [
        order.id,
        order.userEmail,
        order.userFullName || "",
        order.serviceName,
        order.planName,
        order.notes || "",
      ]
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
  }, [orders, search, serviceFilter, statusFilter]);

  const counts = useMemo(() => {
    return {
      total: orders.length,
      pending: orders.filter((order) => order.status === "pending").length,
      processing: orders.filter((order) => order.status === "processing").length,
      completed: orders.filter((order) => order.status === "completed").length,
    };
  }, [orders]);

  const updateDraft = (id: string, patch: Partial<EditableRow>) => {
    setEditable((prev) => ({
      ...prev,
      [id]: {
        ...(prev[id] || { status: "pending" as OrderStatus, notes: "" }),
        ...patch,
      },
    }));
  };

  const saveRow = async (order: OrderRecord) => {
    const draft = editable[order.id];
    if (!draft) return;

    updateDraft(order.id, { saving: true, error: "" });

    const result = await updateAdminOrder(order.id, {
      status: draft.status,
      notes: draft.notes,
    });

    if ("error" in result) {
      updateDraft(order.id, { saving: false, error: result.error });
      return;
    }

    setOrders((prev) => prev.map((item) => (item.id === order.id ? result.data.order : item)));
    updateDraft(order.id, { saving: false, error: "" });
    toast({ title: "سفارش بروزرسانی شد", description: `شناسه: ${order.id}` });
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
            <p className="text-muted-foreground mb-6">این بخش فقط برای ادمین فعال است.</p>
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
              <span>پنل مدیریت سفارشات</span>
            </div>
            <h1 className="text-3xl font-black">رسیدگی سفارش‌ها</h1>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link to="/">
                <ArrowLeft className="w-4 h-4 ml-2" />
                بازگشت به سایت
              </Link>
            </Button>
            <Button onClick={loadOrders} variant="default" className="bg-gradient-primary text-primary-foreground">
              <Settings2 className="w-4 h-4 ml-2" />
              بروزرسانی لیست
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
          <div className="glass rounded-2xl p-4">
            <p className="text-xs text-muted-foreground">کل سفارش‌ها</p>
            <p className="text-2xl font-black mt-1">{counts.total.toLocaleString("fa-IR")}</p>
          </div>
          <div className="glass rounded-2xl p-4">
            <p className="text-xs text-muted-foreground">در انتظار</p>
            <p className="text-2xl font-black mt-1 text-amber-600">{counts.pending.toLocaleString("fa-IR")}</p>
          </div>
          <div className="glass rounded-2xl p-4">
            <p className="text-xs text-muted-foreground">در حال پردازش</p>
            <p className="text-2xl font-black mt-1 text-sky-600">{counts.processing.toLocaleString("fa-IR")}</p>
          </div>
          <div className="glass rounded-2xl p-4">
            <p className="text-xs text-muted-foreground">تکمیل‌شده</p>
            <p className="text-2xl font-black mt-1 text-emerald-600">{counts.completed.toLocaleString("fa-IR")}</p>
          </div>
        </div>

        <div className="glass rounded-2xl p-4 mb-5">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">
            <div className="relative lg:col-span-2">
              <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="جستجو با شناسه، ایمیل، نام کاربر یا سرویس"
                className="pr-9"
              />
            </div>

            <select
              className="h-10 rounded-md border border-border bg-background px-3 text-sm"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as "all" | OrderStatus)}
            >
              <option value="all">همه وضعیت‌ها</option>
              <option value="pending">در انتظار</option>
              <option value="processing">در حال پردازش</option>
              <option value="completed">تکمیل‌شده</option>
              <option value="cancelled">لغو شده</option>
              <option value="refunded">برگشت وجه</option>
            </select>

            <select
              className="h-10 rounded-md border border-border bg-background px-3 text-sm"
              value={serviceFilter}
              onChange={(e) => setServiceFilter(e.target.value)}
            >
              <option value="all">همه سرویس‌ها</option>
              {services.map((service) => (
                <option key={service} value={service}>{service}</option>
              ))}
            </select>
          </div>
        </div>

        {ordersLoading ? (
          <div className="glass rounded-2xl p-12 text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-accent mb-3" />
            <p className="text-muted-foreground">در حال بارگذاری سفارش‌ها...</p>
          </div>
        ) : error ? (
          <div className="glass rounded-2xl p-12 text-center">
            <AlertCircle className="w-10 h-10 mx-auto text-rose-500 mb-3" />
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={loadOrders}>تلاش مجدد</Button>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="glass rounded-2xl p-12 text-center">
            <Package className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground">سفارشی با فیلتر فعلی پیدا نشد.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredOrders.map((order) => {
              const draft = editable[order.id] || { status: order.status, notes: order.notes || "" };
              const statusMeta = STATUS_CONFIG[draft.status];
              const StatusIcon = statusMeta.icon;

              return (
                <div key={order.id} className="glass rounded-2xl p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-black">{order.serviceName}</p>
                        <Badge className={`${statusMeta.color} border-0`}>
                          <StatusIcon className="w-3.5 h-3.5 ml-1" />
                          {statusMeta.label}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{order.planName}{order.planDuration ? ` | ${order.planDuration}` : ""}</p>
                      <p className="text-xs text-muted-foreground mt-1">{order.id} | {order.userEmail} | {new Date(order.createdAt).toLocaleString("fa-IR")}</p>
                    </div>
                    <p className="text-lg font-black">{order.price.toLocaleString("fa-IR")} تومان</p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">
                    <select
                      className="h-10 rounded-md border border-border bg-background px-3 text-sm"
                      value={draft.status}
                      onChange={(e) => updateDraft(order.id, { status: e.target.value as OrderStatus })}
                    >
                      <option value="pending">در انتظار</option>
                      <option value="processing">در حال پردازش</option>
                      <option value="completed">تکمیل‌شده</option>
                      <option value="cancelled">لغو شده</option>
                      <option value="refunded">برگشت وجه</option>
                    </select>

                    <Textarea
                      className="lg:col-span-2 min-h-[42px] h-[42px] resize-y"
                      value={draft.notes}
                      onChange={(e) => updateDraft(order.id, { notes: e.target.value })}
                      placeholder="یادداشت ادمین برای این سفارش"
                    />

                    <Button
                      onClick={() => saveRow(order)}
                      disabled={!!draft.saving}
                      className="bg-gradient-primary text-primary-foreground"
                    >
                      {draft.saving ? <Loader2 className="w-4 h-4 animate-spin ml-2" /> : null}
                      ذخیره تغییرات
                    </Button>
                  </div>

                  {draft.error ? <p className="text-xs text-rose-600 mt-2">{draft.error}</p> : null}
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminOrders;
