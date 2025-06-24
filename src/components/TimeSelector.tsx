import React from 'react';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { X } from 'lucide-react';
import { colorOptions } from '@/styles/colors';

interface TimeSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const timeOptions = [
  { value: '', label: <X size={16} /> },
  { value: '5m', label: '5m' },
  { value: '15m', label: '15m' },
  { value: '30m', label: '30m' },
  { value: '1h', label: '1h' },
  { value: '2h', label: '2h' },
  { value: '3h+', label: '3h+' }
];

export const TimeSelector = ({ value, onChange }: TimeSelectorProps) => {
  return (
    <div className="flex bg-gray-100 rounded-md p-1 w-fit gap-0">
      <ToggleGroup
        type="single"
        value={value}
        onValueChange={(val) => { onChange(val ?? '') }}
        className="flex gap-0"
      >
        {timeOptions.map((option) => (
          <ToggleGroupItem
            key={option.value + ''}
            value={option.value}
            aria-label={typeof option.label === 'string' ? option.label : 'Clear'}
            className={
              option.value === ''
                ? "min-w-[40px] h-8 flex items-center justify-center rounded-md bg-gray-200 text-gray-500 transition-colors data-[state=on]:bg-black data-[state=on]:text-white border-none px-0"
                : "min-w-[40px] h-8 px-4 rounded-md font-semibold text-sm flex items-center justify-center transition-colors data-[state=on]:bg-black data-[state=on]:text-white bg-transparent text-gray-800 border-none"
            }
          >
            {option.label}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  );
};
