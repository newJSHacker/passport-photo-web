import { ChevronLeft, Lock } from "lucide-react";
import { formatPrice } from "@/lib/api";

type CheckoutStep = 1 | 2 | 3;

const STEP_LABELS: Record<CheckoutStep, string> = {
  1: "Photo option",
  2: "Addons (optional)",
  3: "Payment",
};

export interface SummaryLineItem {
  label: string;
  amountCents: number;
}

interface CheckoutSummaryProps {
  step: CheckoutStep;
  documentName: string;
  sizeLabel: string;
  previewUrl: string | null;
  lineItems: SummaryLineItem[];
  currency: string;
  onBack?: () => void;
}

export function CheckoutSummary({
  step,
  documentName,
  sizeLabel,
  previewUrl,
  lineItems,
  currency,
  onBack,
}: CheckoutSummaryProps) {
  const progressPct = (step / 3) * 100;
  const totalCents = lineItems.reduce((sum, item) => sum + item.amountCents, 0);

  return (
    <aside className="w-full lg:max-w-[380px]">
      <div className="lg:sticky lg:top-6">
        <div className="mb-4">
          {step > 1 && onBack ? (
            <button
              type="button"
              onClick={onBack}
              className="mb-2 inline-flex items-center gap-1 text-sm text-[#666] hover:text-navy"
            >
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            </button>
          ) : null}
          <p className="text-sm font-medium text-navy">
            Step {step}/3: {STEP_LABELS[step]}
          </p>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#e8eaed]">
            <div
              className="h-full rounded-full bg-[#28bb8f] transition-all duration-300"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-[#e0e3e8] bg-white shadow-sm">
          <div className="bg-gradient-to-br from-[#e8f4fc] to-[#f0f8ff] px-5 py-4">
            <p className="text-base font-semibold text-navy">{documentName}</p>
            <p className="mt-0.5 text-sm text-[#666]">Size: {sizeLabel}</p>
            {previewUrl ? (
              <div className="relative mx-auto mt-4 w-[120px]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={previewUrl}
                  alt="Your passport photo"
                  className="aspect-square w-full rounded border border-white object-cover shadow-md"
                />
              </div>
            ) : null}
          </div>

          <div className="space-y-3 px-5 py-4">
            {lineItems.map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between text-sm"
              >
                <span className="text-navy">{item.label}</span>
                <span className="font-medium text-navy">
                  {formatPrice(item.amountCents, currency)}
                </span>
              </div>
            ))}
            <div className="flex items-center justify-between border-t border-[#e8eaed] pt-3">
              <span className="text-sm font-semibold text-navy">
                Total (tax included)
              </span>
              <span className="text-lg font-bold text-[#28bb8f]">
                {formatPrice(totalCents, currency)}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-4 rounded-xl border border-[#e0e3e8] bg-white px-4 py-3">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-[#f5f6f7] text-[10px] font-bold leading-tight text-navy">
              ICAO
              <br />
              9303
            </div>
            <p className="text-xs leading-5 text-[#666]">
              Complies with internationally recognised government standards.
            </p>
          </div>
        </div>

        <p className="mt-4 flex items-center justify-center gap-2 text-xs text-[#666]">
          <Lock className="h-3.5 w-3.5 text-[#28bb8f]" aria-hidden="true" />
          SSL-Secured Payment
        </p>
      </div>
    </aside>
  );
}
