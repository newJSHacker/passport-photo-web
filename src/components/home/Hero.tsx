import Link from "next/link";
import Image from "next/image";
import { TrustpilotBadge } from "./TrustpilotBadge";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="-mt-[76px] bg-section pt-[76px]">
      <div className="container-main">
        <div className="flex flex-col items-center gap-10 pt-8 lg:flex-row lg:items-start lg:justify-between lg:gap-14 lg:pt-[45px]">
          <div className="flex w-full max-w-[540px] flex-col items-start lg:mr-[55px]">
            <div className="w-full text-center lg:text-left">
              <h1 className="typography-h1 text-balance">
                Take Passport Photos
              </h1>
              <p className="mt-6 text-center text-lg font-light leading-relaxed text-grey md:text-xl lg:text-left">
                Create compliant passport photos with guaranteed acceptance—checked
                by AI and verified by human experts.
              </p>
            </div>

            <div className="mt-11 w-full">
              <Button asChild className="w-full sm:w-auto">
                <Link href="/create">Choose document</Link>
              </Button>
            </div>

            <div className="mt-8 w-full">
              <TrustpilotBadge />
            </div>
          </div>

          <div className="relative w-full max-w-[620px] shrink-0">
            <div className="relative mx-auto aspect-[620/640] w-full max-w-[620px]">
              <Image
                src="https://passport-photo.online/images/cms/064fc74a57594a4e834a1a77a4eee833_e8159a69b3.webp?quality=80&format=webp&width=750"
                alt="Passport photo app preview"
                fill
                priority
                className="object-contain"
                sizes="(max-width: 1024px) calc(100vw - 36px), 620px"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
