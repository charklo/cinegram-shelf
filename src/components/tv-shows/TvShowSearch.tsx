import { useState } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SheetClose } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

interface TvShowResult {
  id: number;
  name: string;
  first_air_date: string;
  poster_path: string;
}

interface TvShowSearchProps {
  onTvShowAdded?: (newUserTvShow: any) => void;
}

export const TvShowSearch = ({ onTvShowAdded }: TvShowSearchProps) => {
  const [search, setSearch] = useState("");
  const { toast } = useToast();

  const { data: results, isLoading } = useQuery({
    queryKey: ["tvShowSearch", search],
    queryFn: async () => {
      if (!search) return [];
      
      try {
        const { data: { TMDB_API_KEY } } = await supabase.functions.invoke('get-tmdb-key');
        console.log("API Key status:", TMDB_API_KEY ? "Present" : "Missing");
        
        if (!TMDB_API_KEY) {
          console.error("TMDB API Key is not configured");
          toast({
            title: "Error",
            description: "The API key is not configured correctly",
            variant: "destructive",
          });
          return [];
        }

        const url = `https://api.themoviedb.org/3/search/tv?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(
          search
        )}&language=fr-FR`;
        
        console.log("Making TV show API request for search term:", search);
        const response = await fetch(url);
        const data = await response.json();
        
        if (!response.ok) {
          console.error("TMDB API Error:", data);
          throw new Error(data.status_message || "Error searching for TV shows");
        }

        console.log(`Found ${data.results?.length || 0} TV show results for "${search}"`);
        return data.results as TvShowResult[];
      } catch (error) {
        console.error("Search error:", error);
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Unable to search for TV shows. Check your connection.",
          variant: "destructive",
        });
        return [];
      }
    },
    enabled: search.length > 2,
  });

  const handleAddTvShow = async (tvShow: TvShowResult) => {
    try {
      // First, check if TV show already exists in our database
      const { data: existingTvShow } = await supabase
        .from("tv_shows")
        .select("id")
        .eq("tmdb_id", tvShow.id.toString())
        .maybeSingle();

      let tvShowId;

      if (existingTvShow) {
        tvShowId = existingTvShow.id;
      } else {
        // Add TV show to our database
        const { data: newTvShow, error: tvShowError } = await supabase
          .from("tv_shows")
          .insert({
            title: tvShow.name,
            tmdb_id: tvShow.id.toString(),
            poster_url: tvShow.poster_path
              ? `https://image.tmdb.org/t/p/w500${tvShow.poster_path}`
              : null,
            first_air_date: tvShow.first_air_date,
          })
          .select()
          .single();

        if (tvShowError) throw tvShowError;
        tvShowId = newTvShow.id;
      }

      // Add to user's watched TV shows
      const { data: newUserTvShow, error: userTvShowError } = await supabase
        .from("user_tv_shows")
        .insert({
          user_id: (await supabase.auth.getUser()).data.user?.id,
          tv_show_id: tvShowId,
        })
        .select(`
          *,
          tv_shows (*)
        `)
        .single();

      if (userTvShowError) throw userTvShowError;

      if (onTvShowAdded && newUserTvShow) {
        onTvShowAdded(newUserTvShow);
      }

      toast({
        title: "Success",
        description: "TV show added to your list!",
      });
    } catch (error) {
      console.error("Error adding TV show:", error);
      toast({
        title: "Error",
        description: "Unable to add the TV show. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search for a TV show..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {isLoading && <p className="text-center">Searching...</p>}

      {!isLoading && results?.length === 0 && search.length > 2 && (
        <p className="text-center text-muted-foreground">
          No TV shows found. Try another title.
        </p>
      )}

      <div className="space-y-2">
        {results?.map((tvShow) => (
          <div
            key={tvShow.id}
            className="flex items-center gap-4 rounded-lg border p-2"
          >
            {tvShow.poster_path ? (
              <img
                src={`https://image.tmdb.org/t/p/w92${tvShow.poster_path}`}
                alt={tvShow.name}
                className="h-16 w-12 rounded object-cover"
              />
            ) : (
              <div className="h-16 w-12 rounded bg-muted" />
            )}
            <div className="flex-1">
              <h3 className="font-semibold">{tvShow.name}</h3>
              <p className="text-sm text-muted-foreground">
                {tvShow.first_air_date?.split("-")[0] || "Unknown date"}
              </p>
            </div>
            <SheetClose asChild>
              <Button onClick={() => handleAddTvShow(tvShow)}>Add</Button>
            </SheetClose>
          </div>
        ))}
      </div>
    </div>
  );
};