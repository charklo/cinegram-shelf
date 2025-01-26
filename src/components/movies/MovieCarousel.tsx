import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  vote_average: number;
}

export const MovieCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(2);
  const { toast } = useToast();

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

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % (trendingMovies?.length || 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + (trendingMovies?.length || 1)) % (trendingMovies?.length || 1));
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
    const visibleIndexes = [-2, -1, 0, 1, 2].map(
      (offset) => (currentIndex + offset + movies.length) % movies.length
    );
    return visibleIndexes.map((index) => movies[index]);
  };

  return (
    <div className="relative w-full h-[400px] overflow-hidden">
      <div className="flex items-center justify-center h-full gap-4">
        {getVisibleMovies().map((movie, index) => (
          <div
            key={movie.id}
            className={`transition-all duration-500 ease-in-out ${
              index === 2
                ? "w-72 h-96 z-30 scale-110"
                : index === 1 || index === 3
                ? "w-56 h-80 z-20 opacity-80"
                : "w-48 h-72 z-10 opacity-60"
            }`}
          >
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              className="w-full h-full object-cover rounded-lg shadow-xl"
            />
          </div>
        ))}
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
  );
};