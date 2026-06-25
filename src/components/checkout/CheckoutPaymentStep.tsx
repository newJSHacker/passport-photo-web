"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { formatPrice } from "@/lib/api";
import {
  CHECKOUT_TEST_CARD_CVV,
  CHECKOUT_TEST_CARD_EXPIRY,
  CHECKOUT_TEST_CARD_NUMBER,
  CHECKOUT_TEST_EMAIL,
  isCheckoutTestPrefillEnabled,
} from "@/lib/checkout-test-data";

export type PaymentMethod = "card" | "paypal" | "google_pay";

interface CheckoutPaymentStepProps {
  email: string;
  onEmailChange: (value: string) => void;
  orderNote: string;
  onOrderNoteChange: (value: string) => void;
  totalCents: number;
  currency: string;
  submitting: boolean;
  error: string | null;
  onPay: () => void;
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function CheckoutPaymentStep({
  email,
  onEmailChange,
  orderNote,
  onOrderNoteChange,
  totalCents,
  currency,
  submitting,
  error,
  onPay,
}: CheckoutPaymentStepProps) {
  const testPrefill = isCheckoutTestPrefillEnabled();
  const prefillApplied = useRef(false);
  const [termsAccepted, setTermsAccepted] = useState(testPrefill);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
  const [cardNumber, setCardNumber] = useState(
    testPrefill ? CHECKOUT_TEST_CARD_NUMBER : "",
  );
  const [expiry, setExpiry] = useState(
    testPrefill ? CHECKOUT_TEST_CARD_EXPIRY : "",
  );
  const [cvv, setCvv] = useState(testPrefill ? CHECKOUT_TEST_CARD_CVV : "");

  useEffect(() => {
    if (!testPrefill || prefillApplied.current) return;
    prefillApplied.current = true;
    if (!email.trim()) {
      onEmailChange(CHECKOUT_TEST_EMAIL);
    }
  }, [testPrefill, email, onEmailChange]);

  const cardFieldsValid = useMemo(() => {
    if (paymentMethod !== "card") return true;
    const digits = cardNumber.replace(/\s/g, "");
    return digits.length >= 15 && expiry.trim().length >= 4 && cvv.trim().length >= 3;
  }, [paymentMethod, cardNumber, expiry, cvv]);

  const canPay =
    isValidEmail(email) && termsAccepted && cardFieldsValid && !submitting;

  const payLabel = `Pay now - ${formatPrice(totalCents, currency)}`;

  return (
    <div className="space-y-8">
      {testPrefill ? (
        <p className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-900">
          Test mode — form pre-filled with sample email and card details.
        </p>
      ) : null}

      <section>
        <h2 className="text-xl font-bold text-navy">Enter your email</h2>
        <p className="mt-1 text-sm text-[#666]">
          We&apos;ll send your order confirmation and your digital photo
        </p>

        <div className="mt-5 space-y-4">
          <div>
            <label htmlFor="checkout-email" className="text-sm text-navy">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              id="checkout-email"
              type="email"
              required
              value={email}
              onChange={(event) => onEmailChange(event.target.value)}
              placeholder="e.g. john@example.com"
              className="mt-1.5 w-full rounded-lg border border-[#d5d5dc] bg-white px-4 py-3 text-base text-navy outline-none focus:border-[#4e4bdc] focus:ring-2 focus:ring-[#4e4bdc]/20"
            />
          </div>

          <div>
            <label htmlFor="checkout-note" className="text-sm text-navy">
              Order note (optional)
            </label>
            <textarea
              id="checkout-note"
              rows={3}
              value={orderNote}
              onChange={(event) => onOrderNoteChange(event.target.value)}
              placeholder="special preferences, information about disabilities, etc."
              className="mt-1.5 w-full resize-none rounded-lg border border-[#d5d5dc] bg-white px-4 py-3 text-base text-navy outline-none focus:border-[#4e4bdc] focus:ring-2 focus:ring-[#4e4bdc]/20"
            />
          </div>

          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              checked={termsAccepted}
              onChange={(event) => setTermsAccepted(event.target.checked)}
              className="mt-1 h-4 w-4 rounded accent-navy"
            />
            <span className="text-sm leading-6 text-[#666]">
              By placing this order, you agree to our{" "}
              <Link
                href="/about"
                className="font-medium text-navy underline underline-offset-2"
              >
                Privacy Policy
              </Link>{" "}
              and{" "}
              <Link
                href="/about"
                className="font-medium text-navy underline underline-offset-2"
              >
                Terms of Use
              </Link>
            </span>
          </label>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold text-navy">Choose payment method</h2>

        <div className="mt-5 space-y-3">
          <PaymentMethodOption
            id="card"
            label="Payment cards"
            selected={paymentMethod === "card"}
            onSelect={() => setPaymentMethod("card")}
            trailing={<CardBrandLogos />}
          >
            <div className="mt-4 space-y-4 border-t border-[#e8eaed] pt-4">
              <div>
                <label htmlFor="card-number" className="text-sm text-navy">
                  Card number
                </label>
                <input
                  id="card-number"
                  type="text"
                  inputMode="numeric"
                  autoComplete="cc-number"
                  value={cardNumber}
                  onChange={(event) =>
                    setCardNumber(formatCardNumber(event.target.value))
                  }
                  placeholder="0000 0000 0000 0000"
                  className="mt-1.5 w-full rounded-lg border border-[#d5d5dc] bg-white px-4 py-3 text-base text-navy outline-none focus:border-[#4e4bdc] focus:ring-2 focus:ring-[#4e4bdc]/20"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="card-expiry" className="text-sm text-navy">
                    Expiry date
                  </label>
                  <input
                    id="card-expiry"
                    type="text"
                    inputMode="numeric"
                    autoComplete="cc-exp"
                    value={expiry}
                    onChange={(event) =>
                      setExpiry(formatExpiry(event.target.value))
                    }
                    placeholder="MM/YY"
                    className="mt-1.5 w-full rounded-lg border border-[#d5d5dc] bg-white px-4 py-3 text-base text-navy outline-none focus:border-[#4e4bdc] focus:ring-2 focus:ring-[#4e4bdc]/20"
                  />
                </div>
                <div>
                  <label htmlFor="card-cvv" className="text-sm text-navy">
                    CVV/CVC code
                  </label>
                  <input
                    id="card-cvv"
                    type="text"
                    inputMode="numeric"
                    autoComplete="cc-csc"
                    value={cvv}
                    onChange={(event) =>
                      setCvv(event.target.value.replace(/\D/g, "").slice(0, 4))
                    }
                    placeholder="123"
                    className="mt-1.5 w-full rounded-lg border border-[#d5d5dc] bg-white px-4 py-3 text-base text-navy outline-none focus:border-[#4e4bdc] focus:ring-2 focus:ring-[#4e4bdc]/20"
                  />
                </div>
              </div>
            </div>
          </PaymentMethodOption>

          <PaymentMethodOption
            id="paypal"
            label="PayPal"
            selected={paymentMethod === "paypal"}
            onSelect={() => setPaymentMethod("paypal")}
            trailing={<PayPalLogo />}
          />

          <PaymentMethodOption
            id="google_pay"
            label="Google Pay"
            selected={paymentMethod === "google_pay"}
            onSelect={() => setPaymentMethod("google_pay")}
            trailing={<GooglePayLogo />}
          />
        </div>
      </section>

      {error ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </p>
      ) : null}

      <button
        type="button"
        disabled={!canPay}
        onClick={onPay}
        className={`flex h-[52px] w-full items-center justify-center rounded-lg text-base font-semibold transition ${
          canPay
            ? "bg-[#4e4bdc] text-white hover:bg-[#3f3ac6]"
            : "cursor-not-allowed bg-[#e8eaed] text-[#999]"
        }`}
      >
        {submitting ? "Processing…" : payLabel}
      </button>
    </div>
  );
}

function PaymentMethodOption({
  id,
  label,
  selected,
  onSelect,
  trailing,
  children,
}: {
  id: string;
  label: string;
  selected: boolean;
  onSelect: () => void;
  trailing?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={`rounded-xl border-2 bg-white transition ${
        selected ? "border-navy" : "border-[#e0e3e8]"
      }`}
    >
      <label className="flex cursor-pointer items-center gap-3 p-4">
        <input
          type="radio"
          name="payment-method"
          value={id}
          checked={selected}
          onChange={() => onSelect()}
          className="h-4 w-4 accent-navy"
        />
        <span className="flex-1 text-base font-semibold text-navy">{label}</span>
        {trailing}
      </label>
      {selected && children ? <div className="px-4 pb-4 pl-11">{children}</div> : null}
    </div>
  );
}

function CardBrandLogos() {
  return (
    <div className="flex items-center gap-1.5">
      <BrandBadge label="VISA" className="bg-[#1a1f71] text-white" />
      <BrandBadge label="MC" className="bg-[#eb001b] text-white" />
      <BrandBadge label="AMEX" className="bg-[#006fcf] text-white" />
      <BrandBadge label="DISC" className="bg-[#ff6000] text-white" />
    </div>
  );
}

function BrandBadge({
  label,
  className,
}: {
  label: string;
  className: string;
}) {
  return (
    <span
      className={`rounded px-1.5 py-0.5 text-[9px] font-bold tracking-wide ${className}`}
    >
      {label}
    </span>
  );
}

function PayPalLogo() {
  return (
    <span className="rounded bg-[#003087] px-2 py-1 text-[10px] font-bold tracking-wide text-white">
      Pay<span className="text-[#009cde]">Pal</span>
    </span>
  );
}

function GooglePayLogo() {
  return (
    <span className="rounded border border-[#d5d5dc] bg-white px-2 py-1 text-[10px] font-semibold text-[#5f6368]">
      G Pay
    </span>
  );
}

function formatCardNumber(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 16);
  return digits.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
}

function formatExpiry(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}
