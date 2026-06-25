"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  getOrder,
  getOrderByJob,
  getOrderBySession,
  photoFileUrl,
  type Order,
} from "@/lib/api";
import {
  clearCheckoutOrder,
  orderFromStored,
  readCheckoutOrder,
} from "@/lib/checkout-storage";

async function resolveOrder(params: {
  orderId: string | null;
  sessionId: string | null;
  jobId: string | null;
  isDemo: boolean;
}): Promise<Order | null> {
  const { orderId, sessionId, jobId, isDemo } = params;

  if (orderId) {
    try {
      return await getOrder(orderId);
    } catch {
      // fall through to job lookup
    }
  }

  if (sessionId) {
    return await getOrderBySession(sessionId);
  }

  if (jobId) {
    try {
      return await getOrderByJob(jobId);
    } catch {
      // fall through to session storage in demo mode
    }
  }

  if (isDemo) {
    const stored = readCheckoutOrder();
    if (stored && (!orderId || stored.order_id === orderId)) {
      return orderFromStored(stored);
    }
  }

  return null;
}

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id");
  const sessionId = searchParams.get("session_id");
  const jobId = searchParams.get("job_id");
  const emailParam = searchParams.get("email");
  const isDemo = searchParams.get("demo") === "1";

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId && !sessionId && !jobId && !isDemo) {
      setLoading(false);
      setError("Missing order reference.");
      return;
    }

    let cancelled = false;

    async function load() {
      try {
        const data = await resolveOrder({
          orderId,
          sessionId,
          jobId,
          isDemo,
        });
        if (cancelled) return;

        if (!data) {
          setError("Order not found. Your payment may still have gone through — try again in a moment.");
          return;
        }

        if (data.status !== "paid") {
          setError("Payment is still processing. Please refresh in a moment.");
          return;
        }

        setOrder(data);
        clearCheckoutOrder();
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
  }, [orderId, sessionId, jobId, isDemo]);

  const downloadUrl = order?.download_url
    ? photoFileUrl(order.download_url)
    : null;

  const displayEmail = order?.email ?? emailParam;

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
            {displayEmail ? (
              <p className="mt-4 text-base text-grey">
                Your photo has been sent to{" "}
                <span className="font-medium text-navy">{displayEmail}</span>.
              </p>
            ) : null}
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

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="bg-page py-10 md:py-14">
          <div className="container-main max-w-lg text-center">
            <p className="text-grey">Loading…</p>
          </div>
        </div>
      }
    >
      <CheckoutSuccessContent />
    </Suspense>
  );
}
