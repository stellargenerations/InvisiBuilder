import { Helmet } from "react-helmet";
import { Link } from "wouter";
import Breadcrumbs from "@/components/ui/breadcrumb";

const About = () => {
  return (
    <>
      <Helmet>
        <title>About Us | Invisibuilder</title>
        <meta name="description" content="Learn about Invisibuilder, the platform for solopreneurs who prefer to work behind the scenes. Our mission is to empower anonymous online success." />
      </Helmet>
      
      {/* Breadcrumb navigation */}
      <div className="bg-neutral-100 py-4 border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs 
            items={[
              { label: 'Home', href: '/' },
              { label: 'About' }
            ]} 
          />
        </div>
      </div>
      
      <div className="py-12 bg-gradient-to-b from-neutral-200 to-neutral-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-heading font-bold text-neutral-900">About Invisibuilder</h1>
            <p className="mt-4 text-lg text-neutral-800 max-w-3xl mx-auto">
              The platform for solopreneurs who prefer to work behind the scenes, without sacrificing success.
            </p>
          </div>
        </div>
      </div>
      
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl font-heading font-bold text-neutral-900 mb-6">Our Mission</h2>
              <p className="text-lg text-neutral-800 mb-4">
                Invisibuilder was created with a simple mission: to empower solopreneurs who prefer to stay out of the spotlight while building successful online businesses.
              </p>
              <p className="text-lg text-neutral-800 mb-4">
                In a world where personal branding and constant self-promotion are often presented as the only path to success, we're championing an alternative approach. We believe that your work can speak for itself without requiring you to be the face of your business.
              </p>
              <p className="text-lg text-neutral-800">
                Our platform provides resources, strategies, and community for individuals who want to build profitable online ventures while maintaining their privacy and working behind the scenes.
              </p>
            </div>
            
            <div className="relative">
              <div className="absolute -top-6 -left-6 w-24 h-24 bg-primary-light opacity-50 rounded-full"></div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-primary opacity-30 rounded-full"></div>
              <div className="relative z-10">
                <img
                  src="https://images.unsplash.com/photo-1515378960530-7c0da6231fb1?auto=format&fit=crop&w=600&h=400&q=80"
                  alt="Person working on laptop from behind"
                  className="rounded-lg shadow-xl w-full"
                />
              </div>
            </div>
          </div>
          
          <div className="mt-20">
            <h2 className="text-2xl font-heading font-bold text-neutral-900 mb-8 text-center">Our Values</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-neutral-100 rounded-lg p-6 shadow-sm">
                <div className="w-12 h-12 bg-primary-light text-white rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-xl font-heading font-semibold mb-3">Privacy First</h3>
                <p className="text-neutral-800">
                  We champion your right to build a business on your own terms, without compromising your personal privacy or forcing you into the public eye.
                </p>
              </div>
              
              <div className="bg-neutral-100 rounded-lg p-6 shadow-sm">
                <div className="w-12 h-12 bg-primary-light text-white rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                </div>
                <h3 className="text-xl font-heading font-semibold mb-3">Quality Over Personality</h3>
                <p className="text-neutral-800">
                  We believe your work should speak for itself. Success shouldn't depend on your willingness to be in the spotlight, but on the quality of what you create.
                </p>
              </div>
              
              <div className="bg-neutral-100 rounded-lg p-6 shadow-sm">
                <div className="w-12 h-12 bg-primary-light text-white rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-heading font-semibold mb-3">Community Support</h3>
                <p className="text-neutral-800">
                  We're building a community of like-minded individuals who understand that being an introvert or valuing privacy isn't a barrier to success.
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-20">
            <h2 className="text-2xl font-heading font-bold text-neutral-900 mb-8 text-center">Our Approach</h2>
            
            <div className="bg-neutral-100 rounded-xl p-8 shadow-md">
              <div className="max-w-4xl mx-auto">
                <p className="text-lg text-neutral-800 mb-6">
                  At Invisibuilder, we take a different approach to content. Rather than just giving you surface-level advice, we provide:
                </p>
                
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p className="ml-3 text-lg text-neutral-800">
                      <strong className="text-neutral-900">In-depth, multimedia content</strong> - Our articles combine text, video, audio, and downloadable resources for a complete learning experience.
                    </p>
                  </li>
                  
                  <li className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p className="ml-3 text-lg text-neutral-800">
                      <strong className="text-neutral-900">Practical strategies</strong> - We focus on actionable advice that you can implement immediately, not vague theory.
                    </p>
                  </li>
                  
                  <li className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p className="ml-3 text-lg text-neutral-800">
                      <strong className="text-neutral-900">Privacy-focused solutions</strong> - All our content respects the desire for anonymity and provides specific techniques for maintaining privacy while building your business.
                    </p>
                  </li>
                  
                  <li className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p className="ml-3 text-lg text-neutral-800">
                      <strong className="text-neutral-900">Case studies and examples</strong> - We provide real-world examples of successful anonymous entrepreneurs, so you can see principles in action.
                    </p>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="mt-16 text-center">
            <h2 className="text-2xl font-heading font-bold text-neutral-900 mb-6">Ready to Build Behind the Scenes?</h2>
            <p className="text-lg text-neutral-800 max-w-2xl mx-auto mb-8">
              Join thousands of solopreneurs who are building successful online businesses without sacrificing their privacy.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/articles">
                <a className="inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-dark hover:bg-primary transition duration-150 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                  Explore Our Articles
                </a>
              </Link>
              <Link href="#newsletter">
                <a className="inline-flex justify-center items-center px-6 py-3 border border-primary text-base font-medium rounded-md text-primary-dark bg-transparent hover:bg-neutral-200 transition duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-light">
                  Join Our Newsletter
                </a>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default About;
