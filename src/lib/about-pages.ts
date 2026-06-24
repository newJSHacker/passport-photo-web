export interface AboutPage {
  slug: string;
  title: string;
  intro: string;
  body: string[];
}

export const aboutPages: AboutPage[] = [
  {
    slug: "about-us",
    title: "About Us",
    intro:
      "AAA ID INC builds digital passport and visa photo tools that make compliant photo preparation fast and simple.",
    body: [
      "Our workflow combines AI-based checks with practical quality controls to reduce submission errors.",
      "We design the experience so users can create official-looking images from home in minutes.",
    ],
  },
  {
    slug: "why-choose-us",
    title: "Why Choose Us",
    intro:
      "We focus on speed, clear guidance, and compliance-friendly output for common passport and visa formats.",
    body: [
      "The app guides users from upload to processed output with step-by-step checks.",
      "We support multiple document profiles and keep the process easy to follow.",
    ],
  },
  {
    slug: "customer-reviews",
    title: "Customer Reviews",
    intro:
      "User feedback helps us improve quality, consistency, and reliability across all supported document types.",
    body: [
      "We prioritize practical improvements that reduce failed submissions.",
      "Our goal is a straightforward photo flow with predictable outcomes.",
    ],
  },
];

export function getAboutPageBySlug(slug: string): AboutPage | undefined {
  return aboutPages.find((page) => page.slug === slug);
}
