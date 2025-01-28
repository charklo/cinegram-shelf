import { Check, Play, Star, Tv } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useState, useEffect } from "react";
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
  const { toast } = useToast();
  const [frenchOverview, setFrenchOverview] = useState<string>("");
  const [seasons, setSeasons] = useState<Season[]>(
    Array.from({ length: numberOfSeasons }, (_, i) => ({
      number: i + 1,
      watched: seasonsWatched.includes(i + 1)
    }))
  );

  useEffect(() => {
    const translateOverview = async () => {
      try {
        const response = await fetch('https://api.perplexity.ai/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_PERPLEXITY_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'llama-3.1-sonar-small-128k-online',
            messages: [
              {
                role: 'system',
                content: 'You are a translator. Translate the following text from English to French. Only respond with the translation, nothing else.'
              },
              {
                role: 'user',
                content: overview
              }
            ],
            temperature: 0.2,
          }),
        });

        if (!response.ok) throw new Error('Translation failed');
        
        const data = await response.json();
        setFrenchOverview(data.choices[0].message.content);
      } catch (error) {
        console.error('Translation error:', error);
        setFrenchOverview("Traduction non disponible");
      }
    };

    if (overview) {
      translateOverview();
    }
  }, [overview]);

  useEffect(() => {
    setSeasons(Array.from({ length: numberOfSeasons }, (_, i) => ({
      number: i + 1,
      watched: seasonsWatched.includes(i + 1)
    })));
  }, [numberOfSeasons, seasonsWatched]);

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
        
        <div>
          <h4 className="font-semibold mb-2">Synopsis (Français)</h4>
          <p className="text-muted-foreground leading-relaxed">
            {frenchOverview || "Traduction en cours..."}
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

      {cast && cast.length > 0 && (
        <div>
          <h3 className="text-2xl font-semibold mb-4">Cast</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {cast.map((actor) => (
              <div key={actor.name} className="flex items-center gap-3 p-2 rounded-lg border bg-card">
                <Avatar className="h-12 w-12">
                  {actor.profile_path ? (
                    <AvatarImage 
                      src={`https://image.tmdb.org/t/p/w92${actor.profile_path}`} 
                      alt={actor.name} 
                    />
                  ) : (
                    <AvatarFallback>
                      <Tv className="h-6 w-6" />
                    </AvatarFallback>
                  )}
                </Avatar>
                <div>
                  <p className="font-medium text-sm">{actor.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {numberOfSeasons > 0 && (
        <div>
          <h3 className="text-2xl font-semibold mb-4">Track Seasons</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {seasons.map((season) => (
              <div 
                key={season.number} 
                className="flex items-center space-x-2 p-3 rounded-lg border bg-card"
              >
                <Checkbox
                  id={`season-${season.number}`}
                  checked={season.watched}
                  onCheckedChange={() => handleSeasonToggle(season.number)}
                />
                <label
                  htmlFor={`season-${season.number}`}
                  className="text-sm font-medium leading-none cursor-pointer"
                >
                  Season {season.number}
                </label>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};