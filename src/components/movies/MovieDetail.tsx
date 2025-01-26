import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { MovieHeader } from "./MovieHeader";
import { MoviePoster } from "./MoviePoster";
import { MovieOverview } from "./MovieOverview";
import { ReviewSection } from "./ReviewSection";

interface MovieDetailProps {
  movieId: string;
  onClose: () => void;
}

export const MovieDetail = ({ movieId, onClose }: MovieDetailProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [movie, setMovie] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(0);
  const [userRating, setUserRating] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovieAndReviews = async () => {
      try {
        const { data: movieData, error: movieError } = await supabase
          .from('movies')
          .select('*')
          .eq('id', movieId)
          .maybeSingle();

        if (movieError) throw movieError;
        if (movieData) setMovie(movieData);

        if (user) {
          const { data: userMovieData } = await supabase
            .from('user_movies')
            .select('user_rating')
            .eq('movie_id', movieId)
            .eq('user_id', user.id)
            .maybeSingle();

          if (userMovieData) {
            setUserRating(userMovieData.user_rating);
          }
        }

        const { data: reviewsData, error: reviewsError } = await supabase
          .from('movie_reviews')
          .select(`
            *,
            profiles (*)
          `)
          .eq('movie_id', movieId)
          .order('created_at', { ascending: false });

        if (reviewsError) throw reviewsError;
        setReviews(reviewsData || []);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: "Error",
          description: "Failed to load movie details",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMovieAndReviews();
  }, [movieId, user, toast]);

  const handleSubmitReview = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "Please sign in to leave a review",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const { error } = await supabase
        .from('movie_reviews')
        .insert({
          movie_id: movieId,
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

      const { data: newReviews, error: reviewsError } = await supabase
        .from('movie_reviews')
        .select(`
          *,
          profiles (*)
        `)
        .eq('movie_id', movieId)
        .order('created_at', { ascending: false });

      if (reviewsError) throw reviewsError;
      setReviews(newReviews || []);
    } catch (error) {
      console.error('Error submitting review:', error);
      toast({
        title: "Error",
        description: "Failed to submit review",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-background p-6">
          <div className="flex justify-center items-center h-40">
            Loading...
          </div>
        </Card>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-background p-6">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-3xl font-bold mb-2">Movie not found</h2>
            <button onClick={onClose}>×</button>
          </div>
        </Card>
      </div>
    );
  }

  const averageRating = reviews.length > 0
    ? reviews.reduce((acc, review) => acc + (review.rating || 0), 0) / reviews.length
    : 0;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-6xl max-h-[90vh] overflow-y-auto bg-background p-6">
        <MovieHeader
          title={movie.title}
          releaseYear={new Date(movie.release_date).getFullYear().toString()}
          duration={movie.duration}
          userRating={userRating}
          averageRating={averageRating}
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
          </div>
        </div>
      </Card>
    </div>
  );
};