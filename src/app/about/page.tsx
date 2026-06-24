import Link from "next/link";
import { aboutPages } from "@/lib/about-pages";

export const metadata = {
  title: "About | AAA ID INC",
  description: "Learn more about AAA ID INC and our digital photo workflow.",
};

export default function AboutIndexPage() {
  return (
    <div className="bg-page py-10 md:py-14">
      <div className="container-main max-w-4xl">
        <h1 className="typography-h2">About</h1>
        <p className="mt-4 text-base leading-7 text-grey">
          Learn more about our service and quality standards.
        </p>

        <div className="mt-8 grid gap-3">
          {aboutPages.map((page) => (
            <Link
              key={page.slug}
              href={`/about/${page.slug}`}
              className="rounded-lg border border-[#d5d5dc] bg-white px-4 py-3 text-base font-medium text-navy transition hover:border-brand hover:text-brand"
            >
              {page.title}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
