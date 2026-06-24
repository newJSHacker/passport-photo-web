import Image from "next/image";

const steps = [
  {
    title: "Take or upload a photo",
    description:
      "Take a selfie or upload one from your gallery. Follow the on-screen instructions to meet all the requirements.",
    image:
      "https://passport-photo.online/images/cms/how_It_Works1_7366acfde0.webp?quality=80&format=webp&width=250",
  },
  {
    title: "Get your photo verified",
    description:
      "Our innovative AI software will fine-tune your photo. Then, our in-house experts will ensure 100% compliance.",
    image:
      "https://passport-photo.online/images/cms/how_It_Works2_c6587a39a7.webp?quality=80&format=webp&width=250",
  },
  {
    title: "Submit your photo",
    description:
      "Your photo is ready for submission. Get a digital photo instantly, or have printouts delivered to your door for free.",
    image:
      "https://passport-photo.online/images/cms/how_It_Works3_619afd784b.webp?quality=80&format=webp&width=250",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="section-padding bg-section">
      <div className="container-main">
        <h2 className="typography-h2 text-center">
          How Does Our Passport-Size Photo Maker Work?
        </h2>

        <div className="mt-12 grid gap-10 md:grid-cols-3 md:gap-8">
          {steps.map((step) => (
            <div key={step.title} className="text-center">
              <div className="mx-auto flex h-[125px] w-[125px] items-center justify-center">
                <Image
                  src={step.image}
                  alt={step.title}
                  width={125}
                  height={125}
                  className="h-auto max-h-[125px] w-auto max-w-[125px] object-contain"
                />
              </div>
              <h3 className="typography-h3 mt-6 text-xl">{step.title}</h3>
              <p className="mx-auto mt-4 max-w-sm text-sm leading-6 text-navy md:text-base md:leading-7">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
