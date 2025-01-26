import { useState } from "react";
import { Star, ThumbsUp, ThumbsDown, Play } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface MovieDetailProps {
  movieId: string;
  onClose: () => void;
}

export const MovieDetail = ({ movieId, onClose }: MovieDetailProps) => {
  const { user } = useAuth();
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(0);

  const handleSubmitReview = async () => {
    if (!user) return;
    
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
      
      // Clear form
      setReview("");
      setRating(0);
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-background p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-3xl font-bold mb-2">Movie Title</h2>
            <div className="flex items-center gap-4 text-muted-foreground">
              <span>2024</span>
              <span>2h 35m</span>
              <div className="flex items-center">
                <Star className="w-5 h-5 text-yellow-400 mr-1" />
                <span>8.5</span>
              </div>
            </div>
          </div>
          <Button variant="ghost" onClick={onClose}>×</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <img
              src="https://images.unsplash.com/photo-1485827404703-89b55fcc595e"
              alt="Movie poster"
              className="w-full rounded-lg"
            />
            <div className="mt-4 flex gap-2">
              <Button className="flex-1">
                <Play className="mr-2" />
                Watch Trailer
              </Button>
            </div>
          </div>

          <div className="md:col-span-2 space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-2">Overview</h3>
              <p className="text-muted-foreground">
                Movie description goes here...
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Reviews</h3>
              {user ? (
                <div className="space-y-4">
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-6 h-6 cursor-pointer ${
                          star <= rating ? "text-yellow-400" : "text-gray-400"
                        }`}
                        onClick={() => setRating(star)}
                      />
                    ))}
                  </div>
                  <Input
                    placeholder="Write your review..."
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                  />
                  <Button onClick={handleSubmitReview}>Submit Review</Button>
                </div>
              ) : (
                <p className="text-muted-foreground">
                  Please sign in to leave a review.
                </p>
              )}

              <div className="mt-6 space-y-4">
                <Card className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center mb-2">
                        <Star className="w-4 h-4 text-yellow-400 mr-1" />
                        <span className="font-medium">4.5</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Great movie! Highly recommended.
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon">
                        <ThumbsUp className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <ThumbsDown className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};