import { Card } from "@/components/ui/card";
import { Star } from "lucide-react";

interface MovieCardProps {
  title: string;
  posterUrl: string;
  rating: number;
  onClick: () => void;
}

export const MovieCard = ({ title, posterUrl, rating, onClick }: MovieCardProps) => {
  return (
    <Card className="movie-card cursor-pointer" onClick={onClick}>
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
        </div>
      </div>
    </Card>
  );
};