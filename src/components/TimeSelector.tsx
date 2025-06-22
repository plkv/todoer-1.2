import React from 'react';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Plus, X } from 'lucide-react';

interface TimeSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const timeOptions = [
  { value: '5m', label: '5m' },
  { value: '15m', label: '15m' },
  { value: '30m', label: '30m' },
  { value: '1h', label: '1h' },
  { value: '2h', label: '2h' },
  { value: '3h+', label: '3h+' }
];

export const TimeSelector = ({ value, onChange }: TimeSelectorProps) => {
  return (
    <div className="flex items-center gap-2">
      <button 
        onClick={() => onChange("")}
        className="flex h-9 w-9 items-center justify-center rounded-full border bg-muted text-muted-foreground transition-colors hover:bg-accent"
      >
        <Plus size={20} className="-rotate-45" />
      </button>
      <ToggleGroup 
        type="single" 
        value={value} 
        onValueChange={(val) => { if (val) onChange(val) }}
        className="flex-wrap justify-start"
      >
        {timeOptions.map((option) => (
          <ToggleGroupItem key={option.value} value={option.value} aria-label={option.value} className="text-style-p-m">
            {option.label}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  );
};
