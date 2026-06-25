import { Download, ShieldCheck, Truck } from "lucide-react";
import { formatPrice } from "@/lib/api";

export type PrintCopies = 2 | 4 | 6;

const PRINT_COPY_ADJUSTMENTS: Record<PrintCopies, number> = {
  2: -400,
  4: -150,
  6: 400,
};

export function printPriceForCopies(baseCents: number, copies: PrintCopies): number {
  return baseCents + PRINT_COPY_ADJUSTMENTS[copies];
}

interface CheckoutOptionCardProps {
  id: "digital" | "print";
  title: string;
  amountCents: number;
  currency: string;
  selected: boolean;
  onSelect: () => void;
  printCopies?: PrintCopies;
  onPrintCopiesChange?: (copies: PrintCopies) => void;
}

export function CheckoutOptionCard({
  id,
  title,
  amountCents,
  currency,
  selected,
  onSelect,
  printCopies = 6,
  onPrintCopiesChange,
}: CheckoutOptionCardProps) {
  const displayPrice =
    id === "print" && selected
      ? printPriceForCopies(amountCents, printCopies)
      : amountCents;

  return (
    <label
      className={`block cursor-pointer rounded-xl border-2 bg-white transition ${
        selected
          ? "border-navy shadow-[0_2px_12px_rgba(0,0,0,0.06)]"
          : "border-[#e0e3e8] hover:border-[#c5cad3]"
      }`}
    >
      <div className="flex items-start gap-3 p-5" onClick={onSelect}>
        <input
          type="radio"
          name="delivery"
          checked={selected}
          onChange={onSelect}
          className="mt-1 h-4 w-4 accent-navy"
        />
        <div className="flex flex-1 items-start justify-between gap-4">
          <span className="text-base font-semibold text-navy">{title}</span>
          <span className="shrink-0 text-base font-semibold text-navy">
            {formatPrice(displayPrice, currency)}
          </span>
        </div>
      </div>

      <div className="space-y-2.5 px-5 pb-5 pl-12">
        {id === "digital" ? (
          <>
            <FeatureRow
              icon={<Download className="h-4 w-4" />}
              text="Instant online download"
            />
            <FeatureRow
              icon={<ShieldCheck className="h-4 w-4" />}
              text="Ready for online submission and self-printing"
            />
            <div className="mt-3 rounded-lg bg-[#f5f6f7] px-4 py-3">
              <p className="text-xs font-medium text-navy">You can print at:</p>
              <div className="mt-2 flex flex-wrap items-center gap-3">
                <StoreBadge label="CVS" />
                <StoreBadge label="Walgreens" />
                <StoreBadge label="Walmart" />
              </div>
              <p className="mt-2 text-[10px] leading-4 text-[#999]">
                These stores are not affiliated with our service.
              </p>
            </div>
          </>
        ) : (
          <>
            <FeatureRow
              icon={<Truck className="h-4 w-4" />}
              text="Printed photos with free delivery"
            />
            <FeatureRow
              icon={<ShieldCheck className="h-4 w-4" />}
              text="Digital photo for online submission and self-printing"
            />
            <div className="mt-3 rounded-lg bg-[#f5f6f7] px-4 py-3 text-xs text-[#666]">
              <p>Estimated delivery: 2–3 business days</p>
              <p className="mt-1 flex items-center gap-2">
                Shipping:
                <span className="rounded bg-[#333366] px-2 py-0.5 text-[10px] font-bold tracking-wide text-white">
                  USPS
                </span>
              </p>
            </div>

            {selected && onPrintCopiesChange ? (
              <div className="pt-2">
                <p className="text-xs text-[#666]">Choose number of printouts</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {([2, 4, 6] as const).map((copies) => {
                    const adjustment = PRINT_COPY_ADJUSTMENTS[copies];
                    const label =
                      copies === 6
                        ? "6 prints"
                        : `${copies} (${adjustment < 0 ? "-" : "+"}$${Math.abs(adjustment / 100).toFixed(2)})`;

                    return (
                      <button
                        key={copies}
                        type="button"
                        onClick={(event) => {
                          event.preventDefault();
                          onPrintCopiesChange(copies);
                        }}
                        className={`rounded-lg border px-3 py-2 text-xs font-medium transition ${
                          printCopies === copies
                            ? "border-navy bg-white text-navy"
                            : "border-[#d5d5dc] bg-white text-[#666] hover:border-[#999]"
                        }`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : null}
          </>
        )}
      </div>
    </label>
  );
}

function FeatureRow({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-2.5 text-sm text-[#666]">
      <span className="text-[#999]">{icon}</span>
      {text}
    </div>
  );
}

function StoreBadge({ label }: { label: string }) {
  return (
    <span className="rounded border border-[#d5d5dc] bg-white px-2.5 py-1 text-[11px] font-semibold text-navy">
      {label}
    </span>
  );
}
