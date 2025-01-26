import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { MovieCarousel } from "@/components/movies/MovieCarousel";
import { MovieCard } from "@/components/movies/MovieCard";
import { MovieDetail } from "@/components/movies/MovieDetail";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { AddMovieButton } from "@/components/movies/AddMovieButton";

const Index = () => {
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const [selectedMovieId, setSelectedMovieId] = useState<string | null>(null);
  const [watchedMovies, setWatchedMovies] = useState<any[]>([]);
  const [loadingMovies, setLoadingMovies] = useState(true);

  useEffect(() => {
    const fetchWatchedMovies = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('user_movies')
          .select(`
            *,
            movies (*)
          `)
          .eq('user_id', user.id);

        if (error) throw error;
        setWatchedMovies(data || []);
      } catch (error) {
        console.error('Error fetching watched movies:', error);
        toast({
          title: "Error",
          description: "Failed to load your watched movies",
          variant: "destructive"
        });
      } finally {
        setLoadingMovies(false);
      }
    };

    fetchWatchedMovies();
  }, [user, toast]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const handleMovieAdded = (newUserMovie: any) => {
    setWatchedMovies(prev => [...prev, newUserMovie]);
  };

  if (loading || loadingMovies) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen p-4 space-y-8">
      <div className="flex justify-end">
        <Button onClick={handleSignOut} variant="ghost">
          Sign Out
        </Button>
      </div>
      
      <MovieCarousel />
      
      <section>
        <h2 className="text-2xl font-bold mb-4">Your Watched Movies</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {watchedMovies.map((userMovie) => (
            <MovieCard
              key={userMovie.movie_id}
              title={userMovie.movies.title}
              posterUrl={userMovie.movies.poster_url || "https://images.unsplash.com/photo-1485827404703-89b55fcc595e"}
              rating={userMovie.movies.imdb_rating || 0}
              onClick={() => setSelectedMovieId(userMovie.movie_id)}
            />
          ))}
        </div>
      </section>

      {selectedMovieId && (
        <MovieDetail
          movieId={selectedMovieId}
          onClose={() => setSelectedMovieId(null)}
        />
      )}

      <AddMovieButton onMovieAdded={handleMovieAdded} />
    </div>
  );
};

export default Index;