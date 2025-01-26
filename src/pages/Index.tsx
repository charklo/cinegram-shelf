import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { MovieCarousel } from "@/components/movies/MovieCarousel";
import { MovieDetail } from "@/components/movies/MovieDetail";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { AddMovieButton } from "@/components/movies/AddMovieButton";
import { MovieGridView } from "@/components/movies/MovieGridView";
import { MovieListView } from "@/components/movies/MovieListView";
import { ViewToggle } from "@/components/movies/ViewToggle";

const Index = () => {
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [selectedMovieId, setSelectedMovieId] = useState<string | null>(null);
  const [watchedMovies, setWatchedMovies] = useState<any[]>([]);
  const [loadingMovies, setLoadingMovies] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

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

    if (user) {
      fetchWatchedMovies();
    }
  }, [user, toast]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const handleMovieAdded = (newUserMovie: any) => {
    setWatchedMovies(prev => [...prev, newUserMovie]);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
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
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Your Watched Movies</h2>
          <ViewToggle viewMode={viewMode} onViewChange={setViewMode} />
        </div>

        {viewMode === 'grid' ? (
          <MovieGridView
            movies={watchedMovies}
            onMovieClick={setSelectedMovieId}
            isLoading={loadingMovies}
          />
        ) : (
          <MovieListView
            movies={watchedMovies}
            onMovieClick={setSelectedMovieId}
            isLoading={loadingMovies}
          />
        )}
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