import { Package } from "lucide-react";
import { useParams } from "react-router-dom";
import ServicePageLayout from "@/components/shop/ServicePageLayout";
import { usePricesContext } from "@/contexts/PricesContext";

const DynamicServicePage = () => {
  const { serviceSlug = "" } = useParams();
  const { catalog, loading } = usePricesContext();
  const service = catalog.find((item) => item.slug === serviceSlug || item.id === serviceSlug);

  if (!service && loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-background px-4 text-center">
        <h1 className="text-2xl font-bold">این سرویس در کاتالوگ فعال ربات نیست</h1>
        <a href="/" className="text-primary hover:underline">بازگشت به فروشگاه</a>
      </div>
    );
  }

  return (
    <ServicePageLayout
      serviceId={service.id}
      icon={Package}
      logoSrc={service.logo}
      title={service.name}
      subtitle={`${service.plans.length.toLocaleString("fa-IR")} پلن فعال`}
      description={service.description || `پلن‌های فعال ${service.name} با قیمت همگام با ربات نوا شاپ.`}
      color={service.color || "#7C3AED"}
      features={[
        "قیمت و موجودی همگام با ربات نوا شاپ",
        "ثبت سفارش مستقیم و پیگیری از پنل کاربری",
        "پشتیبانی فارسی پس از خرید",
      ]}
      plans={service.plans}
    />
  );
};

export default DynamicServicePage;
