import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { documentPages, getDocumentPageBySlug } from "@/lib/document-pages";

interface DocumentPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return documentPages.map((documentPage) => ({ slug: documentPage.slug }));
}

export async function generateMetadata({
  params,
}: DocumentPageProps): Promise<Metadata> {
  const { slug } = await params;
  const documentPage = getDocumentPageBySlug(slug);

  if (!documentPage) {
    return {
      title: "Document Not Found | AAA ID INC",
    };
  }

  return {
    title: `${documentPage.name} | AAA ID INC`,
    description: documentPage.summary,
  };
}

export default async function SingleDocumentPage({ params }: DocumentPageProps) {
  const { slug } = await params;
  const documentPage = getDocumentPageBySlug(slug);

  if (!documentPage) {
    notFound();
  }

  return (
    <div className="bg-page py-10 md:py-14">
      <div className="container-main">
        <Link
          href="/documents"
          className="text-sm font-medium text-brand hover:underline"
        >
          ← Back to all documents
        </Link>

        <section className="mt-6 grid gap-8 rounded-2xl bg-white p-6 shadow-sm md:p-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <p className="text-sm font-medium uppercase tracking-wide text-brand">
              {documentPage.category}
            </p>
            <h1 className="typography-h2 mt-3">{documentPage.name}</h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-grey">
              {documentPage.summary}
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <div className="rounded-lg bg-section px-4 py-3">
                <p className="text-xs uppercase tracking-wide text-muted">
                  Dimensions
                </p>
                <p className="mt-1 text-sm font-medium text-navy">
                  {documentPage.dimensions}
                </p>
              </div>
              <div className="rounded-lg bg-section px-4 py-3">
                <p className="text-xs uppercase tracking-wide text-muted">
                  Background
                </p>
                <p className="mt-1 text-sm font-medium text-navy">
                  {documentPage.background}
                </p>
              </div>
              <div className="rounded-lg bg-section px-4 py-3">
                <p className="text-xs uppercase tracking-wide text-muted">
                  Delivery
                </p>
                <p className="mt-1 text-sm font-medium text-navy">
                  {documentPage.delivery}
                </p>
              </div>
            </div>

            <div className="mt-7 flex flex-wrap gap-3">
              <Button asChild>
                <Link href="/create">Create this photo</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/documents">Browse more documents</Link>
              </Button>
            </div>
          </div>

          <div className="relative mx-auto aspect-[4/3] w-full max-w-[520px] overflow-hidden rounded-xl bg-section">
            <Image
              src={documentPage.heroImage}
              alt={documentPage.name}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 520px"
            />
          </div>
        </section>

        <section className="mt-10 rounded-2xl bg-white p-6 md:p-8">
          <h2 className="text-2xl font-semibold text-navy">How it works</h2>
          <div className="mt-6 grid gap-5 md:grid-cols-3">
            <div className="rounded-lg bg-section px-5 py-4">
              <p className="text-sm font-semibold text-brand">1. Upload</p>
              <p className="mt-2 text-sm leading-6 text-grey">
                Upload a selfie or portrait. The editor prepares the image for{" "}
                {documentPage.name.toLowerCase()} requirements.
              </p>
            </div>
            <div className="rounded-lg bg-section px-5 py-4">
              <p className="text-sm font-semibold text-brand">2. Verify</p>
              <p className="mt-2 text-sm leading-6 text-grey">
                AI checks proportions and background, then applies an automatic
                compliance-friendly crop.
              </p>
            </div>
            <div className="rounded-lg bg-section px-5 py-4">
              <p className="text-sm font-semibold text-brand">3. Download</p>
              <p className="mt-2 text-sm leading-6 text-grey">
                Download your digital file and continue with the official
                application process.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
