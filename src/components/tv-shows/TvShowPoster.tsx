import { Check } from "lucide-react";

interface TvShowPosterProps {
  posterUrl: string;
  title: string;
  creator?: string;
  isCompleted?: boolean;
}

export const TvShowPoster = ({ posterUrl, title, creator, isCompleted }: TvShowPosterProps) => {
  return (
    <div className="sticky top-6">
      <div className="relative">
        <img
          src={posterUrl || "https://images.unsplash.com/photo-1485827404703-89b55fcc595e"}
          alt={title}
          className="w-full rounded-lg shadow-xl"
        />
        {isCompleted && (
          <div className="absolute top-2 right-2 bg-green-500 rounded-full p-1">
            <Check className="h-4 w-4 text-white" />
          </div>
        )}
      </div>
      {creator && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Creator</h3>
          <p className="text-muted-foreground">{creator}</p>
        </div>
      )}
    </div>
  );
};