import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSection from "@/components/sections/HeroSection";
import TrustBar from "@/components/sections/TrustBar";
import ChainSection from "@/components/sections/ChainSection";
import PlatformSection from "@/components/sections/PlatformSection";
import SolutionsSection from "@/components/sections/SolutionsSection";
import ServicesSection from "@/components/sections/ServicesSection";
import DevelopersSection from "@/components/sections/DevelopersSection";
import CaseStudiesSection from "@/components/sections/CaseStudiesSection";
import PricingSection from "@/components/sections/PricingSection";
import SupportSection from "@/components/sections/SupportSection";
import CompanySection from "@/components/sections/CompanySection";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        <HeroSection />
        <TrustBar />
        <ChainSection />
        <PlatformSection />
        <SolutionsSection />
        <ServicesSection />
        <DevelopersSection />
        <CaseStudiesSection />
        <PricingSection />
        <SupportSection />
        <CompanySection />
      </main>
      <Footer />
    </div>
  );
}
