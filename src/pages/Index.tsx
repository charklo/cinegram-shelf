import { AuthForm } from "@/components/auth/AuthForm";
import { MovieCarousel } from "@/components/movies/MovieCarousel";
import { MovieCard } from "@/components/movies/MovieCard";

const MOCK_WATCHED_MOVIES = [
  {
    id: 1,
    title: "Inception",
    posterUrl: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e",
    rating: 8.8,
  },
  {
    id: 2,
    title: "The Dark Knight",
    posterUrl: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7",
    rating: 9.0,
  },
  {
    id: 3,
    title: "Pulp Fiction",
    posterUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5",
    rating: 8.9,
  },
];

const Index = () => {
  const isAuthenticated = false; // This will be replaced with actual auth state

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <AuthForm />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 space-y-8">
      <MovieCarousel />
      
      <section>
        <h2 className="text-2xl font-bold mb-4">Your Watched Movies</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {MOCK_WATCHED_MOVIES.map((movie) => (
            <MovieCard
              key={movie.id}
              title={movie.title}
              posterUrl={movie.posterUrl}
              rating={movie.rating}
              onClick={() => console.log("Movie clicked:", movie.title)}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Index;