import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { CheckCircle, UserPlus, Search, Trophy, ArrowRight, Gift, Calendar, Users } from "lucide-react";
import Newsletter from "@/components/Newsletter";

export default function HowItWorksPage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-primary-light/10 to-primary/20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-6">
              How PrizeWave Works
            </h1>
            <p className="text-lg md:text-xl text-neutral-600 mb-8">
              Participating in our giveaways is quick, easy, and completely free.
              Follow these simple steps and you could be our next big winner!
            </p>
            <Button
              size="lg"
              className="px-8 py-6 bg-primary hover:bg-primary-dark text-white font-medium rounded-full shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
            >
              <Link href="/giveaways">Browse Giveaways Now</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Process Steps */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-neutral-900 text-center mb-16">
            Three Simple Steps
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            {/* Step 1 */}
            <div className="text-center">
              <div className="w-24 h-24 bg-primary-light/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <UserPlus className="text-primary w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold mb-4">1. Create Account</h3>
              <p className="text-neutral-600">
                Sign up for free with your email or social media account. 
                Complete your profile to increase your chances of winning.
              </p>
              <div className="mt-6 space-y-2 text-sm text-left">
                <div className="flex items-center">
                  <CheckCircle className="text-primary w-4 h-4 mr-2 flex-shrink-0" />
                  <span>Quick 30-second registration</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="text-primary w-4 h-4 mr-2 flex-shrink-0" />
                  <span>Secure and private</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="text-primary w-4 h-4 mr-2 flex-shrink-0" />
                  <span>No credit card required</span>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="w-24 h-24 bg-primary-light/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="text-primary w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold mb-4">2. Find Giveaways</h3>
              <p className="text-neutral-600">
                Browse through our collection of exciting prizes. Filter by category, 
                region, or prize value to find giveaways that interest you.
              </p>
              <div className="mt-6 space-y-2 text-sm text-left">
                <div className="flex items-center">
                  <CheckCircle className="text-primary w-4 h-4 mr-2 flex-shrink-0" />
                  <span>Diverse range of prizes</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="text-primary w-4 h-4 mr-2 flex-shrink-0" />
                  <span>New giveaways added weekly</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="text-primary w-4 h-4 mr-2 flex-shrink-0" />
                  <span>Easy filtering options</span>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="w-24 h-24 bg-primary-light/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Trophy className="text-primary w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold mb-4">3. Enter & Win</h3>
              <p className="text-neutral-600">
                Submit your entry with just a few clicks. Winners are selected 
                randomly after the giveaway end date and notified immediately.
              </p>
              <div className="mt-6 space-y-2 text-sm text-left">
                <div className="flex items-center">
                  <CheckCircle className="text-primary w-4 h-4 mr-2 flex-shrink-0" />
                  <span>Simple entry process</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="text-primary w-4 h-4 mr-2 flex-shrink-0" />
                  <span>Fair winner selection</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="text-primary w-4 h-4 mr-2 flex-shrink-0" />
                  <span>Instant notifications</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-neutral-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-neutral-900 text-center mb-12">
            Frequently Asked Questions
          </h2>

          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-xl font-bold mb-2">Is it really free to enter?</h3>
              <p className="text-neutral-600">
                Yes, all our giveaways are completely free to enter. We never ask for payment 
                information, and there are no hidden fees.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-xl font-bold mb-2">How do I know if I've won?</h3>
              <p className="text-neutral-600">
                Winners are notified via email and on our website. We'll also announce winners 
                on our social media channels. Make sure to check your email regularly!
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-xl font-bold mb-2">How are winners selected?</h3>
              <p className="text-neutral-600">
                Winners are selected randomly using our secure random selection algorithm. 
                Every valid entry has an equal chance of winning.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-xl font-bold mb-2">How do I claim my prize?</h3>
              <p className="text-neutral-600">
                If you win, we'll send detailed instructions on how to claim your prize via email. 
                Different prizes may have different claiming processes.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-xl font-bold mb-2">Can I enter multiple giveaways?</h3>
              <p className="text-neutral-600">
                Absolutely! You can enter as many different giveaways as you want. However, 
                you can only enter each individual giveaway once.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-neutral-900 text-center mb-12">
            Why Choose PrizeWave?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary-light/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Gift className="text-primary w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold mb-2">Amazing Prizes</h3>
              <p className="text-neutral-600 text-sm">
                From tech gadgets to luxury vacations, we offer a wide variety of high-quality prizes.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary-light/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="text-primary w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold mb-2">Regular Giveaways</h3>
              <p className="text-neutral-600 text-sm">
                New giveaways are added weekly, giving you plenty of opportunities to win.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary-light/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="text-primary w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold mb-2">Growing Community</h3>
              <p className="text-neutral-600 text-sm">
                Join thousands of happy participants who have already won with PrizeWave.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary-light/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="text-primary w-6 h-6"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
              </div>
              <h3 className="text-lg font-bold mb-2">Safe & Secure</h3>
              <p className="text-neutral-600 text-sm">
                Your personal information is always protected. We never share your data with third parties.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-primary/5">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-white rounded-2xl p-8 md:p-12 shadow-md text-center">
            <h2 className="text-3xl font-bold text-neutral-900 mb-4">
              Ready to Try Your Luck?
            </h2>
            <p className="text-lg text-neutral-600 mb-8 max-w-2xl mx-auto">
              It only takes a minute to sign up and start entering giveaways.
              Who knows, you might be our next big winner!
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button 
                size="lg" 
                className="px-8 py-3 bg-primary hover:bg-primary-dark text-white font-medium rounded-full shadow-md hover:shadow-lg transition-all"
                asChild
              >
                <Link href="/giveaways">
                  Browse Giveaways
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button 
                variant="outline"
                size="lg" 
                className="px-8 py-3 border-primary text-primary hover:bg-primary hover:text-white font-medium rounded-full shadow-sm hover:shadow-md transition-all"
              >
                Create Account
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Newsletter />
    </div>
  );
}
