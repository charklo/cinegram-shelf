import { MovieDetailContainer } from "./MovieDetailContainer";

interface MovieDetailProps {
  movieId: string;
  onClose: () => void;
  onMovieRemoved: (movieId: string) => void;
}

export const MovieDetail = ({ movieId, onClose, onMovieRemoved }: MovieDetailProps) => {
  return <MovieDetailContainer movieId={movieId} onClose={onClose} onMovieRemoved={onMovieRemoved} />;
};