import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { MovieCarousel } from "@/components/movies/MovieCarousel";
import { MovieCard } from "@/components/movies/MovieCard";
import { MovieDetail } from "@/components/movies/MovieDetail";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

const MOCK_WATCHED_MOVIES = [
  {
    id: "1",
    title: "Inception",
    posterUrl: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e",
    rating: 8.8,
  },
  {
    id: "2",
    title: "The Dark Knight",
    posterUrl: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7",
    rating: 9.0,
  },
  {
    id: "3",
    title: "Pulp Fiction",
    posterUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5",
    rating: 8.9,
  },
];

const Index = () => {
  const { user, loading } = useAuth();
  const [selectedMovieId, setSelectedMovieId] = useState<string | null>(null);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

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
          {MOCK_WATCHED_MOVIES.map((movie) => (
            <MovieCard
              key={movie.id}
              title={movie.title}
              posterUrl={movie.posterUrl}
              rating={movie.rating}
              onClick={() => setSelectedMovieId(movie.id)}
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
    </div>
  );
};

export default Index;