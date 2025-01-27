import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { MovieCarousel } from "@/components/movies/MovieCarousel";
import { MovieDetail } from "@/components/movies/MovieDetail";
import { TvShowDetail } from "@/components/tv-shows/TvShowDetail";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { AddMovieButton } from "@/components/movies/AddMovieButton";
import { MovieGridView } from "@/components/movies/MovieGridView";
import { MovieListView } from "@/components/movies/MovieListView";
import { ViewToggle } from "@/components/movies/ViewToggle";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Navigation } from "@/components/layout/Navigation";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const Index = () => {
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [selectedMovieId, setSelectedMovieId] = useState<string | null>(null);
  const [selectedTvShowId, setSelectedTvShowId] = useState<string | null>(null);
  const [watchedMovies, setWatchedMovies] = useState<any[]>([]);
  const [watchedTvShows, setWatchedTvShows] = useState<any[]>([]);
  const [filteredMovies, setFilteredMovies] = useState<any[]>([]);
  const [filteredTvShows, setFilteredTvShows] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loadingMovies, setLoadingMovies] = useState(true);
  const [loadingTvShows, setLoadingTvShows] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    const fetchWatchedContent = async () => {
      if (!user) return;

      try {
        // Fetch movies
        const { data: movieData, error: movieError } = await supabase
          .from('user_movies')
          .select(`
            *,
            movies (*)
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (movieError) throw movieError;
        setWatchedMovies(movieData || []);
        setFilteredMovies(movieData || []);

        // Fetch TV shows
        const { data: tvShowData, error: tvShowError } = await supabase
          .from('user_tv_shows')
          .select(`
            *,
            tv_shows (*)
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (tvShowError) throw tvShowError;
        setWatchedTvShows(tvShowData || []);
        setFilteredTvShows(tvShowData || []);
      } catch (error) {
        console.error('Error fetching watched content:', error);
        toast({
          title: "Error",
          description: "Failed to load your content",
          variant: "destructive"
        });
      } finally {
        setLoadingMovies(false);
        setLoadingTvShows(false);
      }
    };

    if (user) {
      fetchWatchedContent();
    }
  }, [user, toast]);

  useEffect(() => {
    const filtered = watchedMovies.filter(movie => 
      movie.movies.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredMovies(filtered);

    const filteredShows = watchedTvShows.filter(show => 
      show.tv_shows.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredTvShows(filteredShows);
  }, [searchQuery, watchedMovies, watchedTvShows]);

  const handleMovieAdded = (newUserMovie: any) => {
    setWatchedMovies(prev => [newUserMovie, ...prev]);
  };

  const handleTvShowAdded = (newUserTvShow: any) => {
    setWatchedTvShows(prev => [newUserTvShow, ...prev]);
  };

  const handleMovieRemoved = (movieId: string) => {
    setWatchedMovies(prev => prev.filter(movie => movie.movies.imdb_id !== movieId));
    setFilteredMovies(prev => prev.filter(movie => movie.movies.imdb_id !== movieId));
    setSelectedMovieId(null);
  };

  const handleTvShowRemoved = (tvShowId: string) => {
    setWatchedTvShows(prev => prev.filter(show => show.tv_shows.tmdb_id !== tvShowId));
    setFilteredTvShows(prev => prev.filter(show => show.tv_shows.tmdb_id !== tvShowId));
    setSelectedTvShowId(null);
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
            <h2 className="text-2xl font-bold">Your Watchlist</h2>
            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="relative flex-1 md:flex-initial">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-full md:w-[200px]"
                />
              </div>
              <ViewToggle viewMode={viewMode} onViewChange={setViewMode} />
            </div>
          </div>

          <Tabs defaultValue="movies" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="movies">Movies</TabsTrigger>
              <TabsTrigger value="tvshows">TV Shows</TabsTrigger>
            </TabsList>
            
            <TabsContent value="movies">
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
            </TabsContent>
            
            <TabsContent value="tvshows">
              {viewMode === 'grid' ? (
                <MovieGridView
                  movies={filteredTvShows.map(show => ({
                    ...show,
                    movies: {
                      ...show.tv_shows,
                      imdb_id: show.tv_shows.tmdb_id,
                      imdb_rating: show.tv_shows.tmdb_rating
                    }
                  }))}
                  onMovieClick={setSelectedTvShowId}
                  isLoading={loadingTvShows}
                />
              ) : (
                <MovieListView
                  movies={filteredTvShows.map(show => ({
                    ...show,
                    movies: {
                      ...show.tv_shows,
                      imdb_id: show.tv_shows.tmdb_id,
                      imdb_rating: show.tv_shows.tmdb_rating
                    }
                  }))}
                  onMovieClick={setSelectedTvShowId}
                  isLoading={loadingTvShows}
                />
              )}
            </TabsContent>
          </Tabs>
        </section>

        {selectedMovieId && (
          <MovieDetail
            movieId={selectedMovieId}
            onClose={() => setSelectedMovieId(null)}
            onMovieRemoved={handleMovieRemoved}
          />
        )}

        {selectedTvShowId && (
          <TvShowDetail
            tvShowId={selectedTvShowId}
            onClose={() => setSelectedTvShowId(null)}
            onTvShowRemoved={handleTvShowRemoved}
          />
        )}

        <AddMovieButton 
          onMovieAdded={handleMovieAdded}
          onTvShowAdded={handleTvShowAdded}
        />
      </div>
    </>
  );
};

export default Index;