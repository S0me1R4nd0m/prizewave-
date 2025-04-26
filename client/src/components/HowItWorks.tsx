import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { UserPlus, Search, Trophy } from "lucide-react";

export default function HowItWorks() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-neutral-900 text-center mb-4">How It Works</h2>
        <p className="text-neutral-600 text-center mb-12 max-w-xl mx-auto">
          Participating in our giveaways is quick and easy. Follow these simple steps to get started.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Step 1 */}
          <div className="text-center">
            <div className="w-20 h-20 bg-primary-light/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <UserPlus className="text-primary w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold mb-3">Create Your Account</h3>
            <p className="text-neutral-600">
              Sign up with your email or social media account. It only takes 30 seconds!
            </p>
          </div>

          {/* Step 2 */}
          <div className="text-center">
            <div className="w-20 h-20 bg-primary-light/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="text-primary w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold mb-3">Find Giveaways</h3>
            <p className="text-neutral-600">
              Browse through our collection of exciting prizes and select the ones you want.
            </p>
          </div>

          {/* Step 3 */}
          <div className="text-center">
            <div className="w-20 h-20 bg-primary-light/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Trophy className="text-primary w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold mb-3">Enter & Win</h3>
            <p className="text-neutral-600">
              Complete entry requirements and wait for the winner announcement. Good luck!
            </p>
          </div>
        </div>

        <div className="mt-12 bg-neutral-100 rounded-2xl p-8 max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row items-center">
            <div className="w-full md:w-3/5 mb-6 md:mb-0 md:pr-8">
              <h3 className="text-2xl font-bold mb-4">Ready to win amazing prizes?</h3>
              <p className="text-neutral-600 mb-6">
                Join thousands of happy participants who have already won with PrizeWave.
                It's completely free to join and you could be our next big winner!
              </p>
              <Button size="lg" className="px-6 py-3 bg-primary hover:bg-primary-dark text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all">
                Create Account Now
              </Button>
            </div>
            <div className="w-full md:w-2/5">
              <div className="bg-neutral-200 w-full h-48 rounded-lg flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-12 h-12 text-neutral-400"
                >
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
