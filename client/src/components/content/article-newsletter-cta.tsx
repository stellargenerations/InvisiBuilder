import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const newsletterSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type NewsletterForm = z.infer<typeof newsletterSchema>;

const ArticleNewsletterCTA = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NewsletterForm>({
    resolver: zodResolver(newsletterSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: NewsletterForm) => {
    setIsSubmitting(true);

    try {
      await apiRequest("POST", "/api/newsletter/subscribe", {
        ...data,
        consent: true, // Auto-consent for simplified form
        source: "article_cta",
      });

      setIsSuccess(true);

      toast({
        title: "Subscription successful!",
        description: "Thank you for subscribing to our newsletter.",
        variant: "default",
      });

      reset();
    } catch (error) {
      toast({
        title: "Subscription failed",
        description:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-12 mb-2 bg-neutral-900 border-2 border-primary rounded-xl p-6 shadow-lg">
      <div className="flex flex-col md:flex-row items-center gap-6">
        <div className="flex-1">
          <h3 className="text-2xl font-heading font-bold text-primary mb-2">
            Ready to Start An Income Machine?
          </h3>
          <p className="text-white mb-0">
            Ideas and inspirations matter but execution counts. Take it from
            people like you, to see how it's done.
          </p>
          <p className="text-white/80 text-sm mt-1">
            Join our community of invisible builders today.
          </p>
        </div>

        {isSuccess ? (
          <div className="bg-primary/20 border-2 border-primary p-6 rounded-lg text-white text-center w-full md:w-auto">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 mx-auto text-primary mb-3"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <p className="font-bold text-lg text-primary">
              Thanks for subscribing!
            </p>
            <p className="text-white mt-1">
              We'll be in touch soon with valuable insights.
            </p>
          </div>
        ) : (
          <form
            className="w-full md:w-auto flex-shrink-0"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-grow">
                <label htmlFor="article-newsletter-email" className="sr-only">
                  Email address
                </label>
                <input
                  id="article-newsletter-email"
                  type="email"
                  className={`w-full px-4 py-3 text-base text-neutral-800 placeholder-neutral-500 bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-white ${errors.email ? "border-red-500 focus:ring-red-500" : ""}`}
                  placeholder="Your email address"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-300">
                    {errors.email.message}
                  </p>
                )}
              </div>
              <button
                type="submit"
                className="inline-flex justify-center items-center px-5 py-3 border-2 border-primary text-base font-bold rounded-md text-neutral-900 bg-primary hover:bg-primary-light transition duration-150 shadow-md focus:outline-none focus:ring-2 focus:ring-primary-light disabled:opacity-50"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-neutral-900"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Subscribing...
                  </>
                ) : (
                  <>Subscribe</>
                )}
              </button>
            </div>
            <p className="mt-2 text-xs text-white/70">
              No spam. Unsubscribe anytime. By subscribing, you agree to receive
              emails.
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

export default ArticleNewsletterCTA;
