import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, Mail, Lock, User, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { user, loading, signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Redirect if already logged in
  useEffect(() => {
    if (!loading && user) {
      navigate('/');
    }
  }, [user, loading, navigate]);

  const validateForm = () => {
    if (!email || !email.includes('@')) {
      toast({
        title: 'خطا',
        description: 'لطفاً ایمیل معتبر وارد کنید',
        variant: 'destructive',
      });
      return false;
    }
    if (password.length < 6) {
      toast({
        title: 'خطا',
        description: 'رمز عبور باید حداقل ۶ کاراکتر باشد',
        variant: 'destructive',
      });
      return false;
    }
    if (!isLogin && !fullName.trim()) {
      toast({
        title: 'خطا',
        description: 'لطفاً نام کامل خود را وارد کنید',
        variant: 'destructive',
      });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) {
          let message = 'خطا در ورود';
          if (error.message.includes('Invalid login credentials')) {
            message = 'ایمیل یا رمز عبور اشتباه است';
          } else if (error.message.includes('Email not confirmed')) {
            message = 'لطفاً ابتدا ایمیل خود را تأیید کنید';
          }
          toast({
            title: 'خطا',
            description: message,
            variant: 'destructive',
          });
        } else {
          toast({
            title: 'خوش آمدید!',
            description: 'با موفقیت وارد شدید',
          });
          navigate('/');
        }
      } else {
        const { error } = await signUp(email, password, fullName);
        if (error) {
          let message = 'خطا در ثبت‌نام';
          if (error.message.includes('User already registered')) {
            message = 'این ایمیل قبلاً ثبت شده است';
          } else if (error.message.includes('Password')) {
            message = 'رمز عبور باید قوی‌تر باشد';
          }
          toast({
            title: 'خطا',
            description: message,
            variant: 'destructive',
          });
        } else {
          toast({
            title: 'ثبت‌نام موفق!',
            description: 'حساب کاربری شما ایجاد شد',
          });
          navigate('/');
        }
      }
    } catch (error) {
      toast({
        title: 'خطا',
        description: 'مشکلی پیش آمد. لطفاً دوباره تلاش کنید',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="p-4 md:p-6">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">بازگشت به صفحه اصلی</span>
        </Link>
      </header>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center p-4 md:p-6">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <Link to="/">
              <img 
                src="/LINEA-1.svg" 
                alt="LINEA" 
                className="h-8 w-auto mx-auto mb-4 invert"
              />
            </Link>
            <h1 className="text-2xl font-bold text-foreground mb-2">
              {isLogin ? 'ورود به حساب' : 'ایجاد حساب جدید'}
            </h1>
            <p className="text-muted-foreground text-sm">
              {isLogin 
                ? 'برای دسترسی به پنل کاربری وارد شوید' 
                : 'حساب خود را بسازید و از خدمات ما استفاده کنید'}
            </p>
          </div>

          {/* Form Card */}
          <div className="glass rounded-2xl p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-foreground">
                    نام کامل
                  </Label>
                  <div className="relative">
                    <User className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="نام و نام خانوادگی"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="pr-10 bg-secondary/50 border-border text-foreground placeholder:text-muted-foreground"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground">
                  ایمیل
                </Label>
                <div className="relative">
                  <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="example@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pr-10 bg-secondary/50 border-border text-foreground placeholder:text-muted-foreground"
                    dir="ltr"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-foreground">
                  رمز عبور
                </Label>
                <div className="relative">
                  <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="حداقل ۶ کاراکتر"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pr-10 pl-10 bg-secondary/50 border-border text-foreground placeholder:text-muted-foreground"
                    dir="ltr"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-primary hover:opacity-90 text-primary-foreground font-medium py-6"
              >
                {isSubmitting ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : isLogin ? (
                  'ورود'
                ) : (
                  'ثبت‌نام'
                )}
              </Button>
            </form>

            {/* Toggle */}
            <div className="mt-6 text-center">
              <p className="text-muted-foreground text-sm">
                {isLogin ? 'حساب کاربری ندارید؟' : 'قبلاً ثبت‌نام کرده‌اید؟'}
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-primary hover:underline mr-1 font-medium"
                >
                  {isLogin ? 'ثبت‌نام کنید' : 'وارد شوید'}
                </button>
              </p>
            </div>
          </div>

          {/* Footer note */}
          <p className="text-center text-muted-foreground text-xs mt-6">
            با ورود یا ثبت‌نام، شما{' '}
            <Link to="/terms" className="text-primary hover:underline">
              قوانین و مقررات
            </Link>{' '}
            ما را می‌پذیرید.
          </p>
        </div>
      </main>
    </div>
  );
};

export default Auth;
