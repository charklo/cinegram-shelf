import { useState } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SheetClose } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

interface MovieResult {
  id: number;
  title: string;
  release_date: string;
  poster_path: string;
}

interface MovieSearchProps {
  onMovieAdded?: (newUserMovie: any) => void;
}

export const MovieSearch = ({ onMovieAdded }: MovieSearchProps) => {
  const [search, setSearch] = useState("");
  const { toast } = useToast();

  const { data: results, isLoading } = useQuery({
    queryKey: ["movieSearch", search],
    queryFn: async () => {
      if (!search) return [];
      
      try {
        const { data: { TMDB_API_KEY } } = await supabase.functions.invoke('get-tmdb-key');
        console.log("API Key status:", TMDB_API_KEY ? "Present" : "Missing");
        
        if (!TMDB_API_KEY) {
          console.error("TMDB API Key is not configured. Please check your environment variables.");
          toast({
            title: "Erreur de configuration",
            description: "La clé API TMDB n'est pas configurée correctement. Veuillez vérifier la configuration.",
            variant: "destructive",
          });
          return [];
        }

        const url = `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(
          search
        )}&language=fr-FR`;
        
        console.log("Making API request for search term:", search);
        const response = await fetch(url);
        const data = await response.json();
        
        if (!response.ok) {
          console.error("TMDB API Error:", data);
          throw new Error(data.status_message || "Erreur lors de la recherche");
        }

        console.log(`Found ${data.results?.length || 0} results for "${search}"`);
        return data.results as MovieResult[];
      } catch (error) {
        console.error("Search error:", error);
        toast({
          title: "Erreur",
          description: error instanceof Error ? error.message : "Impossible de rechercher des films. Vérifiez votre connexion.",
          variant: "destructive",
        });
        return [];
      }
    },
    enabled: search.length > 2,
  });

  const handleAddMovie = async (movie: MovieResult) => {
    try {
      // First, check if movie already exists in our database
      const { data: existingMovie } = await supabase
        .from("movies")
        .select("id")
        .eq("imdb_id", movie.id.toString())
        .maybeSingle();

      let movieId;

      if (existingMovie) {
        movieId = existingMovie.id;
      } else {
        // Add movie to our database
        const { data: newMovie, error: movieError } = await supabase
          .from("movies")
          .insert({
            title: movie.title,
            imdb_id: movie.id.toString(),
            poster_url: movie.poster_path
              ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
              : null,
            release_date: movie.release_date,
          })
          .select()
          .single();

        if (movieError) throw movieError;
        movieId = newMovie.id;
      }

      // Add to user's watched movies
      const { data: newUserMovie, error: userMovieError } = await supabase
        .from("user_movies")
        .insert({
          user_id: (await supabase.auth.getUser()).data.user?.id,
          movie_id: movieId,
        })
        .select(`
          *,
          movies (*)
        `)
        .single();

      if (userMovieError) throw userMovieError;

      // Call the callback with the new user movie
      if (onMovieAdded && newUserMovie) {
        onMovieAdded(newUserMovie);
      }

      toast({
        title: "Succès",
        description: "Film ajouté à votre liste !",
      });
    } catch (error) {
      console.error("Error adding movie:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter le film. Veuillez réessayer.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Recherchez un film..."
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

      {isLoading && <p className="text-center">Recherche en cours...</p>}

      {!isLoading && results?.length === 0 && search.length > 2 && (
        <p className="text-center text-muted-foreground">
          Aucun film trouvé. Essayez un autre titre.
        </p>
      )}

      <div className="space-y-2">
        {results?.map((movie) => (
          <div
            key={movie.id}
            className="flex items-center gap-4 rounded-lg border p-2"
          >
            {movie.poster_path ? (
              <img
                src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
                alt={movie.title}
                className="h-16 w-12 rounded object-cover"
              />
            ) : (
              <div className="h-16 w-12 rounded bg-muted" />
            )}
            <div className="flex-1">
              <h3 className="font-semibold">{movie.title}</h3>
              <p className="text-sm text-muted-foreground">
                {movie.release_date?.split("-")[0] || "Date inconnue"}
              </p>
            </div>
            <SheetClose asChild>
              <Button onClick={() => handleAddMovie(movie)}>Ajouter</Button>
            </SheetClose>
          </div>
        ))}
      </div>
    </div>
  );
};