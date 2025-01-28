import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { User } from "@supabase/supabase-js";

export const useTvShowData = (tvShowId: string, user: User | null) => {
  const { toast } = useToast();
  const [tvShow, setTvShow] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [userRating, setUserRating] = useState<number | null>(null);
  const [seasonsWatched, setSeasonsWatched] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTvShowAndReviews = async () => {
      try {
        // First, get the TV show data from Supabase using tmdb_id
        const { data: tvShowData, error: tvShowError } = await supabase
          .from('tv_shows')
          .select('*')
          .eq('tmdb_id', tvShowId)
          .maybeSingle();

        if (tvShowError) {
          console.error('Error fetching TV show:', tvShowError);
          toast({
            title: "Error",
            description: "Failed to load TV show data",
            variant: "destructive"
          });
          setLoading(false);
          return;
        }

        if (tvShowData) {
          setTvShow(tvShowData);

          // Fetch user rating and watched seasons if user is logged in
          if (user) {
            const { data: userTvShowData } = await supabase
              .from('user_tv_shows')
              .select('user_rating, seasons_watched')
              .eq('tv_show_id', tvShowData.id)
              .eq('user_id', user.id)
              .maybeSingle();

            if (userTvShowData) {
              setUserRating(userTvShowData.user_rating);
              setSeasonsWatched(userTvShowData.seasons_watched || []);
            }
          }

          // Fetch reviews
          const { data: reviewsData, error: reviewsError } = await supabase
            .from('tv_show_reviews')
            .select(`
              *,
              profiles (*)
            `)
            .eq('tv_show_id', tvShowData.id)
            .order('created_at', { ascending: false });

          if (reviewsError) {
            console.error('Error fetching reviews:', reviewsError);
            toast({
              title: "Error",
              description: "Failed to load reviews",
              variant: "destructive"
            });
          } else {
            setReviews(reviewsData || []);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: "Error",
          description: "Failed to load TV show details",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTvShowAndReviews();
  }, [tvShowId, user, toast]);

  return { tvShow, reviews, userRating, seasonsWatched, loading };
};