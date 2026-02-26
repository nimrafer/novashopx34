import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Mail, User, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import novaLogo from '@/assets/nova-logo.jpeg';

type AuthStep = 'request' | 'verify';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [step, setStep] = useState<AuthStep>('request');
  const [email, setEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [fullName, setFullName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { user, loading, requestEmailOtp, verifyEmailOtp } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const nextPathRaw = new URLSearchParams(location.search).get('next') || '/dashboard';
  const nextPath =
    nextPathRaw.startsWith('/') && !nextPathRaw.startsWith('//') && nextPathRaw !== '/auth'
      ? nextPathRaw
      : '/dashboard';

  useEffect(() => {
    if (!loading && user) {
      navigate(nextPath);
    }
  }, [user, loading, navigate, nextPath]);

  const resetFlow = () => {
    setStep('request');
    setOtpCode('');
  };

  const isValidEmail = (value: string) => {
    const emailValue = value.trim();
    return emailValue.includes('@') && emailValue.includes('.');
  };

  const validateRequestForm = () => {
    if (!isValidEmail(email)) {
      toast({
        title: 'خطا',
        description: 'لطفاً ایمیل معتبر وارد کنید',
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

  const handleRequestOtp = async () => {
    if (!validateRequestForm()) return;

    setIsSubmitting(true);

    try {
      const { error } = await requestEmailOtp(email.trim(), {
        shouldCreateUser: !isLogin,
        fullName: !isLogin ? fullName.trim() : undefined,
      });

      if (error) {
        const rawMessage = error.message.toLowerCase();
        let message = error.message || 'ارسال کد با خطا مواجه شد. لطفاً دوباره تلاش کنید';

        if (!isLogin && rawMessage.includes('already registered')) {
          message = 'این ایمیل قبلاً ثبت شده است. از بخش ورود استفاده کنید.';
        } else if (isLogin && (rawMessage.includes('signups not allowed') || rawMessage.includes('user not found'))) {
          message = 'برای این ایمیل حسابی پیدا نشد. ابتدا ثبت‌نام کنید.';
        } else if (rawMessage.includes('security purposes') || rawMessage.includes('rate limit')) {
          message = 'درخواست‌ها زیاد بوده. لطفاً یک دقیقه بعد دوباره تلاش کنید.';
        }

        toast({
          title: 'خطا',
          description: message,
          variant: 'destructive',
        });
      } else {
        setStep('verify');
        toast({
          title: 'کد ارسال شد',
          description: 'کد یک بار مصرف به ایمیل شما ارسال شد. لطفاً Inbox و پوشه Spam/Junk را بررسی کنید.',
        });
      }
    } catch {
      toast({
        title: 'خطا',
        description: 'مشکلی پیش آمد. لطفاً دوباره تلاش کنید',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOtp = async () => {
    const token = otpCode.trim();

    if (!isValidEmail(email)) {
      toast({
        title: 'خطا',
        description: 'لطفاً ایمیل معتبر وارد کنید',
        variant: 'destructive',
      });
      return;
    }

    if (token.length < 6) {
      toast({
        title: 'خطا',
        description: 'کد یک بار مصرف باید حداقل ۶ رقم باشد',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await verifyEmailOtp(email.trim(), token);

      if (error) {
        const rawMessage = error.message.toLowerCase();
        let message = error.message || 'کد وارد شده معتبر نیست';

        if (rawMessage.includes('expired')) {
          message = 'کد منقضی شده است. لطفاً کد جدید دریافت کنید.';
        } else if (rawMessage.includes('invalid') || rawMessage.includes('token')) {
          message = 'کد وارد شده اشتباه است. لطفاً دوباره بررسی کنید.';
        }

        toast({
          title: 'خطا',
          description: message,
          variant: 'destructive',
        });
      } else {
        toast({
          title: isLogin ? 'ورود موفق' : 'ثبت‌نام موفق',
          description: 'احراز هویت ایمیلی با موفقیت انجام شد.',
        });
        navigate(nextPath);
      }
    } catch {
      toast({
        title: 'خطا',
        description: 'مشکلی در تأیید کد رخ داد. لطفاً دوباره تلاش کنید.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (step === 'request') {
      await handleRequestOtp();
      return;
    }

    await handleVerifyOtp();
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
      <header className="p-4 md:p-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">بازگشت به صفحه اصلی</span>
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center p-4 md:p-6">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link to="/">
              <img
                src={novaLogo}
                alt="Nova AI Shop"
                className="w-16 h-16 mx-auto mb-4 rounded-xl object-cover"
              />
            </Link>
            <h1 className="text-2xl font-bold text-foreground mb-2">
              {step === 'verify'
                ? 'تأیید کد ایمیل'
                : isLogin
                  ? 'ورود با کد یک بار مصرف'
                  : 'ثبت‌نام با کد یک بار مصرف'}
            </h1>
            <p className="text-muted-foreground text-sm">
              {step === 'verify'
                ? 'کد ارسال‌شده به ایمیل را وارد کنید تا احراز هویت تکمیل شود.'
                : isLogin
                  ? 'برای ورود، کد یک‌بارمصرف به ایمیلتان ارسال می‌شود.'
                  : 'برای ثبت‌نام، کد یک‌بارمصرف به ایمیلتان ارسال می‌شود.'}
            </p>
          </div>

          <div className="glass rounded-2xl p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              {!isLogin && step === 'request' && (
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
                    disabled={step === 'verify'}
                    className="pr-10 bg-secondary/50 border-border text-foreground placeholder:text-muted-foreground disabled:opacity-70"
                    dir="ltr"
                  />
                </div>
              </div>

              {step === 'verify' && (
                <div className="space-y-2">
                  <Label htmlFor="otp" className="text-foreground">
                    کد یک بار مصرف
                  </Label>
                  <Input
                    id="otp"
                    type="text"
                    inputMode="numeric"
                    placeholder="کد ۶ رقمی"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 8))}
                    className="bg-secondary/50 border-border text-foreground placeholder:text-muted-foreground text-center tracking-[0.3em]"
                    dir="ltr"
                  />
                  <p className="text-xs text-muted-foreground leading-6">
                    اگر ایمیل را دریافت نکردید، حتماً پوشه <span className="font-semibold">Spam/Junk</span> را هم بررسی کنید.
                  </p>
                </div>
              )}

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-primary hover:opacity-90 text-primary-foreground font-medium py-6"
              >
                {isSubmitting ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : step === 'request' ? (
                  'ارسال کد تایید به ایمیل'
                ) : (
                  'تأیید کد و ورود'
                )}
              </Button>

              {step === 'verify' && (
                <div className="flex items-center justify-between gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={handleRequestOtp}
                    disabled={isSubmitting}
                  >
                    ارسال مجدد کد
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    className="flex-1"
                    onClick={resetFlow}
                    disabled={isSubmitting}
                  >
                    تغییر ایمیل
                  </Button>
                </div>
              )}
            </form>

            {step === 'request' && (
              <div className="mt-6 text-center">
                <p className="text-muted-foreground text-sm">
                  {isLogin ? 'حساب کاربری ندارید؟' : 'قبلاً ثبت‌نام کرده‌اید؟'}
                  <button
                    type="button"
                    onClick={() => {
                      setIsLogin(!isLogin);
                      resetFlow();
                    }}
                    className="text-primary hover:underline mr-1 font-medium"
                  >
                    {isLogin ? 'ثبت‌نام کنید' : 'وارد شوید'}
                  </button>
                </p>
              </div>
            )}
          </div>

          <p className="text-center text-muted-foreground text-xs mt-6 leading-6">
            با ورود یا ثبت‌نام، شما{' '}
            <Link to="/terms" className="text-primary hover:underline">
              قوانین و مقررات
            </Link>{' '}
            ما را می‌پذیرید. اگر ایمیل تأیید را ندیدید، پوشه Spam/Junk را بررسی کنید.
          </p>
        </div>
      </main>
    </div>
  );
};

export default Auth;
