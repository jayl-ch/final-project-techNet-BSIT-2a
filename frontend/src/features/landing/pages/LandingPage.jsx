import NavBar from "../components/NavBar";
import HeroSection from "../sections/HeroSection";
import FeatureSection from "../sections/FeatureSection";
import CTASection from "../sections/CTASection";
import Footer from "../sections/Footer";

const LandingPage = () => {
  return (
    <>
      <header>
        <NavBar />
      </header>
      <main>
        <HeroSection />
        <FeatureSection />
        <CTASection />
      </main>
      <Footer />
    </>
  );
};

export default LandingPage;
