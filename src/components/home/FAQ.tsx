"use client";

import { useState } from "react";

const faqs = [
  {
    question: "Can I take my own passport photograph?",
    answer:
      "Yes, you can take your own passport photos. With Digital Passport Photos, you can simply use your smartphone to snap a photo or upload an existing one. The service will get your photo ready for paper and digital applications, making sure it meets all the official requirements.",
  },
  {
    question: "What's the cheapest place to get a passport photo?",
    answer:
      "For physical US passport photos, Walmart offers them at only $7.64 nationwide. However, for digital passport photos, Digital Passport Photos provides compliant pictures at an extremely competitive price of $16.95 for digital and $19.95 for printed photos, with delivery included.",
  },
  {
    question: "What's the best place to get passport photos?",
    answer:
      "The best place to get a passport photo depends on your specific needs. If you're looking for comprehensive passport services, USPS offers a full range of services, including photos. If you prefer to take your pictures at home, Digital Passport Photos ensures that your photo meets all necessary requirements.",
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="section-padding bg-section">
      <div className="container-main max-w-[800px]">
        <h2 className="typography-h2">FAQ</h2>

        <div className="mt-8 divide-y divide-[#d5d5dc] rounded-lg border border-[#d5d5dc] bg-white">
          {faqs.map((faq, index) => {
            const open = openIndex === index;
            return (
              <div key={faq.question} className="faq-item border-0">
                <button
                  type="button"
                  onClick={() => setOpenIndex(open ? null : index)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                >
                  <span className="text-lg font-medium text-navy">
                    {faq.question}
                  </span>
                  <span
                    className={`flex h-6 w-6 flex-shrink-0 items-center justify-center text-brand transition-transform ${open ? "rotate-45" : ""}`}
                  >
                    +
                  </span>
                </button>
                {open && (
                  <div className="px-6 pb-5 text-sm leading-6 text-navy">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
