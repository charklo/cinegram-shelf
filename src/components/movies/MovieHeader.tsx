import { Star, Users, Award } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MovieHeaderProps {
  title: string;
  releaseYear: string;
  duration?: number;
  userRating?: number | null;
  averageRating: number;
  imdbRating?: number;
  onClose: () => void;
}

export const MovieHeader = ({
  title,
  releaseYear,
  duration,
  userRating,
  averageRating,
  imdbRating,
  onClose,
}: MovieHeaderProps) => {
  return (
    <div className="flex justify-between items-start mb-6">
      <div>
        <h2 className="text-4xl font-bold mb-2">{title}</h2>
        <div className="flex items-center gap-4 text-muted-foreground">
          <span>{releaseYear}</span>
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
            {imdbRating && (
              <div className="flex items-center">
                <Award className="w-5 h-5 text-blue-400 mr-1" />
                <span className="font-semibold text-blue-400">IMDB: {imdbRating}</span>
              </div>
            )}
          </div>
        </div>
      </div>
      <Button variant="ghost" onClick={onClose} className="text-2xl">×</Button>
    </div>
  );
};