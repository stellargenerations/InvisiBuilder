import { Link } from "wouter";

const ContentPreview = () => {
  return (
    <section className="py-16 bg-gradient-to-br from-neutral-100 to-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-heading font-bold text-neutral-900">For Those Who Build in the Shadows</h2>
          <p className="mt-4 text-lg text-neutral-800 max-w-3xl mx-auto">
            Not everyone wants the spotlight. Some of us prefer to make an impact without making a scene.
          </p>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 md:p-10">
            <div className="flex flex-col lg:flex-row gap-8 items-center">
              <div className="w-full lg:w-7/12">
                <h3 className="font-heading font-bold text-2xl md:text-3xl mb-6 text-neutral-900">
                  We're Not Like Those Other Gurus
                </h3>
                
                <div className="prose prose-lg max-w-none text-neutral-800">
                  <p className="mb-4">
                    The internet is filled with "experts" who crave attention more than they crave results. They post inspirational quotes, share carefully staged photos, and make sure you know every detail of their supposed success.
                  </p>
                  
                  <p className="mb-4">
                    But that's not you. And that's not us.
                  </p>
                  
                  <p className="mb-6">
                    <strong>We're the ones who prefer building over bragging.</strong> The ones who measure success by impact, not Instagram followers. The ones who know that real value doesn't need a spotlight to shine.
                  </p>
                  
                  <div className="bg-neutral-100 p-5 rounded-lg border-l-4 border-primary-dark mb-6">
                    <p className="italic">
                      "The best advice for those who work behind the scenes will never be found in public. That's why we save our most valuable insights for our private network."
                    </p>
                  </div>
                  
                  <p>
                    Our most powerful strategies, detailed case studies, and insider tactics are reserved exclusively for our newsletter subscribers. In true form to our philosophy, we're not putting our best ideas out there for the whole world to see.
                  </p>
                </div>
              </div>
              
              <div className="w-full lg:w-5/12">
                <div className="bg-neutral-100 rounded-lg p-6 shadow-sm border border-neutral-200">
                  <div className="flex justify-center mb-5">
                    <div className="h-16 w-16 bg-primary-dark rounded-full flex items-center justify-center text-white">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                  </div>
                  
                  <h4 className="font-heading font-semibold text-xl text-center mb-4">
                    Join Our Inner Circle
                  </h4>
                  
                  <p className="text-neutral-800 text-center mb-6">
                    Get exclusive strategies and resources we don't share publicly. And true to our values, we won't even ask for your name.
                  </p>
                  
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-dark" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <p className="text-sm text-neutral-800">Weekly insider strategies (not on the blog)</p>
                    </div>
                    
                    <div className="flex items-center">
                      <div className="flex-shrink-0 mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-dark" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <p className="text-sm text-neutral-800">Private case studies and success stories</p>
                    </div>
                    
                    <div className="flex items-center">
                      <div className="flex-shrink-0 mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-dark" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <p className="text-sm text-neutral-800">Tools and templates we use ourselves</p>
                    </div>
                    
                    <div className="flex items-center">
                      <div className="flex-shrink-0 mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-dark" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <p className="text-sm text-neutral-800">Early access to new strategies and opportunities</p>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <Link href="/newsletter">
                      <div className="bg-primary-dark hover:bg-primary transition-colors duration-200 text-white font-medium py-3 px-4 rounded-md w-full text-center cursor-pointer">
                        Join the Unseen Builders
                      </div>
                    </Link>
                    <p className="text-xs text-center mt-3 text-neutral-600">
                      No spam, no hype. Unsubscribe any time.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-10 pt-6 border-t border-neutral-200">
              <p className="text-center text-neutral-800">
                Ultimately, there are far more of us than them. The ones who build real businesses without needing to be the center of attention.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContentPreview;
