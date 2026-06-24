"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { OnlineCmsImage } from "@/components/OnlineCmsImage";
import {
  howItWorksTabs,
  isHowItWorksTabId,
  type HowItWorksTab,
  type HowItWorksTabId,
} from "@/lib/how-it-works-pages";

interface HowItWorksAccordionProps {
  defaultTab?: string;
}

function TabPanelContent({
  tab,
  deliveryIndex,
  onDeliveryIndexChange,
}: {
  tab: HowItWorksTab;
  deliveryIndex: number;
  onDeliveryIndexChange: (index: number) => void;
}) {
  if (tab.slug === "delivery" && tab.deliveryOptions) {
    const option = tab.deliveryOptions[deliveryIndex] ?? tab.deliveryOptions[0];

    return (
      <>
        <div className="flex flex-wrap gap-2 border-b border-[#e3e7ec] pb-4">
          {tab.deliveryOptions.map((deliveryOption, index) => (
            <button
              key={deliveryOption.id}
              type="button"
              onClick={() => onDeliveryIndexChange(index)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                deliveryIndex === index
                  ? "bg-[#4e4bdc] text-white"
                  : "bg-[#f0f3f6] text-[#4f5560] hover:bg-[#e8ebf0]"
              }`}
            >
              {deliveryOption.title}
            </button>
          ))}
        </div>

        <ul className="mt-5 space-y-3 text-[15px] leading-relaxed text-[#4f5560]">
          {option.bullets.map((bullet) => (
            <li key={bullet} className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#4e4bdc]" />
              <span>{bullet}</span>
            </li>
          ))}
        </ul>

        <div className="mt-8 flex justify-center lg:justify-end">
          <OnlineCmsImage
            src={option.image}
            alt={option.imageAlt}
            className="max-h-[320px] w-auto max-w-full object-contain"
          />
        </div>
      </>
    );
  }

  if (tab.steps) {
    return (
      <ol className="space-y-5">
        {tab.steps.map((step) => (
          <li key={step.number} className="flex gap-4">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#4e4bdc] text-sm font-semibold text-white">
              {step.number}
            </span>
            <div>
              <h3 className="text-lg font-semibold text-[#222a35]">{step.title}</h3>
              <p className="mt-1 text-[15px] leading-relaxed text-[#4f5560]">
                {step.description}
              </p>
            </div>
          </li>
        ))}
      </ol>
    );
  }

  return (
    <div className="space-y-6">
      {tab.paragraphs?.map((paragraph) => (
        <p key={paragraph} className="text-[15px] leading-relaxed text-[#4f5560]">
          {paragraph}
        </p>
      ))}

      {tab.bullets ? (
        <ul className="space-y-3 text-[15px] leading-relaxed text-[#4f5560]">
          {tab.bullets.map((bullet) => (
            <li key={bullet} className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#4e4bdc]" />
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
      ) : null}

      {tab.sections?.map((section, index) => (
        <div key={section.title} className="flex gap-4">
          {tab.slug === "ai-and-expert-verification" ? (
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#4e4bdc] text-sm font-semibold text-white">
              {index + 1}
            </span>
          ) : null}
          <div className="min-w-0 flex-1">
            <h3 className="text-lg font-semibold text-[#222a35]">{section.title}</h3>
            {section.paragraphs?.map((paragraph) => (
              <p
                key={paragraph}
                className="mt-2 text-[15px] leading-relaxed text-[#4f5560]"
              >
                {paragraph}
              </p>
            ))}
            {section.bullets ? (
              <ul className="mt-3 space-y-3 text-[15px] leading-relaxed text-[#4f5560]">
                {section.bullets.map((bullet) => (
                  <li key={bullet} className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#4e4bdc]" />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>
      ))}

      {tab.slug === "ai-and-expert-verification" ? (
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <OnlineCmsImage
            src={tab.heroImage}
            alt="AI verification"
            className="w-full rounded-lg object-contain"
          />
          <OnlineCmsImage
            src="https://passport-photo.online/images/cms/tab2_bf563cee15.png?quality=80&format=webp&width=560"
            alt="Human expert verification"
            className="w-full rounded-lg object-contain"
          />
        </div>
      ) : tab.slug !== "delivery" ? (
        <div className="mt-8 flex justify-center lg:justify-end">
          <OnlineCmsImage
            src={tab.heroImage}
            alt={tab.heroImageAlt}
            className="max-h-[360px] w-auto max-w-full object-contain"
          />
        </div>
      ) : null}
    </div>
  );
}

export function HowItWorksAccordion({ defaultTab }: HowItWorksAccordionProps) {
  const initialTab: HowItWorksTabId =
    defaultTab && isHowItWorksTabId(defaultTab)
      ? defaultTab
      : "how-to-take-a-photo";

  const [activeTab, setActiveTab] = useState<HowItWorksTabId>(initialTab);
  const [deliveryIndex, setDeliveryIndex] = useState(0);

  useEffect(() => {
    if (defaultTab && isHowItWorksTabId(defaultTab)) {
      setActiveTab(defaultTab);
    }
  }, [defaultTab]);

  const tab =
    howItWorksTabs.find((item) => item.slug === activeTab) ?? howItWorksTabs[0];

  return (
    <div className="bg-[#f5f6f7] py-10 md:py-16">
      <div className="container-main max-w-[1220px]">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,280px)_minmax(0,1fr)] lg:items-start">
          <aside className="space-y-2">
            {howItWorksTabs.map((item) => {
              const isActive = item.slug === activeTab;
              return (
                <Link
                  key={item.slug}
                  href={`/how-it-works?tab=${item.slug}#accordion-tabs-section`}
                  onClick={() => {
                    setActiveTab(item.slug);
                    if (item.slug === "delivery") {
                      setDeliveryIndex(0);
                    }
                  }}
                  className={`block w-full rounded-lg px-4 py-3 text-left text-base font-medium transition ${
                    isActive
                      ? "bg-white text-[#4e4bdc] shadow-sm"
                      : "text-[#4f5560] hover:bg-white/70 hover:text-[#222a35]"
                  }`}
                >
                  {item.title}
                </Link>
              );
            })}
          </aside>

          <section
            id="accordion-tabs-section"
            className="rounded-2xl bg-white p-6 shadow-sm md:p-8"
          >
            <h1 className="font-serif text-[clamp(1.75rem,3vw,2.5rem)] font-bold text-[#1d2340]">
              {tab.title}
            </h1>

            <div className="mt-6">
              <TabPanelContent
                tab={tab}
                deliveryIndex={deliveryIndex}
                onDeliveryIndexChange={setDeliveryIndex}
              />
            </div>

            {tab.slug === "how-to-take-a-photo" ? (
              <div className="mt-8 flex justify-center lg:justify-end">
                <OnlineCmsImage
                  src={tab.heroImage}
                  alt={tab.heroImageAlt}
                  className="max-h-[360px] w-auto max-w-full object-contain"
                />
              </div>
            ) : null}

            <div className="mt-8 border-t border-[#e3e7ec] pt-6">
              <Button
                asChild
                className="h-12 min-w-[200px] bg-[#4e4bdc] hover:bg-[#3f3ac6]"
              >
                <Link href="/create">Choose document</Link>
              </Button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
