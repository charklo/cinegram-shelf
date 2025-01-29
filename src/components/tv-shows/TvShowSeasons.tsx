import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Season {
  number: number;
  watched: boolean;
}

interface TvShowSeasonsProps {
  numberOfSeasons: number;
  seasonsWatched: number[];
  userId?: string;
  tvShowId: string;
}

export const TvShowSeasons = ({ 
  numberOfSeasons,
  seasonsWatched = [],
  userId,
  tvShowId
}: TvShowSeasonsProps) => {
  const { toast } = useToast();
  const seasons: Season[] = Array.from(
    { length: numberOfSeasons }, 
    (_, i) => ({
      number: i + 1,
      watched: seasonsWatched.includes(i + 1)
    })
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

  if (numberOfSeasons === 0) return null;

  return (
    <div>
      <h3 className="text-2xl font-semibold mb-4">Track Seasons</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {seasons.map((season) => (
          <div 
            key={season.number} 
            className="flex items-center space-x-3 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
          >
            <Checkbox
              id={`season-${season.number}`}
              checked={season.watched}
              onCheckedChange={() => handleSeasonToggle(season.number)}
              className="h-5 w-5 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
            />
            <label
              htmlFor={`season-${season.number}`}
              className="text-base font-medium leading-none cursor-pointer select-none"
            >
              Season {season.number}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};