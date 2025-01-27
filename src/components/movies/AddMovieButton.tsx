import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetTabs, SheetTabsList, SheetTabsTrigger, SheetTabsContent } from "@/components/ui/sheet";
import { MovieSearch } from "./MovieSearch";
import { TvShowSearch } from "../tv-shows/TvShowSearch";

interface AddMovieButtonProps {
  onMovieAdded?: (newUserMovie: any) => void;
  onTvShowAdded?: (newUserTvShow: any) => void;
}

export const AddMovieButton = ({ onMovieAdded, onTvShowAdded }: AddMovieButtonProps) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          size="icon"
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg"
        >
          <Plus className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[90vh]">
        <SheetHeader>
          <SheetTitle>Add to your watchlist</SheetTitle>
        </SheetHeader>
        <div className="mt-4">
          <SheetTabs defaultValue="movies">
            <SheetTabsList className="grid w-full grid-cols-2">
              <SheetTabsTrigger value="movies">Movies</SheetTabsTrigger>
              <SheetTabsTrigger value="tvshows">TV Shows</SheetTabsTrigger>
            </SheetTabsList>
            <SheetTabsContent value="movies" className="mt-4">
              <MovieSearch onMovieAdded={onMovieAdded} />
            </SheetTabsContent>
            <SheetTabsContent value="tvshows" className="mt-4">
              <TvShowSearch onTvShowAdded={onTvShowAdded} />
            </SheetTabsContent>
          </SheetTabs>
        </div>
      </SheetContent>
    </Sheet>
  );
};