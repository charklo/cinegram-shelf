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
import { LayoutGrid, List } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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

  // Show loading state while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  // Redirect to auth if not logged in
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
          <div className="flex gap-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="icon"
              onClick={() => setViewMode('grid')}
              className="w-10 h-10"
            >
              <LayoutGrid className="h-5 w-5" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="icon"
              onClick={() => setViewMode('list')}
              className="w-10 h-10"
            >
              <List className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {loadingMovies ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-lg">Loading your movies...</div>
          </div>
        ) : viewMode === 'grid' ? (
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
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Poster</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Release Date</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead className="max-w-[300px]">Synopsis</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {watchedMovies.map((userMovie) => (
                <TableRow
                  key={userMovie.movie_id}
                  className="cursor-pointer hover:bg-accent"
                  onClick={() => setSelectedMovieId(userMovie.movie_id)}
                >
                  <TableCell>
                    <img
                      src={userMovie.movies.poster_url || "https://images.unsplash.com/photo-1485827404703-89b55fcc595e"}
                      alt={userMovie.movies.title}
                      className="w-[60px] h-[90px] rounded-sm object-cover"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{userMovie.movies.title}</TableCell>
                  <TableCell>{userMovie.movies.imdb_rating || 'N/A'}</TableCell>
                  <TableCell>
                    {userMovie.movies.release_date
                      ? new Date(userMovie.movies.release_date).toLocaleDateString()
                      : 'N/A'}
                  </TableCell>
                  <TableCell>
                    {userMovie.movies.duration
                      ? `${userMovie.movies.duration} min`
                      : 'N/A'}
                  </TableCell>
                  <TableCell className="max-w-[300px]">
                    <p className="line-clamp-2 text-sm text-muted-foreground">
                      {userMovie.movies.overview || 'No synopsis available'}
                    </p>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
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