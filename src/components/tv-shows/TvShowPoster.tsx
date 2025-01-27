interface TvShowPosterProps {
  posterUrl: string;
  title: string;
  creator?: string;
}

export const TvShowPoster = ({ posterUrl, title, creator }: TvShowPosterProps) => {
  return (
    <div className="sticky top-6">
      <img
        src={posterUrl || "https://images.unsplash.com/photo-1485827404703-89b55fcc595e"}
        alt={title}
        className="w-full rounded-lg shadow-xl"
      />
      {creator && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Creator</h3>
          <p className="text-muted-foreground">{creator}</p>
        </div>
      )}
    </div>
  );
};