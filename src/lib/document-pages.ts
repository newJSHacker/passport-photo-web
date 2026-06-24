export type DocumentCategory =
  | "Most searched"
  | "Visa photos"
  | "Passport photos"
  | "ID and tools";

export interface DocumentPage {
  slug: string;
  name: string;
  category: DocumentCategory;
  summary: string;
  dimensions: string;
  background: string;
  delivery: string;
  heroImage: string;
}

const sharedPassportImage =
  "https://passport-photo.online/images/cms/US_passport_photo_cover_f9064c684a.png?quality=80&format=webp&width=750";
const sharedVisaImage =
  "https://passport-photo.online/images/cms/USCIS_photo_cover_7528ad6aa5.png?quality=80&format=webp&width=750";

export const documentPages: DocumentPage[] = [
  {
    slug: "passport-renewal-photo",
    name: "Passport renewal photo",
    category: "Most searched",
    summary: "Renew your passport photo with compliant framing and background.",
    dimensions: "2x2 in (51x51 mm)",
    background: "Plain white",
    delivery: "Digital copy in minutes",
    heroImage: sharedPassportImage,
  },
  {
    slug: "us-passport-photo",
    name: "US Passport Photo",
    category: "Most searched",
    summary: "US passport-ready photo checked against official size requirements.",
    dimensions: "2x2 in (51x51 mm)",
    background: "Plain white",
    delivery: "Digital + printable template",
    heroImage: sharedPassportImage,
  },
  {
    slug: "600x600-photo",
    name: "600x600 Photo",
    category: "Most searched",
    summary: "Square digital photo for online applications and profile checks.",
    dimensions: "600x600 px",
    background: "Plain white",
    delivery: "Optimized digital file",
    heroImage: sharedVisaImage,
  },
  {
    slug: "us-visa-photo",
    name: "US Visa Photo",
    category: "Visa photos",
    summary: "Visa-format portrait with AI and human verification.",
    dimensions: "2x2 in (51x51 mm)",
    background: "Plain white",
    delivery: "Digital copy in minutes",
    heroImage: sharedVisaImage,
  },
  {
    slug: "schengen-visa-photo",
    name: "Schengen Visa Photo",
    category: "Visa photos",
    summary: "Biometric photo adjusted to Schengen formatting standards.",
    dimensions: "35x45 mm",
    background: "Light plain background",
    delivery: "Digital + print layout",
    heroImage: sharedVisaImage,
  },
  {
    slug: "uk-visa-photo",
    name: "UK Visa Photo",
    category: "Visa photos",
    summary: "UK visa photo crop and proportions with compliance checks.",
    dimensions: "35x45 mm",
    background: "Light plain background",
    delivery: "Digital copy in minutes",
    heroImage: sharedVisaImage,
  },
  {
    slug: "canada-visa-photo",
    name: "Canada Visa Photo",
    category: "Visa photos",
    summary: "Canada visa-ready format with centered face and clean background.",
    dimensions: "35x45 mm",
    background: "Plain white",
    delivery: "Digital + print layout",
    heroImage: sharedVisaImage,
  },
  {
    slug: "india-visa-photo",
    name: "India Visa Photo",
    category: "Visa photos",
    summary: "India visa photo sizing and positioning made easy online.",
    dimensions: "2x2 in (51x51 mm)",
    background: "Plain white",
    delivery: "Digital copy in minutes",
    heroImage: sharedVisaImage,
  },
  {
    slug: "uk-passport-photo",
    name: "UK Passport Photo",
    category: "Passport photos",
    summary: "UK passport-compliant picture with balanced head position.",
    dimensions: "35x45 mm",
    background: "Plain light grey",
    delivery: "Digital + print layout",
    heroImage: sharedPassportImage,
  },
  {
    slug: "india-passport-photo",
    name: "India Passport Photo",
    category: "Passport photos",
    summary: "India passport photo crop aligned to official standards.",
    dimensions: "2x2 in (51x51 mm)",
    background: "Plain white",
    delivery: "Digital + printable template",
    heroImage: sharedPassportImage,
  },
  {
    slug: "canada-passport-photo",
    name: "Canada Passport Photo",
    category: "Passport photos",
    summary: "Passport photo sizing and head placement for Canada applications.",
    dimensions: "50x70 mm",
    background: "Plain white",
    delivery: "Digital + print layout",
    heroImage: sharedPassportImage,
  },
  {
    slug: "australia-passport-photo",
    name: "Australia Passport Photo",
    category: "Passport photos",
    summary: "Australian passport dimensions with proper eye-line placement.",
    dimensions: "35x45 mm",
    background: "Plain white",
    delivery: "Digital copy in minutes",
    heroImage: sharedPassportImage,
  },
  {
    slug: "mexico-passport-photo",
    name: "Mexico Passport Photo",
    category: "Passport photos",
    summary: "Mexico passport-style photo processing with clean framing.",
    dimensions: "35x45 mm",
    background: "Plain white",
    delivery: "Digital + printable template",
    heroImage: sharedPassportImage,
  },
  {
    slug: "green-card-photo",
    name: "Green Card Photo",
    category: "ID and tools",
    summary: "US permanent residence photo format with strict alignment checks.",
    dimensions: "2x2 in (51x51 mm)",
    background: "Plain white",
    delivery: "Digital file",
    heroImage: sharedVisaImage,
  },
  {
    slug: "uscis-photos",
    name: "USCIS Photos",
    category: "ID and tools",
    summary: "USCIS-ready file format for immigration applications.",
    dimensions: "2x2 in (51x51 mm)",
    background: "Plain white",
    delivery: "Digital file",
    heroImage: sharedVisaImage,
  },
  {
    slug: "baby-passport-photo",
    name: "Baby Passport Photo",
    category: "ID and tools",
    summary: "Kid and baby passport photos from home with helper framing.",
    dimensions: "2x2 in (51x51 mm)",
    background: "Plain white",
    delivery: "Digital + print layout",
    heroImage: sharedPassportImage,
  },
  {
    slug: "digital-passport-photo",
    name: "Digital Passport Photo",
    category: "ID and tools",
    summary: "Instant digital-only passport image for online submissions.",
    dimensions: "600x600 px",
    background: "Plain white",
    delivery: "Digital file",
    heroImage: sharedVisaImage,
  },
  {
    slug: "photo-2x2-inches",
    name: "Photo 2x2 Inches",
    category: "ID and tools",
    summary: "Universal 2x2 conversion with automatic crop and centering.",
    dimensions: "2x2 in (51x51 mm)",
    background: "Plain white",
    delivery: "Digital + printable template",
    heroImage: sharedVisaImage,
  },
  {
    slug: "photo-35x45-mm",
    name: "Photo 35x45 Milimetres",
    category: "ID and tools",
    summary: "Generate 35x45 biometric photo format in one flow.",
    dimensions: "35x45 mm",
    background: "Plain white",
    delivery: "Digital + print layout",
    heroImage: sharedVisaImage,
  },
  {
    slug: "passport-photo-maker",
    name: "Passport Photo Maker",
    category: "ID and tools",
    summary: "General passport photo editing and auto-compliance checks.",
    dimensions: "Based on selected document",
    background: "Auto-cleaned",
    delivery: "Digital output",
    heroImage: sharedPassportImage,
  },
];

export const documentCategories: DocumentCategory[] = [
  "Most searched",
  "Visa photos",
  "Passport photos",
  "ID and tools",
];

export const mostSearchedDocuments = documentPages.filter(
  (documentPage) => documentPage.category === "Most searched",
);

export function getDocumentPageBySlug(slug: string): DocumentPage | undefined {
  return documentPages.find((documentPage) => documentPage.slug === slug);
}

export function getDocumentHref(slug: string): string {
  return `/documents/${slug}`;
}
