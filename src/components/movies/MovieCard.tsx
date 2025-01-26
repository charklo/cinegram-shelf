import { Card } from "@/components/ui/card";
import { Star } from "lucide-react";

interface MovieCardProps {
  title: string;
  posterUrl: string;
  rating: number;
  userRating?: number;
  userReview?: string;
  onClick: () => void;
}

export const MovieCard = ({ title, posterUrl, rating, userRating, userReview, onClick }: MovieCardProps) => {
  return (
    <Card className="movie-card cursor-pointer group relative" onClick={onClick}>
      <img
        src={posterUrl}
        alt={title}
        className="w-full h-full object-cover"
      />
      <div className="movie-card-content">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <div className="flex items-center mt-2">
          <Star className="w-4 h-4 text-yellow-400 mr-1" />
          <span className="text-sm text-white">{rating.toFixed(1)}</span>
          {userRating && (
            <div className="ml-2 text-sm text-white">
              Your rating: {userRating}
            </div>
          )}
        </div>
        {userReview && (
          <p className="text-sm text-white mt-2 line-clamp-2">
            Your review: {userReview}
          </p>
        )}
      </div>
    </Card>
  );
};