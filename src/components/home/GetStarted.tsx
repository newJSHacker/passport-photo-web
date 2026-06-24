import Link from "next/link";
import { Button } from "@/components/ui/button";

export function GetStarted() {
  return (
    <section className="section-padding bg-brand/10">
      <div className="container-main max-w-[800px] text-center">
        <h2 className="typography-h2">Get Started in Minutes</h2>
        <p className="mt-6 text-base leading-7 text-navy">
          Ready to take the hassle out of passport, visa, and ID photos? With
          Digital Passport Photos, you&apos;re just a few clicks away from the
          perfect photo.
        </p>
        <div className="mt-8">
          <Button asChild>
            <Link href="/create">Choose document</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
