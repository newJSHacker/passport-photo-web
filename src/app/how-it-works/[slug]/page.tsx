import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import {
  getHowItWorksPageBySlug,
  howItWorksPages,
} from "@/lib/how-it-works-pages";

interface HowItWorksPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return howItWorksPages.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({
  params,
}: HowItWorksPageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = getHowItWorksPageBySlug(slug);

  if (!page) {
    return {
      title: "How It Works | AAA ID INC",
    };
  }

  return {
    title: `${page.title} | AAA ID INC`,
    description: page.intro,
  };
}

export default async function HowItWorksDetailPage({
  params,
}: HowItWorksPageProps) {
  const { slug } = await params;
  const page = getHowItWorksPageBySlug(slug);

  if (!page) {
    notFound();
  }

  redirect(`/how-it-works?tab=${slug}#accordion-tabs-section`);
}
