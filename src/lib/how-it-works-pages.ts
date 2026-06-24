import { cmsImage } from "@/lib/cms-images";

export type HowItWorksTabId =
  | "how-to-take-a-photo"
  | "ai-and-expert-verification"
  | "guarantee"
  | "delivery";

export interface HowItWorksStep {
  number: number;
  title: string;
  description: string;
}

export interface HowItWorksSection {
  title: string;
  paragraphs?: string[];
  bullets?: string[];
}

export interface DeliveryOption {
  id: string;
  title: string;
  bullets: string[];
  image: string;
  imageAlt: string;
}

export interface HowItWorksTab {
  slug: HowItWorksTabId;
  title: string;
  heroImage: string;
  heroImageAlt: string;
  steps?: HowItWorksStep[];
  sections?: HowItWorksSection[];
  paragraphs?: string[];
  bullets?: string[];
  deliveryOptions?: DeliveryOption[];
}

export const howItWorksTabs: HowItWorksTab[] = [
  {
    slug: "how-to-take-a-photo",
    title: "How to Take a Photo",
    heroImage: cmsImage("Take_a_picture_54d8c245ef.webp", 560),
    heroImageAlt: "How to take a passport photo",
    steps: [
      {
        number: 1,
        title: "Position your light",
        description:
          "Face a window or another light source. Make sure your face is evenly lit with no shadows on either side.",
      },
      {
        number: 2,
        title: "Position yourself",
        description:
          "If taking a selfie, hold the camera at least 20 inches from your face. Ideally, ask someone to take the photo for you.",
      },
      {
        number: 3,
        title: "Pose correctly",
        description:
          "Face the camera directly with your head straight—don't tilt, lower, or raise it. Maintain a neutral expression and don't smile broadly.",
      },
      {
        number: 4,
        title: "Take a photo!",
        description:
          "Upload the picture and wait 3 seconds—our tool will ensure it meets the official requirements.",
      },
    ],
  },
  {
    slug: "ai-and-expert-verification",
    title: "AI and Expert Verification",
    heroImage: cmsImage("tab1_03edbe8d4e.png", 560),
    heroImageAlt: "AI verification illustration",
    sections: [
      {
        title: "AI Verification",
        paragraphs: [
          "Every photo is carefully reviewed by our intelligent algorithms to ensure:",
        ],
        bullets: [
          "Accurate face detection",
          "Proper image cropping",
          "Effective background removal",
          "Correct size adjustments",
          "Optimal lighting adjustments",
        ],
      },
      {
        title: "Human Expert Verification",
        paragraphs: [
          "Our experts manually verify photos 24/7 to ensure they meet government requirements. This attention to detail supports our 200% money-back guarantee.",
          "We can also enhance your photo's quality and clarity with minor adjustments, such as:",
        ],
        bullets: [
          "Removing temporary skin imperfections e.g. pimples",
          "Reducing under-eye shadows",
          "Removing single stray hairs",
          "Removing small spots and dust effect from camera lens or scanner",
        ],
      },
    ],
  },
  {
    slug: "guarantee",
    title: "Guarantee",
    heroImage: cmsImage("guarantee_b4f00e6f4d.png", 560),
    heroImageAlt: "200% acceptance guarantee",
    paragraphs: [
      "At Passport Photo Online, your satisfaction and peace of mind are our top priorities.",
    ],
    bullets: [
      "That's why we proudly offer a 200% acceptance guarantee for every photo you take with us.",
    ],
    sections: [
      {
        title: "What does this mean for you?",
        paragraphs: [
          "It's simple: If the authorities reject your ID or passport photo, we'll refund not only the full cost of your photo, but also give you 100% of the price as a bonus.",
        ],
        bullets: [
          "No hoops to jump through, no fine print. Whether it's a technical issue or a requirement that was missed, we've got your back.",
        ],
      },
    ],
  },
  {
    slug: "delivery",
    title: "Delivery",
    heroImage: cmsImage("delivery_section_1_773ddb1100.png", 560),
    heroImageAlt: "Digital photo delivery",
    deliveryOptions: [
      {
        id: "digital",
        title: "Digital Photo",
        bullets: [
          "After ordering, your photo will be reviewed by one of our experts. Once approved, it'll be available:",
          "On the website, where you can download it directly to your device.",
          "Via email, sent to the address you provided during the ordering process.",
        ],
        image: cmsImage("delivery_section_1_773ddb1100.png", 560),
        imageAlt: "Digital photo delivery",
      },
      {
        id: "print-template",
        title: "Print-ready template",
        bullets: [
          "After your photo is approved, you will receive a ready-to-print template in two ways:",
          "On the website, where you can download it directly to your device.",
          "Via email, sent to the address you provided during the ordering process.",
          "You can print photos at local stores.",
          "You can print your photos at home with photographic paper, available at local photography or stationery shops.",
        ],
        image: cmsImage("delivery_section_3_51a3ad3871.png", 560),
        imageAlt: "Print-ready template",
      },
      {
        id: "printout",
        title: "Printout delivery",
        bullets: [
          "Get your prints delivered straight to your doorstep in just a few days. Select your preferred delivery option at checkout for fast, reliable service.",
          "Delivery Time: Typically, orders are delivered within 2-3 business days, ensuring you get your prints quickly.",
          "Flexible Options: Select the delivery service that meets your needs, whether you prefer standard or express shipping.",
        ],
        image: cmsImage("US_postal_service_b6b869e525.png", 320),
        imageAlt: "US Postal Service delivery partner",
      },
    ],
  },
];

/** @deprecated Use howItWorksTabs */
export const howItWorksPages = howItWorksTabs.map((tab) => ({
  slug: tab.slug,
  title: tab.title,
  intro: tab.steps?.[0]?.description ?? tab.paragraphs?.[0] ?? "",
  points: tab.steps?.map((step) => step.description) ?? tab.bullets ?? [],
}));

export function getHowItWorksPageBySlug(
  slug: string,
): (typeof howItWorksPages)[number] | undefined {
  return howItWorksPages.find((page) => page.slug === slug);
}

export function getHowItWorksTabBySlug(
  slug: string,
): HowItWorksTab | undefined {
  return howItWorksTabs.find((tab) => tab.slug === slug);
}

export function isHowItWorksTabId(slug: string): slug is HowItWorksTabId {
  return howItWorksTabs.some((tab) => tab.slug === slug);
}
