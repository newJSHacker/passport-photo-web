import { Hero } from "@/components/home/Hero";
import { PressLogos } from "@/components/home/PressLogos";
import { HowItWorks } from "@/components/home/HowItWorks";
import { WelcomeAbout } from "@/components/home/WelcomeAbout";
import { WhyChoose } from "@/components/home/WhyChoose";
import { Stats } from "@/components/home/Stats";
import { Testimonials } from "@/components/home/Testimonials";
import { GetStarted } from "@/components/home/GetStarted";
import { HowToTake } from "@/components/home/HowToTake";
import { FAQ } from "@/components/home/FAQ";
import { DocumentsSection } from "@/components/home/DocumentsSection";

export default function HomePage() {
  return (
    <>
      <Hero />
      <PressLogos />
      <HowItWorks />
      <WelcomeAbout />
      <WhyChoose />
      <Stats />
      <Testimonials />
      <GetStarted />
      <HowToTake />
      <FAQ />
      <DocumentsSection />
    </>
  );
}
