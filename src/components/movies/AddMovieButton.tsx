import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { MovieSearch } from "./MovieSearch";

interface AddMovieButtonProps {
  onMovieAdded?: (newUserMovie: any) => void;
}

export const AddMovieButton = ({ onMovieAdded }: AddMovieButtonProps) => {
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
          <SheetTitle>Ajouter un film</SheetTitle>
        </SheetHeader>
        <MovieSearch onMovieAdded={onMovieAdded} />
      </SheetContent>
    </Sheet>
  );
};