import { Tv } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface CastMember {
  name: string;
  profile_path?: string;
}

interface TvShowCastProps {
  cast?: CastMember[];
}

export const TvShowCast = ({ cast }: TvShowCastProps) => {
  if (!cast || cast.length === 0) return null;

  return (
    <div>
      <h3 className="text-2xl font-semibold mb-4">Cast</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {cast.map((actor) => (
          <div 
            key={actor.name} 
            className="flex items-center gap-4 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
          >
            <Avatar className="h-16 w-16 border-2 border-primary">
              {actor.profile_path ? (
                <AvatarImage 
                  src={`https://image.tmdb.org/t/p/w92${actor.profile_path}`} 
                  alt={actor.name}
                  className="object-cover"
                />
              ) : (
                <AvatarFallback className="bg-primary/10">
                  <Tv className="h-8 w-8 text-primary" />
                </AvatarFallback>
              )}
            </Avatar>
            <div>
              <p className="font-medium text-base leading-tight">{actor.name}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};