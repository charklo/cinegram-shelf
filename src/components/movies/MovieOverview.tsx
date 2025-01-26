import { Film } from "lucide-react";

interface MovieOverviewProps {
  overview: string;
  cast?: { name: string }[];
}

export const MovieOverview = ({ overview, cast }: MovieOverviewProps) => {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-2xl font-semibold mb-4">Overview</h3>
        <p className="text-muted-foreground leading-relaxed">
          {overview || "No overview available."}
        </p>
      </div>

      {cast && cast.length > 0 && (
        <div>
          <h3 className="text-2xl font-semibold mb-4">Cast</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {cast.slice(0, 6).map((actor) => (
              <div key={actor.name} className="flex items-center gap-2">
                <Film className="w-4 h-4" />
                <span>{actor.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};