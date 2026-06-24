import Link from "next/link";
import { Logo } from "@/components/Logo";
import { getDocumentHref } from "@/lib/document-pages";

const footerLinks = [
  { label: "US Passport Photo", href: getDocumentHref("us-passport-photo") },
  { label: "US Visa Photo", href: getDocumentHref("us-visa-photo") },
  { label: "UK Passport Photo", href: getDocumentHref("uk-passport-photo") },
  {
    label: "Schengen Visa Photo",
    href: getDocumentHref("schengen-visa-photo"),
  },
  { label: "How it works", href: "/#how-it-works" },
  { label: "FAQ", href: "/#faq" },
];

export function Footer() {
  return (
    <footer className="border-t border-[#e5e5e5] bg-section">
      <div className="container-main section-padding">
        <div className="grid gap-10 md:grid-cols-[1.2fr_1fr]">
          <div>
            <Logo href="/" showTagline={false} />
            <p className="mt-4 max-w-md text-base font-light leading-7 text-grey">
              Get digital passport and visa photos online. Fast, affordable,
              compliant photos in minutes.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-medium uppercase tracking-wide text-navy">
              Popular documents
            </h3>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {footerLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm font-light text-grey hover:text-brand hover:underline"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-[#e5e5e5] pt-6 text-center text-sm font-light text-muted">
          © {new Date().getFullYear()} AAA ID INC · Digital Passport Photos. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
