"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  getOrder,
  getOrderBySession,
  photoFileUrl,
  type Order,
} from "@/lib/api";

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id");
  const sessionId = searchParams.get("session_id");
  const isDemo = searchParams.get("demo") === "1";

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId && !sessionId) {
      setLoading(false);
      setError("Missing order reference.");
      return;
    }

    let cancelled = false;

    async function load() {
      try {
        const data = orderId
          ? await getOrder(orderId)
          : await getOrderBySession(sessionId!);
        if (cancelled) return;
        if (data.status !== "paid") {
          setError("Payment is still processing. Please refresh in a moment.");
          return;
        }
        setOrder(data);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Could not load order");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [orderId, sessionId]);

  const downloadUrl = order?.download_url
    ? photoFileUrl(order.download_url)
    : null;

  return (
    <div className="bg-page py-10 md:py-14">
      <div className="container-main max-w-lg text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#e8f8f2] text-[#28bb8f]">
          <Check className="h-8 w-8" aria-hidden="true" />
        </div>
        <h1 className="typography-h2 mt-6">Payment successful</h1>

        {isDemo ? (
          <p className="mt-3 rounded-lg bg-amber-50 px-4 py-2 text-sm text-amber-900">
            Demo mode — no real charge. Set Stripe keys and{" "}
            <code className="text-xs">CHECKOUT_DEMO_MODE=false</code> for live
            payments.
          </p>
        ) : null}

        {loading ? (
          <p className="mt-6 text-grey">Confirming your order…</p>
        ) : error ? (
          <p className="mt-6 text-red-700">{error}</p>
        ) : order ? (
          <>
            <p className="mt-4 text-base text-grey">
              Your photo has been sent to{" "}
              <span className="font-medium text-navy">{order.email}</span>.
            </p>
            {downloadUrl ? (
              <Button asChild className="mt-8 h-[52px] min-w-[240px] bg-[#4e4bdc] hover:bg-[#3f3ac6]">
                <a href={downloadUrl} download>
                  Download full-resolution photo
                </a>
              </Button>
            ) : null}
          </>
        ) : null}

        <Button asChild variant="outline" className="mt-4">
          <Link href="/create">Create another photo</Link>
        </Button>
      </div>
    </div>
  );
}
