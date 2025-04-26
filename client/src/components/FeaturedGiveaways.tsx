import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronRight, Star } from "lucide-react";
import GiveawayCard from "./GiveawayCard";
import { Giveaway } from "@shared/schema";

export default function FeaturedGiveaways() {
  const { data: giveaways, isLoading } = useQuery<Giveaway[]>({
    queryKey: ['/api/giveaways/featured'],
  });

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-3xl font-bold text-neutral-900">Featured Giveaways</h2>
          <Link
            href="/giveaways"
            className="text-primary font-medium hover:text-primary-dark transition-colors flex items-center"
          >
            View All
            <ChevronRight className="ml-1 w-5 h-5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? (
            Array(3)
              .fill(0)
              .map((_, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-md overflow-hidden border border-neutral-200"
                >
                  <Skeleton className="w-full h-48" />
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-2">
                      <Skeleton className="h-6 w-20" />
                      <Skeleton className="h-6 w-24" />
                    </div>
                    <Skeleton className="h-7 w-full mb-2" />
                    <Skeleton className="h-4 w-full mb-5" />
                    <Skeleton className="h-4 w-32 mb-3" />
                    <Skeleton className="h-2.5 w-full mb-1" />
                    <div className="flex justify-between mb-4">
                      <Skeleton className="h-3 w-24" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                    <Skeleton className="h-10 w-full" />
                  </div>
                </div>
              ))
          ) : giveaways && giveaways.length > 0 ? (
            giveaways.map((giveaway) => (
              <GiveawayCard key={giveaway.id} giveaway={giveaway} />
            ))
          ) : (
            <div className="col-span-3 py-12 text-center">
              <p className="text-neutral-500">No featured giveaways available right now.</p>
              <Button asChild className="mt-4">
                <Link href="/giveaways">View All Giveaways</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
