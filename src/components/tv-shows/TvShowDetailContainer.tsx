import { useState } from "react";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { TvShowHeader } from "./TvShowHeader";
import { TvShowPoster } from "./TvShowPoster";
import { TvShowOverview } from "./TvShowOverview";
import { ReviewSection } from "../movies/ReviewSection";
import { useTvShowData } from "@/hooks/useTvShowData";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";

interface TvShowDetailContainerProps {
  tvShowId: string;
  onClose: () => void;
  onTvShowRemoved: (tvShowId: string) => void;
}

export const TvShowDetailContainer = ({ tvShowId, onClose, onTvShowRemoved }: TvShowDetailContainerProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { tvShow, reviews, loading, userRating } = useTvShowData(tvShowId, user);
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(0);

  const handleDelete = async () => {
    if (!user || !tvShow) return;

    try {
      const { error } = await supabase
        .from('user_tv_shows')
        .delete()
        .eq('tv_show_id', tvShow.id)
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "TV show removed from your watchlist"
      });
      
      onTvShowRemoved(tvShowId);
    } catch (error) {
      console.error('Error removing TV show:', error);
      toast({
        title: "Error",
        description: "Failed to remove TV show from your watchlist",
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
    
    if (!tvShow) {
      toast({
        title: "Error",
        description: "TV show data not available",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('tv_show_reviews')
        .insert({
          tv_show_id: tvShow.id,
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
            <p className="text-lg">Loading TV show details...</p>
          </div>
        ) : !tvShow ? (
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-3xl font-bold mb-2">TV show not found</h2>
            <button onClick={onClose} className="text-2xl">&times;</button>
          </div>
        ) : (
          <>
            <TvShowHeader
              title={tvShow.title}
              firstAirDate={tvShow.first_air_date}
              duration={tvShow.duration}
              userRating={userRating}
              averageRating={reviews.length > 0
                ? reviews.reduce((acc, review) => acc + (review.rating || 0), 0) / reviews.length
                : 0}
              tmdbRating={tvShow.tmdb_rating}
              onClose={onClose}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-1">
                <TvShowPoster
                  posterUrl={tvShow.poster_url}
                  title={tvShow.title}
                  creator={tvShow.creator}
                  isCompleted={tvShow.status?.toLowerCase() === 'ended'}
                />
              </div>

              <div className="md:col-span-2 space-y-8">
                <TvShowOverview
                  overview={tvShow.overview}
                  cast={tvShow.show_cast}
                  numberOfSeasons={tvShow.number_of_seasons}
                  numberOfEpisodes={tvShow.number_of_episodes}
                  status={tvShow.status}
                  network={tvShow.network}
                  userId={user?.id}
                  tvShowId={tvShow.id}
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