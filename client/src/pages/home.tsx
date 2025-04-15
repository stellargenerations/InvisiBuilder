import HeroSection from "@/components/home/hero-section";
import FeaturedContent from "@/components/home/featured-content";
import ContentPreview from "@/components/home/content-preview";
import CategoriesSection from "@/components/home/categories-section";
import NewsletterSection from "@/components/home/newsletter-section";
import { Helmet } from "react-helmet";

const Home = () => {
  return (
    <>
      <Helmet>
        <title>Invisibuilder - Build Success Behind the Scenes</title>
        <meta name="description" content="Resources for solopreneurs who prefer to work behind the scenes. Learn strategies for online success while maintaining anonymity." />
        <meta property="og:title" content="Invisibuilder - Build Success Behind the Scenes" />
        <meta property="og:description" content="Resources for solopreneurs who prefer to work behind the scenes. Learn strategies for online success while maintaining anonymity." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://invisibuilder.com" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Invisibuilder - Build Success Behind the Scenes" />
        <meta name="twitter:description" content="Resources for solopreneurs who prefer to work behind the scenes. Learn strategies for online success while maintaining anonymity." />
      </Helmet>
      <HeroSection />
      <FeaturedContent />
      <ContentPreview />
      <CategoriesSection />
      <NewsletterSection />
    </>
  );
};

export default Home;
