import { Tv } from "lucide-react";

interface TvShowOverviewProps {
  overview: string;
  cast?: { name: string }[];
  numberOfSeasons?: number;
  numberOfEpisodes?: number;
  status?: string;
  network?: string;
}

export const TvShowOverview = ({ 
  overview, 
  cast,
  numberOfSeasons,
  numberOfEpisodes,
  status,
  network
}: TvShowOverviewProps) => {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-2xl font-semibold mb-4">Overview</h3>
        <p className="text-muted-foreground leading-relaxed">
          {overview || "No overview available."}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {numberOfSeasons && (
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

      {cast && cast.length > 0 && (
        <div>
          <h3 className="text-2xl font-semibold mb-4">Cast</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {cast.slice(0, 6).map((actor) => (
              <div key={actor.name} className="flex items-center gap-2">
                <Tv className="w-4 h-4" />
                <span>{actor.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};