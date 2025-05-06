import HeroSection from "@/components/home/hero-section";
import FeaturedContent from "@/components/home/featured-content";
import ContentPreview from "@/components/home/content-preview";
import TopicsSection from "@/components/home/topics-section";
import NewsletterSection from "@/components/home/newsletter-section";
import { Helmet } from "react-helmet";

const Home = () => {
  return (
    <>
      <Helmet>
        <title>Invisibuilder - The #1 Faceless Digital Marketing Resource</title>
        <meta name="description" content="Master faceless digital marketing with Invisibuilder. Resources, strategies, and tools for building successful online businesses without being in the spotlight." />
        <meta property="og:title" content="Invisibuilder - The #1 Faceless Digital Marketing Resource" />
        <meta property="og:description" content="Master faceless digital marketing with Invisibuilder. Resources, strategies, and tools for building successful online businesses without being in the spotlight." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://invisibuilder.com" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Invisibuilder - The #1 Faceless Digital Marketing Resource" />
        <meta name="twitter:description" content="Master faceless digital marketing with Invisibuilder. Resources, strategies, and tools for building successful online businesses without being in the spotlight." />
        <meta name="keywords" content="faceless digital marketing, anonymous marketing, introvert marketing, behind the scenes business, faceless content creation, private branding" />
      </Helmet>
      <HeroSection />
      <FeaturedContent />
      <ContentPreview />
      <TopicsSection />
      <NewsletterSection />
    </>
  );
};

export default Home;
