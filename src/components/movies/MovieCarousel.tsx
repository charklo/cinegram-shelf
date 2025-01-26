import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const MOCK_MOVIES = [
  {
    id: 1,
    title: "Dune: Part Two",
    posterUrl: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e",
    rating: 8.5,
  },
  {
    id: 2,
    title: "Poor Things",
    posterUrl: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7",
    rating: 8.2,
  },
  {
    id: 3,
    title: "Oppenheimer",
    posterUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5",
    rating: 8.4,
  },
];

export const MovieCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % MOCK_MOVIES.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + MOCK_MOVIES.length) % MOCK_MOVIES.length);
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-[400px] overflow-hidden rounded-lg">
      <div
        className="flex transition-transform duration-500 ease-out h-full"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {MOCK_MOVIES.map((movie) => (
          <div key={movie.id} className="min-w-full h-full relative">
            <img
              src={movie.posterUrl}
              alt={movie.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent">
              <div className="absolute bottom-8 left-8">
                <h2 className="text-4xl font-bold text-white mb-2">{movie.title}</h2>
                <div className="flex items-center">
                  <span className="text-yellow-400 mr-2">★</span>
                  <span className="text-white">{movie.rating}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40"
        onClick={prevSlide}
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40"
        onClick={nextSlide}
      >
        <ChevronRight className="h-6 w-6" />
      </Button>
    </div>
  );
};