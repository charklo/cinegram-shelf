import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  vote_average: number;
}

export const MovieCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(2);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const isMobile = useIsMobile();
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
              className={`transition-all duration-500 ease-in-out ${
                isCentered
                  ? "w-36 h-52 md:w-72 md:h-96 z-30 scale-110"
                  : isAdjacent
                  ? "w-28 h-40 md:w-56 md:h-80 z-20 opacity-80"
                  : "w-24 h-36 md:w-48 md:h-72 z-10 opacity-60"
              }`}
            >
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                className="w-full h-full object-cover rounded-lg shadow-xl"
              />
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
  );
};