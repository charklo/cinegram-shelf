import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { MovieDetail } from "./MovieDetail";
import { useAuth } from "@/contexts/AuthContext";

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  vote_average: number;
  overview?: string;
  release_date?: string;
}

export const MovieCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(2);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const { user } = useAuth();

  const { data: trendingMovies, isLoading } = useQuery({
    queryKey: ["trendingMovies"],
    queryFn: async () => {
      try {
        const { data: { TMDB_API_KEY } } = await supabase.functions.invoke('get-tmdb-key');
        
        if (!TMDB_API_KEY) {
          toast({
            title: "Erreur de configuration",
            description: "La clé API TMDB n'est pas configurée correctement.",
            variant: "destructive",
          });
          return [];
        }

        const response = await fetch(
          `https://api.themoviedb.org/3/trending/movie/week?api_key=${TMDB_API_KEY}&language=fr-FR`
        );
        const data = await response.json();
        return data.results as Movie[];
      } catch (error) {
        console.error("Error fetching trending movies:", error);
        toast({
          title: "Erreur",
          description: "Impossible de récupérer les films tendances.",
          variant: "destructive",
        });
        return [];
      }
    },
  });

  const handleAddToWatchlist = async (movie: Movie) => {
    if (!user) {
      toast({
        title: "Error",
        description: "Please sign in to add movies to your watchlist",
        variant: "destructive"
      });
      return;
    }

    try {
      // First, check if the movie exists in our database
      const { data: existingMovie, error: movieError } = await supabase
        .from('movies')
        .select('id')
        .eq('imdb_id', movie.id.toString())
        .single();

      let movieId;

      if (!existingMovie) {
        // If movie doesn't exist, insert it
        const { data: newMovie, error: insertError } = await supabase
          .from('movies')
          .insert({
            title: movie.title,
            imdb_id: movie.id.toString(),
            poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
            release_date: movie.release_date,
            overview: movie.overview
          })
          .select('id')
          .single();

        if (insertError) throw insertError;
        movieId = newMovie.id;
      } else {
        movieId = existingMovie.id;
      }

      // Add to user's watched movies
      const { error: userMovieError } = await supabase
        .from('user_movies')
        .insert({
          user_id: user.id,
          movie_id: movieId
        });

      if (userMovieError) throw userMovieError;

      toast({
        title: "Success",
        description: "Movie added to your watchlist"
      });
    } catch (error) {
      console.error('Error adding movie to watchlist:', error);
      toast({
        title: "Error",
        description: "Failed to add movie to your watchlist",
        variant: "destructive"
      });
    }
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % (trendingMovies?.length || 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + (trendingMovies?.length || 1)) % (trendingMovies?.length || 1));
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const currentX = e.touches[0].clientX;
    const diff = startX - currentX;
    
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
      setIsDragging(false);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, []);

  if (isLoading || !trendingMovies) {
    return <div className="h-[400px] flex items-center justify-center">Chargement...</div>;
  }

  const getVisibleMovies = () => {
    const movies = [...trendingMovies];
    const visibleCount = isMobile ? 3 : 5;
    const offset = Math.floor(visibleCount / 2);
    const visibleIndexes = Array.from({ length: visibleCount }, (_, i) => i - offset)
      .map((offset) => (currentIndex + offset + movies.length) % movies.length);
    return visibleIndexes.map((index) => movies[index]);
  };

  return (
    <>
      <div 
        className="relative w-full h-[400px] overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="flex items-center justify-center h-full gap-2 md:gap-4">
          {getVisibleMovies().map((movie, index) => {
            const isCentered = index === (isMobile ? 1 : 2);
            const isAdjacent = isMobile ? 
              (index === 0 || index === 2) : 
              (index === 1 || index === 3);
            
            return (
              <div
                key={movie.id}
                className={`relative transition-all duration-500 ease-in-out cursor-pointer group ${
                  isCentered
                    ? "w-36 h-52 md:w-72 md:h-96 z-30 scale-110"
                    : isAdjacent
                    ? "w-28 h-40 md:w-56 md:h-80 z-20 opacity-80"
                    : "w-24 h-36 md:w-48 md:h-72 z-10 opacity-60"
                }`}
                onClick={() => setSelectedMovie(movie)}
              >
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  className="w-full h-full object-cover rounded-lg shadow-xl"
                />
                <Button
                  size="icon"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddToWatchlist(movie);
                  }}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            );
          })}
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 z-40"
          onClick={prevSlide}
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 z-40"
          onClick={nextSlide}
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>

      {selectedMovie && (
        <MovieDetail
          movieId={selectedMovie.id.toString()}
          onClose={() => setSelectedMovie(null)}
        />
      )}
    </>
  );
};