import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, Calendar, ArrowRight } from "lucide-react";
import WinnerCard from "./WinnerCard";

interface Winner {
  id: number;
  giveawayId: number;
  userId: number;
  entryId: number;
  announcementDate: string;
  testimonial: string;
  location: string;
  user: {
    id: number;
    username: string;
    fullName: string;
    email: string;
    country: string;
  };
  giveaway: {
    id: number;
    title: string;
    prize: string;
    category: string;
    imageUrl: string;
  };
}

export default function WinnerSpotlight() {
  const { data: winners, isLoading } = useQuery<Winner[]>({
    queryKey: ['/api/winners/recent'],
  });

  return (
    <section className="py-16 bg-neutral-100">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-neutral-900 text-center mb-4">Recent Winners</h2>
        <p className="text-neutral-600 text-center mb-12 max-w-xl mx-auto">
          Real people, real prizes! Meet our latest lucky winners and see what they took home.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {isLoading ? (
            Array(2)
              .fill(0)
              .map((_, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-md overflow-hidden transition-all hover:shadow-lg border border-neutral-200"
                >
                  <div className="flex flex-col sm:flex-row">
                    <Skeleton className="w-full sm:w-2/5 h-48 sm:h-auto" />
                    <div className="w-full sm:w-3/5 p-5">
                      <div className="flex items-center mb-2">
                        <Skeleton className="h-4 w-32 mb-1" />
                        <Skeleton className="h-4 w-16 ml-2" />
                      </div>
                      <Skeleton className="h-6 w-40 mb-2" />
                      <Skeleton className="h-4 w-32 mb-4" />
                      <Skeleton className="h-16 w-full mb-4" />
                      <Skeleton className="h-4 w-40" />
                    </div>
                  </div>
                </div>
              ))
          ) : winners && winners.length > 0 ? (
            winners.slice(0, 2).map((winner) => (
              <WinnerCard key={winner.id} winner={winner} />
            ))
          ) : (
            <div className="col-span-2 text-center py-8">
              <p className="text-neutral-500">No recent winners to display.</p>
            </div>
          )}
        </div>

        <div className="text-center mt-12">
          <Button
            variant="outline"
            className="inline-flex items-center px-6 py-3 bg-white border border-primary text-primary font-medium rounded-full hover:bg-primary hover:text-white transition-colors shadow-sm"
            asChild
          >
            <Link href="/winners">
              <span>View All Winners</span>
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
