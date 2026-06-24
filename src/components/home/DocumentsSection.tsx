import Link from "next/link";
import Image from "next/image";
import {
  documentPages,
  getDocumentHref,
  mostSearchedDocuments,
} from "@/lib/document-pages";

export function DocumentsSection() {
  return (
    <section id="documents" className="section-padding bg-white">
      <div className="container-main">
        <h2 className="typography-h2 text-center">Choose your document</h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-base leading-7 text-navy">
          We provide photos for IDs from all over the world. You&apos;ll find the
          one you are looking for!
        </p>

        <h3 className="mt-12 text-xl font-semibold text-navy">Most Searched</h3>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {mostSearchedDocuments.map((doc) => (
            <Link
              key={doc.name}
              href={getDocumentHref(doc.slug)}
              className="group overflow-hidden rounded-lg bg-section transition hover:shadow-photo"
            >
              <div className="relative aspect-[4/3] w-full bg-section">
                <Image
                  src={doc.heroImage}
                  alt={doc.name}
                  fill
                  className="object-cover transition group-hover:scale-[1.02]"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <div className="flex items-center justify-between p-4">
                <span className="font-semibold text-navy">{doc.name}</span>
                <span className="text-sm font-medium text-brand group-hover:underline">
                  Get started →
                </span>
              </div>
            </Link>
          ))}
        </div>

        <h3 className="mt-12 text-xl font-semibold text-navy">
          Popular Documents
        </h3>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {documentPages.map((doc) => (
            <Link
              key={doc.slug}
              href={getDocumentHref(doc.slug)}
              className="rounded-lg border border-[#d5d5dc] bg-section px-4 py-3 text-sm font-medium text-navy transition hover:border-brand hover:text-brand"
            >
              {doc.name}
            </Link>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/documents"
            className="text-sm font-medium text-brand hover:underline"
          >
            Browse all document pages →
          </Link>
        </div>
      </div>
    </section>
  );
}
