import { useState } from "react";
import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Giveaway, Entry } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import CountdownTimer from "@/components/CountdownTimer";
import GiveawayEntryModal from "@/components/GiveawayEntryModal";
import { 
  Clock, 
  Users, 
  MapPin, 
  Gift, 
  Calendar, 
  CheckCircle, 
  Share2,
  ChevronLeft
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getTimeRemaining, getChanceInfo } from "@/lib/utils";
import { format } from "date-fns";
import { Link } from "wouter";

export default function GiveawayDetail() {
  const { id } = useParams();
  const giveawayId = parseInt(id);
  const [isEntryModalOpen, setIsEntryModalOpen] = useState(false);

  // Fetch giveaway details
  const { data: giveaway, isLoading: isLoadingGiveaway } = useQuery<Giveaway>({
    queryKey: [`/api/giveaways/${giveawayId}`],
  });

  // Fetch entry count
  const { data: entryData, isLoading: isLoadingEntries } = useQuery<{ count: number }>({
    queryKey: [`/api/entries/count/${giveawayId}`],
  });

  // Calculate entry stats
  const entryCount = entryData?.count || 0;
  const entryPercentage = giveaway?.targetEntries 
    ? Math.min(100, (entryCount / giveaway.targetEntries) * 100) 
    : 0;
  
  const chanceInfo = getChanceInfo(entryCount, giveaway?.targetEntries);

  // Check if giveaway has ended
  const hasEnded = giveaway 
    ? new Date() > new Date(giveaway.endDate) 
    : false;

  // Handle share button click
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: giveaway?.title || "Check out this giveaway",
        text: giveaway?.description || "I found this amazing giveaway!",
        url: window.location.href,
      })
      .catch((error) => console.log('Error sharing', error));
    } else {
      // Fallback for browsers that don't support navigator.share
      navigator.clipboard.writeText(window.location.href)
        .then(() => alert("Link copied to clipboard!"))
        .catch(() => alert("Failed to copy link"));
    }
  };

  // Parse eligibility requirements
  const eligibilityRequirements = giveaway?.eligibilityRequirements
    .split(",")
    .map(req => req.trim()) || [];

  return (
    <div className="bg-neutral-100 py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <Link href="/giveaways" className="inline-flex items-center text-primary hover:underline">
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to all giveaways
          </Link>
        </div>

        {isLoadingGiveaway ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Skeleton className="w-full h-96 rounded-2xl" />
            </div>
            <div>
              <Skeleton className="w-full h-96 rounded-2xl" />
            </div>
          </div>
        ) : giveaway ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white p-8 rounded-2xl shadow-md">
                <div className="relative mb-6">
                  <img 
                    src={giveaway.imageUrl} 
                    alt={giveaway.title} 
                    className="w-full h-64 md:h-80 object-cover rounded-xl"
                  />
                  
                  {giveaway.isPopular && (
                    <div className="absolute top-3 right-3 bg-primary-dark text-white text-xs font-bold px-3 py-1 rounded">
                      POPULAR
                    </div>
                  )}
                  
                  {giveaway.isPremium && (
                    <div className="absolute top-3 left-3 bg-yellow-500 text-white text-xs font-bold px-3 py-1 rounded">
                      PREMIUM
                    </div>
                  )}
                </div>
                
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <Badge variant="outline" className="bg-neutral-100 text-neutral-700">
                    {giveaway.category}
                  </Badge>
                  <div className="flex items-center text-neutral-500 text-sm">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>{giveaway.region}</span>
                  </div>
                  <div className="flex items-center text-neutral-500 text-sm">
                    <Gift className="w-4 h-4 mr-1" />
                    <span>Value: {giveaway.value || "N/A"}</span>
                  </div>
                </div>
                
                <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
                  {giveaway.title}
                </h1>
                
                <p className="text-lg text-neutral-600 mb-6">
                  {giveaway.description}
                </p>
                
                <div className="border-t border-b border-neutral-200 py-6 my-6">
                  <h2 className="text-xl font-bold mb-4">Prize Details</h2>
                  <div className="flex items-center text-neutral-700 mb-2">
                    <Gift className="w-5 h-5 mr-2 text-primary" />
                    <span className="font-medium">{giveaway.prize}</span>
                  </div>
                  <div className="flex items-center text-neutral-700 mb-2">
                    <Calendar className="w-5 h-5 mr-2 text-primary" />
                    <span>
                      Started on: {format(new Date(giveaway.startDate), "MMMM d, yyyy")}
                    </span>
                  </div>
                  <div className="flex items-center text-neutral-700">
                    <Calendar className="w-5 h-5 mr-2 text-primary" />
                    <span>
                      {hasEnded
                        ? `Ended on: ${format(new Date(giveaway.endDate), "MMMM d, yyyy")}`
                        : `Ends on: ${format(new Date(giveaway.endDate), "MMMM d, yyyy")}`}
                    </span>
                  </div>
                </div>
                
                <div className="mb-6">
                  <h2 className="text-xl font-bold mb-4">Eligibility Requirements</h2>
                  <ul className="space-y-2">
                    {eligibilityRequirements.map((requirement, index) => (
                      <li key={index} className="flex items-center text-neutral-700">
                        <CheckCircle className="w-5 h-5 mr-2 text-secondary" />
                        <span>{requirement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <Button 
                  variant="outline" 
                  className="flex items-center text-primary border-primary"
                  onClick={handleShare}
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share this giveaway
                </Button>
              </div>
            </div>
            
            <div>
              <div className="bg-white p-6 rounded-2xl shadow-md sticky top-24">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">
                    {hasEnded ? "Giveaway Ended" : "Time Remaining"}
                  </h3>
                  
                  {hasEnded ? (
                    <div className="bg-neutral-100 p-4 rounded-xl text-center">
                      <span className="text-lg font-bold text-neutral-500">
                        This giveaway has ended
                      </span>
                    </div>
                  ) : (
                    <CountdownTimer 
                      targetDate={new Date(giveaway.endDate)} 
                      className="flex space-x-2 justify-center"
                    />
                  )}
                </div>
                
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-semibold">Entry Progress</h3>
                    <span className="text-sm text-neutral-500">
                      {isLoadingEntries ? (
                        "Loading..."
                      ) : (
                        `${entryCount} ${entryCount === 1 ? "entry" : "entries"}`
                      )}
                    </span>
                  </div>
                  
                  <div className="w-full bg-neutral-200 rounded-full h-2.5 mb-2">
                    <div 
                      className="bg-primary h-2.5 rounded-full" 
                      style={{ width: `${entryPercentage}%` }}
                    ></div>
                  </div>
                  
                  <div className="flex justify-between text-xs text-neutral-500 mb-4">
                    <span>
                      {Math.round(entryPercentage)}% Complete
                    </span>
                    {giveaway.targetEntries && (
                      <span>
                        Target: {giveaway.targetEntries.toLocaleString()}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex justify-center">
                    <span className={`text-xs px-3 py-1 ${chanceInfo.color} rounded-full`}>
                      {chanceInfo.text}
                    </span>
                  </div>
                </div>
                
                <Button 
                  className="w-full bg-secondary hover:bg-secondary-dark text-white font-medium py-6"
                  size="lg"
                  disabled={hasEnded}
                  onClick={() => setIsEntryModalOpen(true)}
                >
                  {hasEnded ? "Giveaway Ended" : "Enter Now"}
                </Button>

                <div className="mt-6 text-center text-sm text-neutral-500">
                  <span>
                    {hasEnded
                      ? "Check back for future giveaways!"
                      : "It's completely free to enter!"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white p-8 rounded-2xl shadow-md text-center">
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">
              Giveaway Not Found
            </h2>
            <p className="text-neutral-600 mb-6">
              The giveaway you're looking for doesn't exist or has been removed.
            </p>
            <Button asChild>
              <Link href="/giveaways">Browse Other Giveaways</Link>
            </Button>
          </div>
        )}
      </div>

      {/* Entry Modal */}
      {giveaway && (
        <GiveawayEntryModal
          giveaway={giveaway}
          isOpen={isEntryModalOpen}
          onClose={() => setIsEntryModalOpen(false)}
        />
      )}
    </div>
  );
}
