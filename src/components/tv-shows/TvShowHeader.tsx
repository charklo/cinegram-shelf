import { Star, Users, Award } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TvShowHeaderProps {
  title: string;
  firstAirDate?: string;
  duration?: number;
  userRating?: number | null;
  averageRating: number;
  tmdbRating?: number;
  onClose: () => void;
}

export const TvShowHeader = ({
  title,
  firstAirDate,
  duration,
  userRating,
  averageRating,
  tmdbRating,
  onClose,
}: TvShowHeaderProps) => {
  const year = firstAirDate ? new Date(firstAirDate).getFullYear() : undefined;

  return (
    <div className="flex justify-between items-start mb-6">
      <div>
        <h2 className="text-4xl font-bold mb-2">{title}</h2>
        <div className="flex items-center gap-4 text-muted-foreground">
          {year && <span>{year}</span>}
          {duration && <span>{duration}m</span>}
          <div className="flex items-center gap-6">
            {userRating && (
              <div className="flex items-center">
                <Star className="w-5 h-5 text-primary mr-1" />
                <span className="font-semibold text-primary">Your rating: {userRating}</span>
              </div>
            )}
            {averageRating > 0 && (
              <div className="flex items-center">
                <Users className="w-5 h-5 text-yellow-400 mr-1" />
                <span className="font-semibold text-yellow-400">Community: {averageRating.toFixed(1)}</span>
              </div>
            )}
            {tmdbRating && (
              <div className="flex items-center">
                <Award className="w-5 h-5 text-blue-400 mr-1" />
                <span className="font-semibold text-blue-400">TMDB: {tmdbRating}</span>
              </div>
            )}
          </div>
        </div>
      </div>
      <Button variant="ghost" onClick={onClose} className="text-2xl">×</Button>
    </div>
  );
};