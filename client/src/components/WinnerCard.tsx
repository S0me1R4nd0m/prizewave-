import { MapPin, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

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

interface WinnerCardProps {
  winner: Winner;
}

export default function WinnerCard({ winner }: WinnerCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all hover:shadow-lg border border-neutral-200">
      <div className="flex flex-col sm:flex-row">
        <div className="w-full sm:w-2/5">
          <img
            className="w-full h-full object-cover"
            src={winner.giveaway.imageUrl}
            alt={`Prize: ${winner.giveaway.prize}`}
          />
        </div>
        <div className="w-full sm:w-3/5 p-5">
          <div className="flex items-center mb-2">
            <span className="text-sm font-medium text-primary">Winner Announcement</span>
            <Badge variant="outline" className="ml-2 px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
              {winner.giveaway.prize}
            </Badge>
          </div>
          <h3 className="text-xl font-bold text-neutral-900">{winner.user.fullName}</h3>
          <div className="flex items-center mt-1 mb-3">
            <MapPin className="text-neutral-500 w-4 h-4" />
            <span className="text-sm text-neutral-500 ml-1">{winner.location}</span>
          </div>
          <p className="text-neutral-600 text-sm">
            "{winner.testimonial}"
          </p>
          <div className="mt-4 flex items-center">
            <Calendar className="text-neutral-500 w-4 h-4" />
            <span className="text-sm text-neutral-500 ml-1">
              Won on {format(new Date(winner.announcementDate), "MMMM d, yyyy")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
