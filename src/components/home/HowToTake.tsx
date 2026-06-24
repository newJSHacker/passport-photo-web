const steps = [
  "Take a picture following the in-app instructions or our guide on how to take passport photos at home.",
  "Upload the image to our passport photo maker using the button at the top of this page or directly to our mobile app.",
  "Wait a few seconds for a preliminary AI check. Then, choose how you want to receive your picture: Via email (digital passport photo) or by mail (printed copies).",
  "Next, one of our photography experts will check your image to ensure it meets all official requirements. We're available 24/7, so it won't take long.",
  "That's it! You can download your digital image or wait 2–3 business days (on average) for your printed photographs.",
];

export function HowToTake() {
  return (
    <section className="section-padding bg-white">
      <div className="container-main max-w-[800px]">
        <h2 className="typography-h2">How to Take Passport Photos</h2>
        <p className="mt-6 text-base leading-7 text-navy">
          Here&apos;s how to make passport photos with our editor:
        </p>

        <ol className="mt-8 space-y-6">
          {steps.map((step, index) => (
            <li key={step} className="flex gap-4">
              <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-brand text-sm font-semibold text-white">
                {index + 1}
              </span>
              <p className="pt-1 text-base leading-7 text-navy">{step}</p>
            </li>
          ))}
        </ol>

        <p className="mt-8 text-base leading-7 text-navy">
          Making passport photos with our tool is hassle-free and secure. Follow
          our easy guide, use our smart editor, and join the thousands who&apos;ve
          streamlined their photo process.
        </p>
        <p className="mt-4 text-base font-medium leading-7 text-brand">
          Discover the difference today.
        </p>
      </div>
    </section>
  );
}
