import { useCountdown } from "@/hooks/useCountdown";

interface CountdownTimerProps {
  targetDate: Date;
  className?: string;
}

export default function CountdownTimer({ targetDate, className = "" }: CountdownTimerProps) {
  const { days, hours, minutes, seconds } = useCountdown(targetDate);

  const isExpired = days + hours + minutes + seconds <= 0;

  if (isExpired) {
    return (
      <div className={className}>
        <div className="bg-red-100 text-red-700 rounded px-3 py-1 text-center">
          <span className="font-bold text-lg">Expired</span>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="bg-neutral-100 rounded px-2 py-1 text-center">
        <span className="font-bold text-lg">{String(days).padStart(2, "0")}</span>
        <span className="text-xs block text-neutral-500">days</span>
      </div>
      <div className="bg-neutral-100 rounded px-2 py-1 text-center">
        <span className="font-bold text-lg">{String(hours).padStart(2, "0")}</span>
        <span className="text-xs block text-neutral-500">hrs</span>
      </div>
      <div className="bg-neutral-100 rounded px-2 py-1 text-center">
        <span className="font-bold text-lg">{String(minutes).padStart(2, "0")}</span>
        <span className="text-xs block text-neutral-500">min</span>
      </div>
      <div className="bg-neutral-100 rounded px-2 py-1 text-center">
        <span className="font-bold text-lg">{String(seconds).padStart(2, "0")}</span>
        <span className="text-xs block text-neutral-500">sec</span>
      </div>
    </div>
  );
}
