import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { MovieCarousel } from "@/components/movies/MovieCarousel";
import { MovieDetail } from "@/components/movies/MovieDetail";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { AddMovieButton } from "@/components/movies/AddMovieButton";
import { MovieGridView } from "@/components/movies/MovieGridView";
import { MovieListView } from "@/components/movies/MovieListView";
import { ViewToggle } from "@/components/movies/ViewToggle";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Navigation } from "@/components/layout/Navigation";

const Index = () => {
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [selectedMovieId, setSelectedMovieId] = useState<string | null>(null);
  const [watchedMovies, setWatchedMovies] = useState<any[]>([]);
  const [filteredMovies, setFilteredMovies] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
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
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setWatchedMovies(data || []);
        setFilteredMovies(data || []);
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

  useEffect(() => {
    const filtered = watchedMovies.filter(movie => 
      movie.movies.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredMovies(filtered);
  }, [searchQuery, watchedMovies]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const handleMovieAdded = (newUserMovie: any) => {
    setWatchedMovies(prev => [newUserMovie, ...prev]);
  };

  const handleMovieRemoved = (movieId: string) => {
    setWatchedMovies(prev => prev.filter(movie => movie.movies.imdb_id !== movieId));
    setFilteredMovies(prev => prev.filter(movie => movie.movies.imdb_id !== movieId));
    setSelectedMovieId(null);
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
    <>
      <Navigation />
      <div className="min-h-screen pt-16 p-4 space-y-8">
        <MovieCarousel />
        
        <section>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
            <h2 className="text-2xl font-bold">Your Watched Movies</h2>
            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="relative flex-1 md:flex-initial">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search movies..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-full md:w-[200px]"
                />
              </div>
              <ViewToggle viewMode={viewMode} onViewChange={setViewMode} />
            </div>
          </div>

          {viewMode === 'grid' ? (
            <MovieGridView
              movies={filteredMovies}
              onMovieClick={setSelectedMovieId}
              isLoading={loadingMovies}
            />
          ) : (
            <MovieListView
              movies={filteredMovies}
              onMovieClick={setSelectedMovieId}
              isLoading={loadingMovies}
            />
          )}
        </section>

        {selectedMovieId && (
          <MovieDetail
            movieId={selectedMovieId}
            onClose={() => setSelectedMovieId(null)}
            onMovieRemoved={handleMovieRemoved}
          />
        )}

        <AddMovieButton onMovieAdded={handleMovieAdded} />
      </div>
    </>
  );
};

export default Index;
