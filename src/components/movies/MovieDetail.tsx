import { MovieDetailContainer } from "./MovieDetailContainer";

interface MovieDetailProps {
  movieId: string;
  onClose: () => void;
}

export const MovieDetail = ({ movieId, onClose }: MovieDetailProps) => {
  return <MovieDetailContainer movieId={movieId} onClose={onClose} />;
};