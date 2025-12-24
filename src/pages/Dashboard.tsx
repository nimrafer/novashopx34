import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  LogOut, 
  Package, 
  Clock, 
  CheckCircle, 
  XCircle,
  ArrowLeft,
  ShoppingBag
} from 'lucide-react';

interface Order {
  id: string;
  product_name: string;
  product_type: string;
  plan_name: string;
  price: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled' | 'refunded';
  created_at: string;
}

interface Profile {
  full_name: string | null;
  phone: string | null;
}

const statusConfig = {
  pending: { label: 'در انتظار', color: 'bg-yellow-500/20 text-yellow-400', icon: Clock },
  processing: { label: 'در حال پردازش', color: 'bg-blue-500/20 text-blue-400', icon: Package },
  completed: { label: 'تکمیل شده', color: 'bg-green-500/20 text-green-400', icon: CheckCircle },
  cancelled: { label: 'لغو شده', color: 'bg-red-500/20 text-red-400', icon: XCircle },
  refunded: { label: 'مسترد شده', color: 'bg-orange-500/20 text-orange-400', icon: XCircle },
};

const Dashboard = () => {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      try {
        // Fetch profile
        const { data: profileData } = await supabase
          .from('profiles')
          .select('full_name, phone')
          .eq('user_id', user.id)
          .maybeSingle();

        if (profileData) {
          setProfile(profileData);
        }

        // Fetch orders
        const { data: ordersData } = await supabase
          .from('orders')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (ordersData) {
          setOrders(ordersData as Order[]);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoadingData(false);
      }
    };

    if (user) {
      fetchData();
    }
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
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">بازگشت</span>
          </Link>
          
          <Link to="/">
            <img 
              src="/LINEA-1.svg" 
              alt="LINEA" 
              className="h-6 w-auto invert"
            />
          </Link>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleSignOut}
            className="text-muted-foreground hover:text-foreground"
          >
            <LogOut className="w-4 h-4 ml-2" />
            خروج
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Profile Section */}
        <div className="glass rounded-2xl p-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">
                {profile?.full_name || 'کاربر'}
              </h1>
              <p className="text-muted-foreground text-sm">{user.email}</p>
              {profile?.phone && (
                <p className="text-muted-foreground text-sm">{profile.phone}</p>
              )}
            </div>
          </div>
        </div>

        {/* Orders Section */}
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <ShoppingBag className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-bold text-foreground">سفارشات من</h2>
          </div>

          {loadingData ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">
                هنوز سفارشی ثبت نکرده‌اید
              </p>
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
                  <div
                    key={order.id}
                    className="bg-secondary/30 rounded-xl p-4 border border-border/50"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-medium text-foreground">
                          {order.product_name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {order.plan_name}
                        </p>
                      </div>
                      <Badge className={`${status.color} border-0`}>
                        <StatusIcon className="w-3 h-3 ml-1" />
                        {status.label}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        {new Date(order.created_at).toLocaleDateString('fa-IR')}
                      </span>
                      <span className="font-bold text-foreground">
                        {order.price.toLocaleString()} تومان
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
