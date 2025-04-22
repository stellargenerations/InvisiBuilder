import { Link } from "wouter";

const HeroSection = () => {
  return (
    <section className="bg-gradient-to-br from-neutral-200 to-neutral-100 py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center">
          <div className="w-full md:w-1/2 space-y-6 mb-8 md:mb-0">
            <h1 className="font-heading font-bold text-4xl md:text-5xl lg:text-6xl text-neutral-900">
              Success Doesn't Require<br/><span className="text-primary-dark">The Spotlight</span>
            </h1>
            <p className="text-lg md:text-xl text-neutral-800 max-w-xl">
              Building your online business from behind the scenes. Strategies, tools, and insights for the solopreneur who values privacy.
            </p>
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-2">
              <Link href="#latest-content">
                <div className="inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-dark hover:bg-primary transition duration-150 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary cursor-pointer">
                  Explore Content
                </div>
              </Link>
              <Link href="#newsletter">
                <div className="inline-flex justify-center items-center px-6 py-3 border border-primary text-base font-medium rounded-md text-primary-dark bg-transparent hover:bg-neutral-200 transition duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-light cursor-pointer">
                  Join Newsletter
                </div>
              </Link>
            </div>
          </div>
          <div className="w-full md:w-1/2 flex justify-center items-center">
            <div className="bg-transparent p-8 rounded-full">
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
    </section>
  );
};

export default HeroSection;
