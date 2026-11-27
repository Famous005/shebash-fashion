import Navbar          from "@/components/layout/Navbar";
import Footer          from "@/components/layout/Footer";
import HeroSection     from "@/components/home/HeroSection";
import ServicesSection from "@/components/home/ServicesSection";
import BrandStorySection from "@/components/home/BrandStorySection";
import LookbookTeaser  from "@/components/home/LookbookTeaser";
import CtaStrip        from "@/components/home/CtaStrip";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <ServicesSection />
        <BrandStorySection />
        <LookbookTeaser />
        <CtaStrip />
      </main>
      <Footer />
    </>
  );
}