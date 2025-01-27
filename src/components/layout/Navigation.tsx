import { useState } from "react";
import { Menu, Film, Tv, User } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

export const Navigation = () => {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px]">
            <nav className="flex flex-col gap-4 mt-8">
              <Button
                variant="ghost"
                className="justify-start gap-2"
                onClick={() => setOpen(false)}
              >
                <Film className="h-5 w-5" />
                Movies
              </Button>
              <Button
                variant="ghost"
                className="justify-start gap-2"
                onClick={() => setOpen(false)}
              >
                <Tv className="h-5 w-5" />
                TV Shows
              </Button>
              <Button
                variant="ghost"
                className="justify-start gap-2"
                onClick={() => setOpen(false)}
              >
                <User className="h-5 w-5" />
                Profile
              </Button>
              {user && (
                <Button
                  variant="ghost"
                  className="justify-start text-destructive hover:text-destructive"
                  onClick={handleSignOut}
                >
                  Sign Out
                </Button>
              )}
            </nav>
          </SheetContent>
        </Sheet>
        <div className="text-xl font-bold">Watchlist</div>
        <div className="w-10" /> {/* Spacer for symmetry */}
      </div>
    </div>
  );
};