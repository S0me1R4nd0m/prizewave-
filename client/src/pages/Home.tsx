import HeroSection from "@/components/HeroSection";
import FeaturedGiveaways from "@/components/FeaturedGiveaways";
import WinnerSpotlight from "@/components/WinnerSpotlight";
import HowItWorks from "@/components/HowItWorks";
import ActiveGiveaways from "@/components/ActiveGiveaways";
import Newsletter from "@/components/Newsletter";

export default function Home() {
  return (
    <div>
      <HeroSection />
      <FeaturedGiveaways />
      <WinnerSpotlight />
      <HowItWorks />
      <ActiveGiveaways />
      <Newsletter />
    </div>
  );
}
