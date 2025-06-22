import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Plus } from 'lucide-react';
import { cn } from "@/lib/utils";

interface ColorSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const colorOptions = [
  { value: 'red', className: 'bg-red-400' },
  { value: 'orange', className: 'bg-orange-400' },
  { value: 'yellow', className: 'bg-yellow-400' },
  { value: 'green', className: 'bg-green-400' },
  { value: 'blue', className: 'bg-blue-400' },
  { value: 'purple', className: 'bg-purple-400' },
  { value: 'gray', className: 'bg-gray-400' },
];

export const ColorSelector = ({ value, onChange }: ColorSelectorProps) => {
  return (
    <div className="flex items-center gap-2">
      <button 
        onClick={() => onChange("")}
        className={cn(
          "flex h-8 w-12 items-center justify-center rounded-lg border-2",
          !value ? "border-foreground" : "border-transparent"
        )}
      >
        <Plus size={20} className="-rotate-45 text-muted-foreground" />
      </button>
      <ToggleGroup 
        type="single" 
        value={value} 
        onValueChange={(val) => { if (val) onChange(val) }}
        className="flex-wrap justify-start"
      >
        {colorOptions.map((option) => (
          <ToggleGroupItem 
            key={option.value} 
            value={option.value} 
            className={cn(
              "h-8 w-12 rounded-lg border-2 p-0 transition-all",
              option.className,
              "data-[state=on]:border-foreground"
            )}
            aria-label={`Select ${option.value} color`}
          />
        ))}
      </ToggleGroup>
    </div>
  );
};
