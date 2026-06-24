import { HowItWorksAccordion } from "@/components/how-it-works/HowItWorksAccordion";

export const metadata = {
  title: "How It Works | AAA ID INC",
  description:
    "Learn how to take a photo, how AI and expert verification work, our guarantee, and delivery options.",
};

interface HowItWorksPageProps {
  searchParams: Promise<{
    tab?: string;
  }>;
}

export default async function HowItWorksPage({
  searchParams,
}: HowItWorksPageProps) {
  const { tab } = await searchParams;

  return <HowItWorksAccordion defaultTab={tab} />;
}
