import { Link } from "wouter";

const HeroSection = () => {
  return (
    <section className="hero-section py-12 md:py-16">
      {/* Dark gradient overlay */}
      <div className="hero-background-gradient"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row items-center">
          <div className="w-full md:w-1/2 space-y-4 mb-6 md:mb-0">
            <h1 className="font-heading font-bold text-3xl md:text-4xl lg:text-5xl text-white">
              A Digital Empire<br/><span className="text-primary">Without The Spotlight</span>
            </h1>
            <p className="text-base md:text-lg text-neutral-100 max-w-xl">
              Building your online business from behind the scenes. Strategies, tools, and insights for the solopreneur who values privacy.
            </p>
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-2">
              <Link href="#latest-content">
                <div className="inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-neutral-900 bg-primary hover:bg-primary-light transition duration-150 shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary cursor-pointer">
                  Explore Content
                </div>
              </Link>
              <Link href="#newsletter">
                <div className="inline-flex justify-center items-center px-6 py-3 border border-primary text-base font-medium rounded-md text-primary bg-neutral-900/50 hover:bg-neutral-900/70 transition duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-light cursor-pointer">
                  Join Newsletter
                </div>
              </Link>
            </div>
          </div>
          <div className="w-full md:w-1/2 flex justify-center items-center">
            <div className="p-8 rounded-full">
              <img 
                src="/invisibuilder-logo.png" 
                alt="Invisibuilder Logo" 
                className="max-w-full h-auto w-4/5 mx-auto"
                loading="eager"
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Light bottom fade to transition to next section */}
      <div className="hero-bottom-fade"></div>
    </section>
  );
};

export default HeroSection;
