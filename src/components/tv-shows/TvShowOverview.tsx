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
          className="flex items-center gap-1"
        >
          {showStatus === 'Completed' ? (
            <Star className="w-3 h-3" />
          ) : (
            <Play className="w-3 h-3" />
          )}
          {showStatus}
        </Badge>
      </div>

      <div className="space-y-4">
        <div>
          <h4 className="font-semibold mb-2">Synopsis</h4>
          <p className="text-muted-foreground leading-relaxed">
            {overview || "No overview available."}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {numberOfSeasons > 0 && (
          <div>
            <h4 className="font-semibold mb-1">Seasons</h4>
            <p className="text-muted-foreground">{numberOfSeasons}</p>
          </div>
        )}
        {numberOfEpisodes && (
          <div>
            <h4 className="font-semibold mb-1">Episodes</h4>
            <p className="text-muted-foreground">{numberOfEpisodes}</p>
          </div>
        )}
        {status && (
          <div>
            <h4 className="font-semibold mb-1">Status</h4>
            <p className="text-muted-foreground">{status}</p>
          </div>
        )}
        {network && (
          <div>
            <h4 className="font-semibold mb-1">Network</h4>
            <p className="text-muted-foreground">{network}</p>
          </div>
        )}
      </div>

      <TvShowCast cast={cast} />

      {numberOfSeasons > 0 && (
        <TvShowSeasons
          numberOfSeasons={numberOfSeasons}
          seasonsWatched={seasonsWatched}
          userId={userId}
          tvShowId={tvShowId}
        />
      )}
    </div>
  );
};