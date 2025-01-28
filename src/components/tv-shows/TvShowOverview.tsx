import { Check, Play, Star, Tv } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface Season {
  number: number;
  watched: boolean;
}

interface TvShowOverviewProps {
  overview: string;
  cast?: { name: string; profile_path?: string }[];
  numberOfSeasons?: number;
  numberOfEpisodes?: number;
  status?: string;
  network?: string;
  userId?: string;
  tvShowId: string;
}

export const TvShowOverview = ({ 
  overview, 
  cast,
  numberOfSeasons = 0,
  numberOfEpisodes,
  status,
  network,
  userId,
  tvShowId
}: TvShowOverviewProps) => {
  const { toast } = useToast();
  const [seasons, setSeasons] = useState<Season[]>(
    Array.from({ length: numberOfSeasons }, (_, i) => ({
      number: i + 1,
      watched: false
    }))
  );

  const handleSeasonToggle = async (seasonNumber: number) => {
    if (!userId) {
      toast({
        title: "Error",
        description: "Please sign in to track seasons",
        variant: "destructive"
      });
      return;
    }

    try {
      const newSeasons = seasons.map(season => 
        season.number === seasonNumber 
          ? { ...season, watched: !season.watched }
          : season
      );
      setSeasons(newSeasons);

      // Update in database
      const { error } = await supabase
        .from('user_tv_shows')
        .upsert({
          user_id: userId,
          tv_show_id: tvShowId,
          seasons_watched: newSeasons.filter(s => s.watched).map(s => s.number)
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: `Season ${seasonNumber} ${newSeasons.find(s => s.number === seasonNumber)?.watched ? 'marked as watched' : 'unmarked'}`
      });
    } catch (error) {
      console.error('Error updating season status:', error);
      toast({
        title: "Error",
        description: "Failed to update season status",
        variant: "destructive"
      });
    }
  };

  const allSeasonsWatched = seasons.every(season => season.watched);
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

      <p className="text-muted-foreground leading-relaxed">
        {overview || "No overview available."}
      </p>

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

      {numberOfSeasons > 0 && (
        <div>
          <h3 className="text-2xl font-semibold mb-4">Seasons</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {seasons.map((season) => (
              <div key={season.number} className="flex items-center space-x-2">
                <Checkbox
                  id={`season-${season.number}`}
                  checked={season.watched}
                  onCheckedChange={() => handleSeasonToggle(season.number)}
                />
                <label
                  htmlFor={`season-${season.number}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Season {season.number}
                </label>
              </div>
            ))}
          </div>
        </div>
      )}

      {cast && cast.length > 0 && (
        <div>
          <h3 className="text-2xl font-semibold mb-4">Cast</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {cast.map((actor) => (
              <div key={actor.name} className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  {actor.profile_path ? (
                    <AvatarImage 
                      src={`https://image.tmdb.org/t/p/w45${actor.profile_path}`} 
                      alt={actor.name} 
                    />
                  ) : (
                    <AvatarFallback>
                      <Tv className="h-4 w-4" />
                    </AvatarFallback>
                  )}
                </Avatar>
                <span className="text-sm">{actor.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};