
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { lightTheme, darkTheme } from '@/lib/colors';

interface TimeSelectorProps {
  selectedTime: string;
  onTimeSelect: (time: string) => void;
  isDark?: boolean;
}

const timeOptions = [
  { value: '', label: '', icon: true },
  { value: '5m', label: '5m' },
  { value: '15m', label: '15m' },
  { value: '30m', label: '30m' },
  { value: '1h', label: '1h' },
  { value: '2h', label: '2h' },
  { value: '3h+', label: '3h+' }
];

export const TimeSelector = ({ selectedTime, onTimeSelect, isDark = false }: TimeSelectorProps) => {
  const colors = isDark ? darkTheme : lightTheme;

  return (
    <div className="flex gap-2">
      {timeOptions.map((option, index) => {
        const isSelected = selectedTime === option.value;
        const isFirst = index === 0;
        
        return (
          <Button
            key={option.value || 'none'}
            variant="ghost"
            size="sm"
            onClick={() => onTimeSelect(option.value)}
            className={`h-9 px-4 rounded-full text-sm font-medium ${isFirst ? 'w-9 px-0' : ''}`}
            style={{
              backgroundColor: isSelected ? colors.content.primary : colors.fill.secondary,
              color: isSelected ? colors.bg.primary : colors.content.secondary,
            }}
          >
            {isFirst ? (
              <Plus size={20} strokeWidth={2.25} absoluteStrokeWidth={false} style={{ transform: 'rotate(45deg)' }} />
            ) : (
              option.label
            )}
          </Button>
        );
      })}
    </div>
  );
};
