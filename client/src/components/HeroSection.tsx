import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, PlayCircle } from "lucide-react";
import CountdownTimer from "./CountdownTimer";
import { Skeleton } from "@/components/ui/skeleton";
import { Giveaway } from "@shared/schema";

export default function HeroSection() {
  const { data: featuredGiveaways, isLoading } = useQuery<Giveaway[]>({
    queryKey: ['/api/giveaways/featured'],
  });

  const primaryGiveaway = featuredGiveaways?.[0];

  return (
    <section className="relative overflow-hidden py-16 md:py-24 bg-gradient-to-br from-primary-light/10 to-primary/20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center">
          <div className="w-full md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-900 mb-4">
              Win Amazing <span className="text-primary">Prizes</span> Every Day
            </h1>
            <p className="text-lg md:text-xl text-neutral-700 mb-8">
              Join our community of winners and participate in exciting giveaways.
              It's free, fun, and just a few clicks away!
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="px-8 py-6 bg-primary hover:bg-primary-dark text-white font-medium rounded-full shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 flex items-center"
                asChild
              >
                <Link href="/giveaways">
                  <span>Browse Giveaways</span>
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="px-8 py-6 bg-white hover:bg-neutral-100 text-primary border border-primary font-medium rounded-full shadow-md hover:shadow-lg transition-all flex items-center"
                asChild
              >
                <Link href="/how-it-works">
                  <PlayCircle className="mr-2 w-5 h-5" />
                  <span>How It Works</span>
                </Link>
              </Button>
            </div>
            <div className="mt-8 flex items-center">
              <div className="flex -space-x-2">
                <div className="w-10 h-10 rounded-full border-2 border-white bg-neutral-200 flex items-center justify-center overflow-hidden">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-5 h-5 text-neutral-500"
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </div>
                <div className="w-10 h-10 rounded-full border-2 border-white bg-neutral-200 flex items-center justify-center overflow-hidden">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-5 h-5 text-neutral-500"
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </div>
                <div className="w-10 h-10 rounded-full border-2 border-white bg-neutral-200 flex items-center justify-center overflow-hidden">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-5 h-5 text-neutral-500"
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-neutral-600 font-medium">Join <span className="text-primary font-bold">15,000+</span> happy participants</p>
              </div>
            </div>
          </div>

          <div className="w-full md:w-1/2 flex justify-center">
            <div className="relative w-full max-w-md">
              <div className="absolute -right-4 -top-4 w-20 h-20 bg-secondary rounded-full flex items-center justify-center text-white font-bold z-10 shadow-lg animate-pulse">
                <div className="text-center">
                  <div className="text-2xl leading-none">NEW</div>
                  <div className="text-xs">TODAY</div>
                </div>
              </div>
              {isLoading ? (
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                  <Skeleton className="w-full h-56" />
                  <div className="p-6">
                    <Skeleton className="h-5 w-20 mb-2" />
                    <Skeleton className="h-8 w-full mb-2" />
                    <Skeleton className="h-4 w-full mb-4" />
                    <div className="mt-4 flex items-center justify-between">
                      <div>
                        <Skeleton className="h-4 w-20 mb-2" />
                        <div className="flex space-x-2 mt-1">
                          <Skeleton className="h-12 w-12" />
                          <Skeleton className="h-12 w-12" />
                          <Skeleton className="h-12 w-12" />
                          <Skeleton className="h-12 w-12" />
                        </div>
                      </div>
                      <Skeleton className="h-4 w-20" />
                    </div>
                    <Skeleton className="h-12 w-full mt-4" />
                  </div>
                </div>
              ) : primaryGiveaway ? (
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden transition-all hover:shadow-2xl">
                  <img
                    className="w-full h-56 object-cover"
                    src={primaryGiveaway.imageUrl}
                    alt={primaryGiveaway.title}
                  />
                  <div className="p-6">
                    <span className="px-3 py-1 bg-primary-light/20 text-primary-dark rounded-full text-sm font-medium">
                      {primaryGiveaway.category}
                    </span>
                    <h3 className="text-2xl font-bold mt-2">{primaryGiveaway.title}</h3>
                    <p className="text-neutral-600 mt-2">{primaryGiveaway.description}</p>

                    <div className="mt-4 flex items-center justify-between">
                      <div>
                        <p className="text-neutral-500 text-sm">Ends in:</p>
                        <CountdownTimer 
                          targetDate={new Date(primaryGiveaway.endDate)} 
                          className="flex space-x-2 mt-1"
                        />
                      </div>
                      <div>
                        <span className="text-sm text-neutral-500">Entries:</span>
                        <span className="font-bold text-lg ml-1">4,219</span>
                      </div>
                    </div>

                    <Button
                      className="w-full mt-4 px-4 py-6 bg-secondary hover:bg-secondary-dark text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all"
                      asChild
                    >
                      <Link href={`/giveaway/${primaryGiveaway.id}`}>Enter Now</Link>
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden flex items-center justify-center p-12">
                  <p className="text-neutral-500">No featured giveaways available</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 rounded-full"></div>
      <div className="absolute bottom-10 -left-20 w-60 h-60 bg-secondary/10 rounded-full"></div>
    </section>
  );
}
