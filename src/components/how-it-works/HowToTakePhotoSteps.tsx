"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { OnlineCmsImage } from "@/components/OnlineCmsImage";
import type { HowItWorksStep } from "@/lib/how-it-works-pages";

interface HowToTakePhotoStepsProps {
  steps: HowItWorksStep[];
}

export function HowToTakePhotoSteps({ steps }: HowToTakePhotoStepsProps) {
  const [activeStep, setActiveStep] = useState(0);
  const current = steps[activeStep] ?? steps[0];

  return (
    <div className="mt-6 grid gap-8 lg:grid-cols-2 lg:items-start">
      <div className="order-2 grid grid-cols-1 gap-0 sm:grid-cols-2 lg:order-1">
        {steps.map((step, index) => {
          const isActive = activeStep === index;
          const isLeftColumn = index % 2 === 0;
          const isTopRow = index < 2;

          return (
            <button
              key={step.number}
              type="button"
              onClick={() => setActiveStep(index)}
              className={`relative flex flex-col items-start gap-3 px-4 py-5 text-left transition ${
                isTopRow ? "border-b border-[#e3e7ec]" : ""
              } ${isLeftColumn ? "sm:border-r sm:border-[#e3e7ec]" : ""} hover:bg-[#f8f9fb]`}
            >
              <span
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold transition ${
                  isActive
                    ? "bg-[#4e4bdc] text-white"
                    : "bg-[#e8ebf0] text-[#6b7280]"
                }`}
              >
                {step.number}
              </span>
              <div>
                <h3 className="text-base font-semibold text-[#222a35] sm:text-lg">
                  {step.title}
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-[#4f5560] sm:text-[15px]">
                  {step.description}
                </p>
              </div>
              {isActive ? (
                <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-[#4e4bdc]" />
              ) : null}
            </button>
          );
        })}
      </div>

      <div className="order-1 flex flex-col items-center gap-6 lg:order-2 lg:items-end">
        <OnlineCmsImage
          key={current.image}
          src={current.image}
          alt={current.imageAlt}
          className="max-h-[320px] w-full max-w-[480px] object-contain"
        />
        <Button
          asChild
          className="h-12 min-w-[200px] bg-[#4e4bdc] hover:bg-[#3f3ac6]"
        >
          <Link href="/create">Choose document</Link>
        </Button>
      </div>
    </div>
  );
}
