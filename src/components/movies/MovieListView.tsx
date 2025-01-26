import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface MovieListViewProps {
  movies: any[];
  onMovieClick: (movieId: string) => void;
  isLoading: boolean;
}

export const MovieListView = ({ movies, onMovieClick, isLoading }: MovieListViewProps) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-lg">Loading your movies...</div>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Poster</TableHead>
          <TableHead>Title</TableHead>
          <TableHead>Rating</TableHead>
          <TableHead>Your Rating</TableHead>
          <TableHead>Release Date</TableHead>
          <TableHead>Duration</TableHead>
          <TableHead className="max-w-[300px]">Your Review</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {movies.map((userMovie) => (
          <TableRow
            key={userMovie.movie_id}
            className="cursor-pointer hover:bg-accent"
            onClick={() => onMovieClick(userMovie.movies.imdb_id)}
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
            <TableCell>{userMovie.user_rating || 'N/A'}</TableCell>
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
                {userMovie.comment || 'No review yet'}
              </p>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};