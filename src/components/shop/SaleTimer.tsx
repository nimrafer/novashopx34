import { useEffect, useState } from "react";
import { Clock3 } from "lucide-react";
import { useStoreCatalog, type StorePlan } from "@/hooks/useStoreCatalog";

/**
 * Festival countdown — the website twin of the mini app's «تا پایان جشنواره»
 * ticker. Both read the same `plan.sale.ends_at` from the store API and both
 * correct the browser clock against `server_time_ms`, so a customer with a
 * wrong device clock still sees the true remaining time (and cannot fake a
 * finished sale into looking live).
 */

const parseTs = (iso?: string | null): number => {
  const raw = String(iso || "");
  if (!raw) return 0;
  const t = Date.parse(raw.includes("T") ? raw : `${raw.replace(" ", "T")}Z`);
  return Number.isFinite(t) ? t : 0;
};

const faDigits = (value: string | number) =>
  String(value).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[Number(d)]);

const remainingText = (ms: number): string => {
  if (ms <= 0) return "پایان یافت";
  const total = Math.floor(ms / 1000);
  const days = Math.floor(total / 86400);
  const two = (n: number) => String(n).padStart(2, "0");
  const clock = `${two(Math.floor((total % 86400) / 3600))}:${two(
    Math.floor((total % 3600) / 60)
  )}:${two(total % 60)}`;
  return days > 0 ? `${faDigits(days)} روز و ${faDigits(clock)}` : faDigits(clock);
};

/** A sale is live only inside its window — mirrors the mini app exactly. */
export const activeSale = (plan: StorePlan, nowMs: number) => {
  const sale = plan?.sale;
  if (!sale || !(Number(sale.sale_price) > 0) || Number(sale.sale_price) >= Number(plan.price)) {
    return null;
  }
  const ends = parseTs(sale.ends_at);
  const starts = sale.starts_at ? parseTs(sale.starts_at) : 0;
  if (!ends || nowMs >= ends || nowMs < starts) return null;
  return sale;
};

interface SaleTimerProps {
  endsAt?: string | null;
  /** `lg` for hero/checkout placements, `sm` inside plan cards. */
  size?: "sm" | "lg";
  className?: string;
  /** Render on a dark/coloured surface (checkout summary, hero). */
  tone?: "light" | "dark";
}

const SaleTimer = ({ endsAt, size = "sm", className = "", tone = "light" }: SaleTimerProps) => {
  const { serverOffset, refetch } = useStoreCatalog();
  const ends = parseTs(endsAt);
  const [remaining, setRemaining] = useState(() => ends - (Date.now() + serverOffset));

  useEffect(() => {
    if (!ends) return;
    const tick = () => setRemaining(ends - (Date.now() + serverOffset));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [ends, serverOffset]);

  // The moment it expires, pull fresh prices so the page stops advertising a
  // discount the backend no longer honours.
  useEffect(() => {
    if (ends && remaining <= 0) refetch();
  }, [ends, remaining, refetch]);

  if (!ends || remaining <= 0) return null;

  const urgent = remaining < 3_600_000;
  const dark = tone === "dark";
  const base = dark
    ? "bg-white/15 text-white border-white/20"
    : urgent
      ? "bg-destructive/10 text-destructive border-destructive/25"
      : "bg-accent/10 text-accent border-accent/25";

  return (
    <span
      dir="rtl"
      className={`inline-flex items-center gap-1.5 rounded-full border font-bold ${base} ${
        size === "lg" ? "text-sm px-3.5 py-2" : "text-[11px] px-2.5 py-1"
      } ${urgent && !dark ? "animate-pulse" : ""} ${className}`}
      // Screen readers should not re-announce every second.
      aria-label={`زمان باقی‌مانده تا پایان جشنواره: ${remainingText(remaining)}`}
    >
      <Clock3 className={size === "lg" ? "w-4 h-4" : "w-3.5 h-3.5"} aria-hidden="true" />
      <span aria-hidden="true">تا پایان جشنواره</span>
      <b aria-hidden="true" className="tabular-nums tracking-tight">
        {remainingText(remaining)}
      </b>
    </span>
  );
};

export default SaleTimer;
