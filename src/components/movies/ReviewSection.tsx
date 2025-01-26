import { Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ReviewSectionProps {
  user: any;
  rating: number;
  setRating: (rating: number) => void;
  review: string;
  setReview: (review: string) => void;
  reviews: any[];
  onSubmitReview: () => void;
}

export const ReviewSection = ({
  user,
  rating,
  setRating,
  review,
  setReview,
  reviews,
  onSubmitReview,
}: ReviewSectionProps) => {
  return (
    <div>
      <h3 className="text-2xl font-semibold mb-4">Community Reviews</h3>
      {user ? (
        <div className="space-y-4 mb-6">
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-6 h-6 cursor-pointer transition-colors ${
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
          <Button onClick={onSubmitReview}>Submit Review</Button>
        </div>
      ) : (
        <p className="text-muted-foreground mb-6">
          Please sign in to leave a review.
        </p>
      )}

      <div className="space-y-4">
        {reviews.map((review) => (
          <Card key={review.id} className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center mb-2">
                  <Star className="w-4 h-4 text-yellow-400 mr-1" />
                  <span className="font-medium">{review.rating}</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {review.comment}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};