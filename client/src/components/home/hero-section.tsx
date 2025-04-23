import { useState } from "react";
import { Link } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const newsletterSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  consent: z.boolean().refine(val => val === true, {
    message: "You must agree to receive emails"
  })
});

type NewsletterForm = z.infer<typeof newsletterSchema>;

const HeroSection = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const { toast } = useToast();
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm<NewsletterForm>({
    resolver: zodResolver(newsletterSchema),
    defaultValues: {
      email: "",
      consent: false
    }
  });

  const onSubmit = async (data: NewsletterForm) => {
    setIsSubmitting(true);
    
    try {
      await apiRequest("POST", "/api/newsletter/subscribe", data);
      
      toast({
        title: "Subscription successful!",
        description: "Thank you for subscribing to our newsletter.",
        variant: "default",
      });
      
      reset();
      setShowForm(false);
    } catch (error) {
      toast({
        title: "Subscription failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <section className="hero-section py-12 md:py-16">
      {/* Dark gradient overlay */}
      <div className="hero-background-gradient"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row items-center">
          <div className="w-full md:w-1/2 space-y-4 mb-6 md:mb-0">
            <h1 className="font-heading font-bold text-3xl md:text-4xl lg:text-5xl text-white">
              Build a Digital Empire<br/>Without The <span className="text-primary spotlight-text">
                Spotlight
                <div className="spotlight-effect"></div>
              </span>
            </h1>
            <p className="text-base md:text-lg text-neutral-100 max-w-xl">
              Building your online business from behind the scenes. Strategies, tools, and insights for the solopreneur who values privacy.
            </p>
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-2">
              <Link href="/articles">
                <div className="inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-neutral-900 bg-primary hover:bg-primary-light transition duration-150 shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary cursor-pointer">
                  Explore Content
                </div>
              </Link>
              <div className="relative">
                {!showForm ? (
                  <button 
                    onClick={() => setShowForm(true)}
                    className="inline-flex justify-center items-center px-6 py-3 border border-primary text-base font-medium rounded-md text-primary bg-neutral-900/50 hover:bg-neutral-900/70 transition duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-light cursor-pointer"
                  >
                    Join Newsletter
                  </button>
                ) : (
                  <div className="bg-neutral-900/80 border border-primary rounded-lg p-4 w-full sm:w-80 md:absolute md:right-0 mt-3 md:mt-0">
                    <form onSubmit={handleSubmit(onSubmit)}>
                      <div className="mb-3">
                        <input 
                          type="email" 
                          placeholder="Enter your email" 
                          className={`w-full px-3 py-2 text-sm text-white placeholder-neutral-400 bg-neutral-800 border border-neutral-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-light ${errors.email ? 'border-red-500 focus:ring-red-500' : ''}`}
                          {...register('email')}
                        />
                        {errors.email && (
                          <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>
                        )}
                      </div>
                      
                      <div className="flex items-start mb-3">
                        <input 
                          type="checkbox"
                          className={`h-4 w-4 mt-0.5 text-primary focus:ring-primary border-neutral-700 rounded ${errors.consent ? 'border-red-500' : ''}`}
                          {...register('consent')}
                        />
                        <span className="ml-2 text-xs text-neutral-300">
                          I agree to receive emails with exclusive strategies
                        </span>
                      </div>
                      {errors.consent && (
                        <p className="mb-3 -mt-2 text-xs text-red-400">{errors.consent.message}</p>
                      )}
                      
                      <div className="flex space-x-2">
                        <button 
                          type="submit" 
                          className="flex-1 bg-primary hover:bg-primary-light text-neutral-900 text-sm font-medium py-2 px-3 rounded-md transition duration-150 flex items-center justify-center"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <>
                              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-neutral-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Joining...
                            </>
                          ) : "Subscribe"}
                        </button>
                        <button 
                          type="button" 
                          className="bg-neutral-800 hover:bg-neutral-700 text-white text-sm font-medium py-2 px-3 rounded-md transition duration-150"
                          onClick={() => setShowForm(false)}
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
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
