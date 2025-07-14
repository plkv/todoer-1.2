import React from 'react';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { cn } from "@/lib/utils";
import { colorOptions } from "@/styles/colors";

interface ColorSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export const ColorSelector = ({ value, onChange }: ColorSelectorProps) => {
  return (
    <div className="flex items-center gap-3">
      <div className="flex bg-fill-prim rounded-full p-1 w-fit">
        <ToggleGroup
          type="single"
          value={value}
          onValueChange={(val) => { if (val) onChange(val) }}
          className="flex"
        >
          {colorOptions.map((option) => (
            <ToggleGroupItem
              key={option.value}
              value={option.value}
              className={cn(
                "w-8 h-8 rounded-full border-2 p-0 transition-all flex items-center justify-center mx-0.5 border-transparent",
                option.className,
                "data-[state=on]:border-accent-prim"
              )}
              aria-label={`Select ${option.value} color`}
            />
          ))}
        </ToggleGroup>
      </div>
    </div>
  );
};
