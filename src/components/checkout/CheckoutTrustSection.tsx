import { Check } from "lucide-react";

const TRUST_ITEMS = [
  {
    title: "Expert verification",
    description:
      "Our experts manually check each photo to ensure it meets government standards.",
  },
  {
    title: "200% money-back guarantee",
    description:
      "Receive double your payment back if your photo is rejected.",
  },
  {
    title: "Image protection",
    description:
      "We dedicate all our efforts to ensuring the safety of your photos.",
  },
] as const;

export function CheckoutTrustSection() {
  return (
    <section className="mt-10 border-t border-[#e8eaed] pt-8">
      <h2 className="font-serif text-xl font-bold text-navy">
        Safe with Passport Photo Online
      </h2>
      <p className="mt-1 text-sm text-[#666]">We care about you and your data.</p>
      <ul className="mt-5 space-y-4">
        {TRUST_ITEMS.map((item) => (
          <li key={item.title} className="flex gap-3">
            <Check
              className="mt-0.5 h-5 w-5 shrink-0 text-[#28bb8f]"
              aria-hidden="true"
            />
            <div>
              <p className="text-sm font-semibold text-navy">{item.title}</p>
              <p className="mt-0.5 text-sm leading-6 text-[#666]">
                {item.description}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
