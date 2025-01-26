import { MovieCard } from "./MovieCard";

interface MovieGridViewProps {
  movies: any[];
  onMovieClick: (movieId: string) => void;
  isLoading: boolean;
}

export const MovieGridView = ({ movies, onMovieClick, isLoading }: MovieGridViewProps) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-lg">Loading your movies...</div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {movies.map((userMovie) => (
        <MovieCard
          key={userMovie.movie_id}
          title={userMovie.movies.title}
          posterUrl={userMovie.movies.poster_url || "https://images.unsplash.com/photo-1485827404703-89b55fcc595e"}
          rating={userMovie.movies.imdb_rating || 0}
          onClick={() => onMovieClick(userMovie.movie_id)}
        />
      ))}
    </div>
  );
};