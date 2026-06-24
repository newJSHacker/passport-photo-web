import Image from "next/image";
import Link from "next/link";
import {
  documentCategories,
  documentPages,
  getDocumentHref,
} from "@/lib/document-pages";

export const metadata = {
  title: "Choose Your Document | AAA ID INC",
  description:
    "Browse passport, visa, and ID photo pages. Pick a document and generate a compliant photo online.",
};

export default function DocumentsPage() {
  return (
    <div className="bg-page py-10 md:py-14">
      <div className="container-main">
        <h1 className="typography-h2 text-center">Choose your document</h1>
        <p className="mx-auto mt-4 max-w-3xl text-center text-base leading-7 text-navy">
          We provide visual-ready pages for popular passport, visa, and ID photo
          types. Pick a document page and continue to the photo flow when you are
          ready.
        </p>

        <div className="mt-10 space-y-12">
          {documentCategories.map((category) => {
            const categoryDocuments = documentPages.filter(
              (documentPage) => documentPage.category === category,
            );

            if (!categoryDocuments.length) {
              return null;
            }

            return (
              <section key={category}>
                <h2 className="text-xl font-semibold text-navy">{category}</h2>
                <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {categoryDocuments.map((documentPage) => (
                    <Link
                      key={documentPage.slug}
                      href={getDocumentHref(documentPage.slug)}
                      className="group overflow-hidden rounded-xl border border-[#d5d5dc] bg-white transition hover:-translate-y-0.5 hover:shadow-photo"
                    >
                      <div className="relative aspect-[4/3] w-full bg-section">
                        <Image
                          src={documentPage.heroImage}
                          alt={documentPage.name}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      </div>
                      <div className="space-y-2 p-4">
                        <h3 className="text-base font-semibold text-navy">
                          {documentPage.name}
                        </h3>
                        <p className="text-sm leading-6 text-grey">
                          {documentPage.summary}
                        </p>
                        <span className="inline-block text-sm font-medium text-brand group-hover:underline">
                          Open page →
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}
