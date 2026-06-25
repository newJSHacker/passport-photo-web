"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  CheckoutAddonsStep,
  CHECKOUT_ADDONS,
  type AddonId,
} from "@/components/checkout/CheckoutAddonsStep";
import {
  CheckoutOptionCard,
  printPriceForCopies,
  type PrintCopies,
} from "@/components/checkout/CheckoutOptionCard";
import { CheckoutPaymentStep } from "@/components/checkout/CheckoutPaymentStep";
import { CheckoutSummary } from "@/components/checkout/CheckoutSummary";
import { CheckoutTrustSection } from "@/components/checkout/CheckoutTrustSection";
import {
  createCheckoutSession,
  fetchCheckoutPricing,
  fetchDocument,
  getPhotoJob,
  photoFileUrl,
  type CheckoutPricingOption,
  type DocumentSpecDetail,
  type PhotoJob,
} from "@/lib/api";
import { saveCheckoutOrder } from "@/lib/checkout-storage";

type CheckoutStep = 1 | 2 | 3;

function formatSizeLabel(document: DocumentSpecDetail | null): string {
  if (!document) return "2×2 in";
  const { width_px, height_px, dpi } = document.dimensions;
  const w = Number((width_px / dpi).toFixed(1)).toString().replace(/\.0$/, "");
  const h = Number((height_px / dpi).toFixed(1)).toString().replace(/\.0$/, "");
  return `${w}×${h} in`;
}

function CheckoutPageContent() {
  const searchParams = useSearchParams();
  const jobId = searchParams.get("job");

  const [step, setStep] = useState<CheckoutStep>(1);
  const [job, setJob] = useState<PhotoJob | null>(null);
  const [document, setDocument] = useState<DocumentSpecDetail | null>(null);
  const [options, setOptions] = useState<CheckoutPricingOption[]>([]);
  const [deliveryType, setDeliveryType] = useState<"digital" | "print">("digital");
  const [printCopies, setPrintCopies] = useState<PrintCopies>(6);
  const [selectedAddons, setSelectedAddons] = useState<Set<AddonId>>(new Set());
  const [email, setEmail] = useState("");
  const [orderNote, setOrderNote] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!jobId) {
      setLoading(false);
      setError("Missing photo job. Start from the create flow.");
      return;
    }

    const activeJobId = jobId;
    let cancelled = false;

    async function load() {
      try {
        const jobData = await getPhotoJob(activeJobId);
        if (cancelled) return;
        if (jobData.status !== "completed") {
          setError("Your photo is not ready yet. Please finish processing first.");
          return;
        }

        const [pricing, doc] = await Promise.all([
          fetchCheckoutPricing(),
          fetchDocument(jobData.document_id),
        ]);
        if (cancelled) return;

        setJob(jobData);
        setDocument(doc);
        setOptions(pricing.options);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load checkout");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [jobId]);

  const digitalOption = options.find((o) => o.id === "digital");
  const printOption = options.find((o) => o.id === "print");
  const selectedOption = deliveryType === "digital" ? digitalOption : printOption;

  const baseProductCents = useMemo(() => {
    if (!selectedOption) return 0;
    if (deliveryType === "print") {
      return printPriceForCopies(selectedOption.amount_cents, printCopies);
    }
    return selectedOption.amount_cents;
  }, [selectedOption, deliveryType, printCopies]);

  const baseProductLabel = useMemo(() => {
    if (deliveryType === "print") {
      return "Digital Photo + Printouts";
    }
    return "Digital Photo";
  }, [deliveryType]);

  const summaryLineItems = useMemo(() => {
    const items = [{ label: baseProductLabel, amountCents: baseProductCents }];
    for (const addon of CHECKOUT_ADDONS) {
      if (selectedAddons.has(addon.id)) {
        items.push({ label: addon.title, amountCents: addon.amountCents });
      }
    }
    return items;
  }, [baseProductLabel, baseProductCents, selectedAddons]);

  const totalCents = useMemo(
    () => summaryLineItems.reduce((sum, item) => sum + item.amountCents, 0),
    [summaryLineItems],
  );

  const previewUrl = job?.preview_url
    ? photoFileUrl(`${job.preview_url}?v=${job.id}`)
    : null;

  function toggleAddon(id: AddonId) {
    setSelectedAddons((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function goToPayment() {
    setStep(3);
  }

  async function handlePay() {
    if (!jobId || !email.trim()) return;

    const activeJobId = jobId;
    setSubmitting(true);
    setError(null);

    try {
      const result = await createCheckoutSession({
        photo_job_id: activeJobId,
        email: email.trim(),
        delivery_type: deliveryType,
        print_copies: deliveryType === "print" ? printCopies : undefined,
        addons: Array.from(selectedAddons),
      });
      saveCheckoutOrder({
        order_id: result.order_id,
        photo_job_id: result.photo_job_id ?? activeJobId,
        email: result.email ?? email.trim(),
        demo_mode: result.demo_mode,
      });
      window.location.href = result.checkout_url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Checkout failed");
      setSubmitting(false);
    }
  }

  if (!jobId) {
    return (
      <div className="bg-page py-10 md:py-14">
        <div className="container-main max-w-lg text-center">
          <h1 className="typography-h2">Checkout</h1>
          <p className="mt-4 text-grey">No photo selected.</p>
          <Button asChild className="mt-6">
            <Link href="/create">Create a photo</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-page py-8 md:py-12">
      <div className="container-main">
        {loading ? (
          <p className="text-grey">Loading…</p>
        ) : error && !job ? (
          <div className="mx-auto max-w-lg rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-800">
            {error}
            <div className="mt-4">
              <Button asChild variant="outline">
                <Link href="/create">Back to create</Link>
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0 flex-1 lg:max-w-[640px]">
              {step === 1 ? (
                <>
                  <h1 className="font-serif text-2xl font-bold text-navy md:text-[28px]">
                    Choose the photo option
                  </h1>

                  <div className="mt-6 space-y-4">
                    {digitalOption ? (
                      <CheckoutOptionCard
                        id="digital"
                        title="Digital Photo"
                        amountCents={digitalOption.amount_cents}
                        currency={digitalOption.currency}
                        selected={deliveryType === "digital"}
                        onSelect={() => setDeliveryType("digital")}
                      />
                    ) : null}

                    {printOption ? (
                      <CheckoutOptionCard
                        id="print"
                        title="Digital Photo + Printouts"
                        amountCents={printOption.amount_cents}
                        currency={printOption.currency}
                        selected={deliveryType === "print"}
                        onSelect={() => setDeliveryType("print")}
                        printCopies={printCopies}
                        onPrintCopiesChange={setPrintCopies}
                      />
                    ) : null}
                  </div>

                  <Button
                    type="button"
                    className="mt-6 h-[52px] w-full rounded-lg bg-[#4e4bdc] text-base font-semibold hover:bg-[#3f3ac6]"
                    onClick={() => setStep(2)}
                  >
                    Continue
                  </Button>

                  <CheckoutTrustSection />
                </>
              ) : null}

              {step === 2 && selectedOption ? (
                <>
                  <CheckoutAddonsStep
                    currency={selectedOption.currency}
                    selectedAddons={selectedAddons}
                    onToggleAddon={toggleAddon}
                    onSkip={goToPayment}
                    onContinue={goToPayment}
                  />
                  <CheckoutTrustSection />
                </>
              ) : null}

              {step === 3 && selectedOption ? (
                <CheckoutPaymentStep
                  email={email}
                  onEmailChange={setEmail}
                  orderNote={orderNote}
                  onOrderNoteChange={setOrderNote}
                  totalCents={totalCents}
                  currency={selectedOption.currency}
                  submitting={submitting}
                  error={error}
                  onPay={() => void handlePay()}
                />
              ) : null}
            </div>

            {selectedOption ? (
              <CheckoutSummary
                step={step}
                documentName={document?.name ?? "Passport Photo"}
                sizeLabel={formatSizeLabel(document)}
                previewUrl={previewUrl}
                lineItems={summaryLineItems}
                currency={selectedOption.currency}
                onBack={() => setStep((current) => Math.max(1, current - 1) as CheckoutStep)}
              />
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="bg-page py-8 md:py-12">
          <div className="container-main">
            <p className="text-grey">Loading…</p>
          </div>
        </div>
      }
    >
      <CheckoutPageContent />
    </Suspense>
  );
}
