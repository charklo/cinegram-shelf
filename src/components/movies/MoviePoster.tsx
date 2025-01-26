interface MoviePosterProps {
  posterUrl: string;
  title: string;
  director?: string;
}

export const MoviePoster = ({ posterUrl, title, director }: MoviePosterProps) => {
  return (
    <div className="sticky top-6">
      <img
        src={posterUrl || "https://images.unsplash.com/photo-1485827404703-89b55fcc595e"}
        alt={title}
        className="w-full rounded-lg shadow-xl"
      />
      {director && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Director</h3>
          <p className="text-muted-foreground">{director}</p>
        </div>
      )}
    </div>
  );
};