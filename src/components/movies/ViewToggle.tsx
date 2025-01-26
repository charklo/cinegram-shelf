import { Button } from "@/components/ui/button";
import { LayoutGrid, List } from "lucide-react";

interface ViewToggleProps {
  viewMode: 'grid' | 'list';
  onViewChange: (mode: 'grid' | 'list') => void;
}

export const ViewToggle = ({ viewMode, onViewChange }: ViewToggleProps) => {
  return (
    <div className="flex gap-2">
      <Button
        variant={viewMode === 'grid' ? 'default' : 'outline'}
        size="icon"
        onClick={() => onViewChange('grid')}
        className="w-10 h-10"
      >
        <LayoutGrid className="h-5 w-5" />
      </Button>
      <Button
        variant={viewMode === 'list' ? 'default' : 'outline'}
        size="icon"
        onClick={() => onViewChange('list')}
        className="w-10 h-10"
      >
        <List className="h-5 w-5" />
      </Button>
    </div>
  );
};