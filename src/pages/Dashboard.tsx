import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { fetchMyOrders, OrderRecord } from '@/lib/orders';
import {
  User,
  LogOut,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  ArrowLeft,
  ShoppingBag,
  AlertCircle,
} from 'lucide-react';
import novaLogo from '@/assets/nova-logo.jpeg';

const statusConfig = {
  pending: { label: 'در انتظار', color: 'bg-yellow-500/20 text-yellow-400', icon: Clock },
  processing: { label: 'در حال پردازش', color: 'bg-blue-500/20 text-blue-400', icon: Package },
  completed: { label: 'تکمیل شده', color: 'bg-green-500/20 text-green-400', icon: CheckCircle },
  cancelled: { label: 'لغو شده', color: 'bg-red-500/20 text-red-400', icon: XCircle },
  refunded: { label: 'مسترد شده', color: 'bg-orange-500/20 text-orange-400', icon: XCircle },
} as const;

const Dashboard = () => {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersError, setOrdersError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (!user) {
      setOrders([]);
      setOrdersLoading(false);
      return;
    }

    let mounted = true;

    const loadOrders = async () => {
      setOrdersLoading(true);
      const result = await fetchMyOrders();
      if (!mounted) return;

      if ("error" in result) {
        setOrdersError(result.error);
      } else {
        setOrders(result.data.orders ?? []);
        setOrdersError(null);
      }
      setOrdersLoading(false);
    };

    loadOrders();

    return () => {
      mounted = false;
    };
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">بازگشت</span>
          </Link>

          <Link to="/">
            <img src={novaLogo} alt="Nova AI Shop" className="w-8 h-8 rounded-lg object-cover" />
          </Link>

          <Button variant="ghost" size="sm" onClick={handleSignOut} className="text-muted-foreground hover:text-foreground">
            <LogOut className="w-4 h-4 ml-2" />
            خروج
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="glass rounded-2xl p-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">{user.fullName || 'کاربر'}</h1>
              <p className="text-muted-foreground text-sm">{user.email}</p>
            </div>
          </div>
        </div>

        <div className="glass rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <ShoppingBag className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-bold text-foreground">سفارشات من</h2>
          </div>

          {ordersLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">در حال بارگذاری سفارشات...</p>
            </div>
          ) : ordersError ? (
            <div className="text-center py-12">
              <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
              <p className="text-muted-foreground">{ordersError}</p>
              <Button
                className="mt-4"
                onClick={() => {
                  setOrdersLoading(true);
                  fetchMyOrders().then((result) => {
                    if ("error" in result) {
                      setOrdersError(result.error);
                    } else {
                      setOrders(result.data.orders ?? []);
                      setOrdersError(null);
                    }
                    setOrdersLoading(false);
                  });
                }}
              >
                تلاش مجدد
              </Button>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">هنوز سفارشی ثبت نکرده‌اید</p>
              <Button asChild className="bg-gradient-primary">
                <Link to="/">مشاهده محصولات</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => {
                const status = statusConfig[order.status];
                const StatusIcon = status.icon;

                return (
                  <div key={order.id} className="bg-secondary/30 rounded-xl p-4 border border-border/50">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-medium text-foreground">{order.serviceName}</h3>
                        <p className="text-sm text-muted-foreground">
                          {order.planName}
                          {order.planDuration ? ` | ${order.planDuration}` : ''}
                        </p>
                      </div>
                      <Badge className={`${status.color} border-0`}>
                        <StatusIcon className="w-3 h-3 ml-1" />
                        {status.label}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString('fa-IR')}
                      </span>
                      <span className="font-bold text-foreground">
                        {order.price.toLocaleString('fa-IR')} تومان
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
