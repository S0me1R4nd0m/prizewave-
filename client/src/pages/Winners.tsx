import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import WinnerCard from "@/components/WinnerCard";
import Newsletter from "@/components/Newsletter";

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

export default function Winners() {
  const { data: winners, isLoading } = useQuery<Winner[]>({
    queryKey: ['/api/winners/recent', 10], // Get 10 winners
  });

  return (
    <div>
      <section className="py-16 bg-gradient-to-br from-primary-light/10 to-primary/20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto mb-12 text-center">
            <h1 className="text-4xl font-bold text-neutral-900 mb-4">
              Our Lucky Winners
            </h1>
            <p className="text-lg text-neutral-600">
              Meet the lucky participants who won our giveaways. Could you be next?
              Enter our active giveaways for your chance to win!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {isLoading ? (
              Array(4)
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
              winners.map((winner) => (
                <WinnerCard key={winner.id} winner={winner} />
              ))
            ) : (
              <div className="col-span-2 text-center py-8 bg-white p-10 rounded-xl shadow-md">
                <h3 className="text-xl font-bold text-neutral-900 mb-2">No Winners Yet</h3>
                <p className="text-neutral-600">
                  We haven't announced any winners yet. Check back soon or enter our active giveaways for your chance to win!
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
      
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl font-bold text-neutral-900 mb-8 text-center">
            Winning Moments
          </h2>
          
          <div className="bg-neutral-100 p-8 rounded-2xl">
            <div className="mb-6">
              <h3 className="text-2xl font-bold mb-3">How We Select Winners</h3>
              <p className="text-neutral-600">
                At PrizeWave, we pride ourselves on a fair and transparent winner selection process. 
                All winners are selected at random using our secure random selection algorithm after the giveaway 
                end date has passed. Every valid entry has an equal chance of winning.
              </p>
            </div>
            
            <div className="mb-6">
              <h3 className="text-2xl font-bold mb-3">Winner Announcement</h3>
              <p className="text-neutral-600">
                Winners are announced within 24 hours after the giveaway ends. All participants 
                receive an email notification about the results, and winners receive detailed instructions 
                on how to claim their prizes.
              </p>
            </div>
            
            <div>
              <h3 className="text-2xl font-bold mb-3">Your Chances of Winning</h3>
              <p className="text-neutral-600">
                Your chances of winning depend on the total number of entries in each giveaway. 
                Giveaways with fewer entries give you higher chances of winning, so look for the 
                "High chance" indicator when browsing active giveaways!
              </p>
            </div>
          </div>
        </div>
      </section>
      
      <Newsletter />
    </div>
  );
}
