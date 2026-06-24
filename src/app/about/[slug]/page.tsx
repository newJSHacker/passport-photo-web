import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { aboutPages, getAboutPageBySlug } from "@/lib/about-pages";

interface AboutDetailProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return aboutPages.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({
  params,
}: AboutDetailProps): Promise<Metadata> {
  const { slug } = await params;
  const page = getAboutPageBySlug(slug);

  if (!page) {
    return {
      title: "About | AAA ID INC",
    };
  }

  return {
    title: `${page.title} | AAA ID INC`,
    description: page.intro,
  };
}

export default async function AboutDetailPage({ params }: AboutDetailProps) {
  const { slug } = await params;
  const page = getAboutPageBySlug(slug);

  if (!page) {
    notFound();
  }

  return (
    <div className="bg-page py-10 md:py-14">
      <div className="container-main max-w-4xl">
        <Link href="/" className="text-sm font-medium text-brand hover:underline">
          ← Back to home
        </Link>

        <section className="mt-6 rounded-2xl bg-white p-6 md:p-8">
          <p className="text-sm font-medium uppercase tracking-wide text-brand">
            About
          </p>
          <h1 className="typography-h2 mt-3">{page.title}</h1>
          <p className="mt-4 text-base leading-7 text-grey">{page.intro}</p>

          <div className="mt-6 space-y-4">
            {page.body.map((paragraph) => (
              <p key={paragraph} className="text-base leading-7 text-navy">
                {paragraph}
              </p>
            ))}
          </div>

          <div className="mt-7">
            <Button asChild>
              <Link href="/create">Choose document</Link>
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
