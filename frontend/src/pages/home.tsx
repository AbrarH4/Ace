import Navigation_Bar from "../components/home/navbar";
import Hero_Section from "../components/home/hero_section";
import Sliding_Carousel from "../components/home/carousel";
import FeatureCards from "../components/home/feature_cards";
import CallToAction from "../components/home/call_to_action";
import FAQ from "../components/home/FAQ";
import Footer from "../components/home/footer";

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
