import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { User } from "@supabase/supabase-js";

export const useMovieData = (movieId: string, user: User | null) => {
  const { toast } = useToast();
  const [movie, setMovie] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [userRating, setUserRating] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovieAndReviews = async () => {
      try {
        // First, get the movie data from Supabase using imdb_id
        const { data: movieData, error: movieError } = await supabase
          .from('movies')
          .select('*')
          .eq('imdb_id', movieId)
          .maybeSingle();

        if (movieError) {
          console.error('Error fetching movie:', movieError);
          toast({
            title: "Error",
            description: "Failed to load movie data",
            variant: "destructive"
          });
          setLoading(false);
          return;
        }
        
        if (movieData) {
          // Get TMDB API key from Edge Function
          const { data: { TMDB_API_KEY }, error: keyError } = await supabase.functions.invoke('get-tmdb-key');
          
          if (keyError) {
            console.error('Error getting TMDB API key:', keyError);
            toast({
              title: "Error",
              description: "Failed to get API key",
              variant: "destructive"
            });
            setMovie(movieData);
            setLoading(false);
            return;
          }

          try {
            // Try to fetch French details first
            const frResponse = await fetch(
              `https://api.themoviedb.org/3/movie/${movieId}?api_key=${TMDB_API_KEY}&append_to_response=credits&language=fr-FR`
            );
            
            let tmdbData;
            
            if (frResponse.ok) {
              tmdbData = await frResponse.json();
              // If overview is empty in French, fetch English version
              if (!tmdbData.overview) {
                const enResponse = await fetch(
                  `https://api.themoviedb.org/3/movie/${movieId}?api_key=${TMDB_API_KEY}&append_to_response=credits&language=en-US`
                );
                if (enResponse.ok) {
                  tmdbData = await enResponse.json();
                }
              }
            } else {
              // Fallback to English if French request fails
              const enResponse = await fetch(
                `https://api.themoviedb.org/3/movie/${movieId}?api_key=${TMDB_API_KEY}&append_to_response=credits&language=en-US`
              );
              if (!enResponse.ok) {
                throw new Error('Failed to fetch movie details from TMDB');
              }
              tmdbData = await enResponse.json();
            }
            
            // Update movie data with TMDB details
            const updatedMovie = {
              ...movieData,
              overview: tmdbData.overview || movieData.overview,
              movie_cast: tmdbData.credits?.cast?.map((actor: any) => ({
                name: actor.name,
                character: actor.character
              })) || movieData.movie_cast,
              director: tmdbData.credits?.crew?.find((person: any) => person.job === 'Director')?.name || movieData.director
            };

            setMovie(updatedMovie);

            // Update the movie in Supabase if needed
            if (!movieData.overview || !movieData.movie_cast) {
              const { error: updateError } = await supabase
                .from('movies')
                .update({
                  overview: updatedMovie.overview,
                  movie_cast: updatedMovie.movie_cast,
                  director: updatedMovie.director
                })
                .eq('id', movieData.id);

              if (updateError) {
                console.error('Error updating movie:', updateError);
              }
            }
          } catch (tmdbError) {
            console.error('Error fetching TMDB data:', tmdbError);
            setMovie(movieData); // Still show the movie with available data
          }
        }

        // Fetch user rating if user is logged in
        if (user && movieData) {
          const { data: userMovieData } = await supabase
            .from('user_movies')
            .select('user_rating')
            .eq('movie_id', movieData.id)
            .eq('user_id', user.id)
            .maybeSingle();

          if (userMovieData) {
            setUserRating(userMovieData.user_rating);
          }
        }

        // Fetch reviews
        if (movieData) {
          const { data: reviewsData, error: reviewsError } = await supabase
            .from('movie_reviews')
            .select(`
              *,
              profiles (*)
            `)
            .eq('movie_id', movieData.id)
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
          description: "Failed to load movie details",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMovieAndReviews();
  }, [movieId, user, toast]);

  return { movie, reviews, userRating, loading };
};