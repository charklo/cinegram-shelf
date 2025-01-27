import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
          <Tabs defaultValue="movies">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="movies">Movies</TabsTrigger>
              <TabsTrigger value="tvshows">TV Shows</TabsTrigger>
            </TabsList>
            <TabsContent value="movies" className="mt-4">
              <MovieSearch onMovieAdded={onMovieAdded} />
            </TabsContent>
            <TabsContent value="tvshows" className="mt-4">
              <TvShowSearch onTvShowAdded={onTvShowAdded} />
            </TabsContent>
          </Tabs>
        </div>
      </SheetContent>
    </Sheet>
  );
};