import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Globe, Map, Clock } from "lucide-react";
import { Giveaway } from "@shared/schema";
import { differenceInDays, differenceInHours } from "date-fns";

interface GiveawayCardProps {
  giveaway: Giveaway;
}

export default function GiveawayCard({ giveaway }: GiveawayCardProps) {
  const {
    id,
    title,
    description,
    imageUrl,
    category,
    region,
    isPopular,
    isPremium,
    endDate,
    targetEntries,
  } = giveaway;

  // Calculate time remaining
  const now = new Date();
  const end = new Date(endDate);
  const daysRemaining = differenceInDays(end, now);
  const hoursRemaining = differenceInHours(end, now) % 24;
  
  let timeRemainingText = "";
  if (daysRemaining > 0) {
    timeRemainingText = `${daysRemaining} days left`;
  } else if (hoursRemaining > 0) {
    timeRemainingText = `${hoursRemaining} hours left`;
  } else {
    timeRemainingText = "Ending soon";
  }
  
  // Determine entry chance (this would be based on real data in production)
  const entryCount = Math.floor(Math.random() * 5000); // Simulated entry count
  const entryPercentage = targetEntries ? (entryCount / targetEntries) * 100 : 50;
  
  let chanceText = "Medium chance";
  let chanceBadgeColor = "bg-orange-100 text-orange-700";
  
  if (entryPercentage < 30) {
    chanceText = "High chance";
    chanceBadgeColor = "bg-green-100 text-green-700";
  } else if (entryPercentage > 70) {
    chanceText = "Low chance";
    chanceBadgeColor = "bg-red-100 text-red-700";
  }

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all overflow-hidden border border-neutral-200">
      <div className="relative">
        <img className="w-full h-48 object-cover" src={imageUrl} alt={title} />
        {isPopular && (
          <div className="absolute top-3 right-3 bg-primary-dark text-white text-xs font-bold px-2 py-1 rounded">
            POPULAR
          </div>
        )}
        {daysRemaining === 0 && hoursRemaining < 12 && (
          <div className="absolute top-3 left-3 px-2 py-1 bg-red-500 text-white text-xs font-bold rounded">
            ENDING SOON
          </div>
        )}
      </div>
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <Badge variant="outline" className={`bg-${category.toLowerCase()}-100 text-${category.toLowerCase()}-700 rounded-full text-xs`}>
            {category}
          </Badge>
          <div className="flex items-center text-neutral-500">
            {isPremium ? (
              <div className="flex items-center text-yellow-500">
                <Star className="w-4 h-4" />
                <span className="text-sm font-medium ml-1">Premium</span>
              </div>
            ) : (
              <div className="flex items-center text-neutral-500">
                {region === "Global" ? (
                  <Globe className="w-4 h-4" />
                ) : (
                  <Map className="w-4 h-4" />
                )}
                <span className="text-sm font-medium ml-1">{region}</span>
              </div>
            )}
          </div>
        </div>
        <h3 className="text-xl font-bold text-neutral-900">{title}</h3>
        <p className="text-neutral-600 text-sm mt-1">{description}</p>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center text-sm text-neutral-500">
            <Clock className="w-4 h-4 mr-1" />
            <span>{timeRemainingText}</span>
          </div>
          <div className={`text-xs px-2 py-1 ${chanceBadgeColor} rounded-full`}>
            {chanceText}
          </div>
        </div>

        <div className="mt-3 w-full bg-neutral-200 rounded-full h-2.5">
          <div 
            className="bg-primary h-2.5 rounded-full" 
            style={{ width: `${Math.min(entryPercentage, 100)}%` }}
          ></div>
        </div>
        <div className="flex justify-between mt-1 text-xs text-neutral-500">
          <span>{entryCount.toLocaleString()} entries</span>
          {targetEntries && <span>Target: {targetEntries.toLocaleString()}</span>}
        </div>

        <Button
          className="mt-4 w-full px-4 py-2.5 bg-primary hover:bg-primary-dark text-white font-medium rounded-lg transition-colors"
          asChild
        >
          <Link href={`/giveaway/${id}`}>Enter Giveaway</Link>
        </Button>
      </div>
    </div>
  );
}
