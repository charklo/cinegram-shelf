import { Play, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { TvShowCast } from "./TvShowCast";
import { TvShowSeasons } from "./TvShowSeasons";

interface TvShowOverviewProps {
  overview: string;
  cast?: { name: string; profile_path?: string }[];
  numberOfSeasons?: number;
  numberOfEpisodes?: number;
  status?: string;
  network?: string;
  userId?: string;
  tvShowId: string;
  seasonsWatched?: number[];
}

export const TvShowOverview = ({ 
  overview, 
  cast,
  numberOfSeasons = 0,
  numberOfEpisodes,
  status,
  network,
  userId,
  tvShowId,
  seasonsWatched = []
}: TvShowOverviewProps) => {
  const showStatus = status?.toLowerCase() === 'ended' ? 'Completed' : 'In Progress';

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-start">
        <h3 className="text-2xl font-semibold mb-4">Overview</h3>
        <Badge 
          variant={showStatus === 'Completed' ? "default" : "secondary"}
          className="flex items-center gap-1 px-3 py-1"
        >
          {showStatus === 'Completed' ? (
            <Star className="w-4 h-4" />
          ) : (
            <Play className="w-4 h-4" />
          )}
          {showStatus}
        </Badge>
      </div>

      <div className="space-y-6">
        <div className="bg-card rounded-lg p-6 border">
          <h4 className="font-semibold mb-3 text-lg">Synopsis</h4>
          <p className="text-muted-foreground leading-relaxed">
            {overview || "No overview available."}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {numberOfSeasons > 0 && (
          <div className="bg-card rounded-lg p-4 border">
            <h4 className="font-semibold mb-2">Seasons</h4>
            <p className="text-muted-foreground">{numberOfSeasons}</p>
          </div>
        )}
        {numberOfEpisodes && (
          <div className="bg-card rounded-lg p-4 border">
            <h4 className="font-semibold mb-2">Episodes</h4>
            <p className="text-muted-foreground">{numberOfEpisodes}</p>
          </div>
        )}
        {status && (
          <div className="bg-card rounded-lg p-4 border">
            <h4 className="font-semibold mb-2">Status</h4>
            <p className="text-muted-foreground">{status}</p>
          </div>
        )}
        {network && (
          <div className="bg-card rounded-lg p-4 border">
            <h4 className="font-semibold mb-2">Network</h4>
            <p className="text-muted-foreground">{network}</p>
          </div>
        )}
      </div>

      {cast && cast.length > 0 && (
        <div className="bg-card rounded-lg p-6 border">
          <TvShowCast cast={cast} />
        </div>
      )}

      {numberOfSeasons > 0 && (
        <div className="bg-card rounded-lg p-6 border">
          <TvShowSeasons
            numberOfSeasons={numberOfSeasons}
            seasonsWatched={seasonsWatched}
            userId={userId}
            tvShowId={tvShowId}
          />
        </div>
      )}
    </div>
  );
};