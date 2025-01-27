import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { MovieHeader } from "./MovieHeader";
import { MoviePoster } from "./MoviePoster";
import { MovieOverview } from "./MovieOverview";
import { ReviewSection } from "./ReviewSection";
import { useMovieData } from "@/hooks/useMovieData";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";

interface MovieDetailContainerProps {
  movieId: string;
  onClose: () => void;
  onMovieRemoved: (movieId: string) => void;
}

export const MovieDetailContainer = ({ movieId, onClose, onMovieRemoved }: MovieDetailContainerProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { movie, reviews, loading, userRating } = useMovieData(movieId, user);
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(0);

  const handleDelete = async () => {
    if (!user || !movie) return;

    try {
      const { error } = await supabase
        .from('user_movies')
        .delete()
        .eq('movie_id', movie.id)
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Movie removed from your watchlist"
      });
      
      onMovieRemoved(movieId);
    } catch (error) {
      console.error('Error removing movie:', error);
      toast({
        title: "Error",
        description: "Failed to remove movie from your watchlist",
        variant: "destructive"
      });
    }
  };

  const handleSubmitReview = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "Please sign in to leave a review",
        variant: "destructive"
      });
      return;
    }
    
    if (!movie) {
      toast({
        title: "Error",
        description: "Movie data not available",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('movie_reviews')
        .insert({
          movie_id: movie.id,
          user_id: user.id,
          rating,
          comment: review
        });

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Review submitted successfully"
      });

      setReview("");
      setRating(0);

      // Refresh reviews
      const { data: newReviews, error: reviewsError } = await supabase
        .from('movie_reviews')
        .select(`
          *,
          profiles (*)
        `)
        .eq('movie_id', movie.id)
        .order('created_at', { ascending: false });

      if (reviewsError) throw reviewsError;
    } catch (error) {
      console.error('Error submitting review:', error);
      toast({
        title: "Error",
        description: "Failed to submit review",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-6xl max-h-[90vh] overflow-y-auto bg-background p-6">
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <p className="text-lg">Loading movie details...</p>
          </div>
        ) : !movie ? (
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-3xl font-bold mb-2">Movie not found</h2>
            <button onClick={onClose} className="text-2xl">&times;</button>
          </div>
        ) : (
          <>
            <MovieHeader
              title={movie.title}
              releaseYear={new Date(movie.release_date).getFullYear().toString()}
              duration={movie.duration}
              userRating={userRating}
              averageRating={reviews.length > 0
                ? reviews.reduce((acc, review) => acc + (review.rating || 0), 0) / reviews.length
                : 0}
              imdbRating={movie.imdb_rating}
              onClose={onClose}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-1">
                <MoviePoster
                  posterUrl={movie.poster_url}
                  title={movie.title}
                  director={movie.director}
                />
              </div>

              <div className="md:col-span-2 space-y-8">
                <MovieOverview
                  overview={movie.overview}
                  cast={movie.movie_cast}
                />

                <ReviewSection
                  user={user}
                  rating={rating}
                  setRating={setRating}
                  review={review}
                  setReview={setReview}
                  reviews={reviews}
                  onSubmitReview={handleSubmitReview}
                />

                {user && (
                  <Button
                    variant="destructive"
                    onClick={handleDelete}
                    className="w-full flex items-center justify-center gap-2"
                  >
                    <Trash className="h-4 w-4" />
                    Remove from Watchlist
                  </Button>
                )}
              </div>
            </div>
          </>
        )}
      </Card>
    </div>
  );
};