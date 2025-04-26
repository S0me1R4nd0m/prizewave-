import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format the date nicely
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  }).format(d);
}

// Get a formatted time remaining string
export function getTimeRemaining(endDate: Date | string): string {
  const end = typeof endDate === 'string' ? new Date(endDate) : endDate;
  const now = new Date();
  
  if (now > end) {
    return 'Expired';
  }
  
  const diffMs = end.getTime() - now.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  
  if (diffDays > 0) {
    return `${diffDays} days left`;
  } else if (diffHours > 0) {
    return `${diffHours} hours left`;
  } else {
    return 'Ending soon';
  }
}

// Get a random chance text and color based on entry percentage
export function getChanceInfo(entryCount: number, targetEntries: number = 5000) {
  const percentage = (entryCount / targetEntries) * 100;
  
  if (percentage < 30) {
    return {
      text: 'High chance',
      color: 'bg-green-100 text-green-700'
    };
  } else if (percentage > 70) {
    return {
      text: 'Low chance',
      color: 'bg-red-100 text-red-700'
    };
  } else {
    return {
      text: 'Medium chance',
      color: 'bg-orange-100 text-orange-700'
    };
  }
}
