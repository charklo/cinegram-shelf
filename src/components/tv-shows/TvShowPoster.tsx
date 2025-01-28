import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface TvShowPosterProps {
  posterUrl?: string;
  title: string;
  className?: string;
  allSeasonsWatched?: boolean;
}

export const TvShowPoster = ({ posterUrl, title, className, allSeasonsWatched }: TvShowPosterProps) => {
  return (
    <div className={cn("relative rounded-lg overflow-hidden", className)}>
      {posterUrl ? (
        <img
          src={posterUrl}
          alt={title}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full bg-muted flex items-center justify-center">
          <span className="text-muted-foreground">No poster available</span>
        </div>
      )}
      {allSeasonsWatched && (
        <div className="absolute top-2 right-2 bg-primary rounded-full p-1">
          <Check className="w-4 h-4 text-primary-foreground" />
        </div>
      )}
    </div>
  );
};