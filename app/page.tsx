import { Hero, TrustStrip } from "@/components/home/Hero";
import { ServicesGrid } from "@/components/home/ServicesGrid";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { Testimonials } from "@/components/home/Testimonials";
import { CtaBanner, IntroSteps } from "@/components/home/Sections";

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustStrip />
      <ServicesGrid />
      <IntroSteps />
      <WhyChooseUs />
      <Testimonials />
      <CtaBanner />
    </>
  );
}
