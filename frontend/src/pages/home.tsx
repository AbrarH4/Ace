import Navigation_Bar from "../components/navbar";
import Hero_Section from "../components/hero_section";
import Sliding_Carousel from "../components/carousel";
import FeatureCards from "../components/feature_cards";
import CallToAction from "../components/call_to_action";
import FAQ from "../components/FAQ";
import Footer from "../components/footer";

function Home() {
  return (
    <>
      <Navigation_Bar />
      <Hero_Section />
      <Sliding_Carousel />
      <FeatureCards />
      <CallToAction />
      <FAQ />
      <Footer />
    </>
  );
}

export default Home;
