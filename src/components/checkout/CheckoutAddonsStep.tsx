"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, UserRound, Wand2 } from "lucide-react";
import { formatPrice } from "@/lib/api";

export type AddonId = "expert_check" | "photo_retouching";

export interface CheckoutAddon {
  id: AddonId;
  title: string;
  description: string;
  amountCents: number;
  expandedDescription?: string;
}

export const CHECKOUT_ADDONS: CheckoutAddon[] = [
  {
    id: "expert_check",
    title: "Expert check & acceptance guarantee",
    description:
      "Add a compliance check with official requirements performed by one of our photo experts, backed by a **200% refund guarantee**",
    amountCents: 799,
  },
  {
    id: "photo_retouching",
    title: "Photo retouching",
    description:
      "Get rid of any imperfections and look your best in your ID for years to come",
    expandedDescription:
      "Our retouchers gently smooth skin, remove temporary blemishes, and balance lighting while keeping your photo government-compliant.",
    amountCents: 499,
  },
];

interface CheckoutAddonsStepProps {
  currency: string;
  selectedAddons: Set<AddonId>;
  onToggleAddon: (id: AddonId) => void;
  onSkip: () => void;
  onContinue: () => void;
}

export function CheckoutAddonsStep({
  currency,
  selectedAddons,
  onToggleAddon,
  onSkip,
  onContinue,
}: CheckoutAddonsStepProps) {
  return (
    <>
      <div className="flex items-start justify-between gap-4">
        <h1 className="font-serif text-2xl font-bold text-navy md:text-[28px]">
          Upgrade your order (optional)
        </h1>
        <button
          type="button"
          onClick={onSkip}
          className="shrink-0 pt-1 text-sm text-[#666] underline-offset-2 hover:text-navy hover:underline"
        >
          Skip
        </button>
      </div>

      <div className="mt-6 space-y-4">
        {CHECKOUT_ADDONS.map((addon) => (
          <AddonCard
            key={addon.id}
            addon={addon}
            currency={currency}
            selected={selectedAddons.has(addon.id)}
            onToggle={() => onToggleAddon(addon.id)}
          />
        ))}
      </div>

      <button
        type="button"
        onClick={onContinue}
        className="mt-6 flex h-[52px] w-full items-center justify-center rounded-lg bg-[#4e4bdc] text-base font-semibold text-white transition hover:bg-[#3f3ac6]"
      >
        Continue
      </button>
    </>
  );
}

function AddonCard({
  addon,
  currency,
  selected,
  onToggle,
}: {
  addon: CheckoutAddon;
  currency: string;
  selected: boolean;
  onToggle: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const Icon = addon.id === "expert_check" ? UserRound : Wand2;

  return (
    <label
      className={`block cursor-pointer rounded-xl border-2 bg-white transition ${
        selected
          ? "border-navy shadow-[0_2px_12px_rgba(0,0,0,0.06)]"
          : "border-[#e0e3e8] hover:border-[#c5cad3]"
      }`}
    >
      <div className="flex items-start gap-3 p-5">
        <input
          type="checkbox"
          checked={selected}
          onChange={onToggle}
          className="mt-1 h-4 w-4 rounded accent-navy"
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <span className="text-base font-semibold text-navy">{addon.title}</span>
            <span className="shrink-0 text-base font-semibold text-navy">
              +{formatPrice(addon.amountCents, currency)}
            </span>
          </div>
          <div className="mt-3 flex items-start gap-2.5">
            <Icon className="mt-0.5 h-4 w-4 shrink-0 text-[#999]" aria-hidden="true" />
            <p className="text-sm leading-6 text-[#666]">
              {addon.id === "expert_check" ? (
                <>
                  Add a compliance check with official requirements performed by
                  one of our photo experts, backed by a{" "}
                  <strong className="font-semibold text-navy">
                    200% refund guarantee
                  </strong>
                </>
              ) : (
                addon.description
              )}
            </p>
          </div>

          {addon.expandedDescription ? (
            <div className="mt-3 pl-6">
              {expanded ? (
                <p className="text-sm leading-6 text-[#666]">
                  {addon.expandedDescription}
                </p>
              ) : null}
              <button
                type="button"
                onClick={(event) => {
                  event.preventDefault();
                  setExpanded((value) => !value);
                }}
                className="mt-1 inline-flex items-center gap-1 text-sm text-[#666] hover:text-navy"
              >
                {expanded ? "Show less" : "Show more"}
                {expanded ? (
                  <ChevronUp className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <ChevronDown className="h-4 w-4" aria-hidden="true" />
                )}
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </label>
  );
}
