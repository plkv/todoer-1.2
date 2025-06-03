
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { lightTheme, darkTheme, colorSelectorOptions } from '@/lib/colors';

interface ColorSelectorProps {
  selectedColor: string;
  onColorSelect: (color: string) => void;
  isDark?: boolean;
}

export const ColorSelector = ({ selectedColor, onColorSelect, isDark = false }: ColorSelectorProps) => {
  const colors = isDark ? darkTheme : lightTheme;

  return (
    <div className="flex gap-2">
      {colorSelectorOptions.map((option, index) => {
        const isSelected = selectedColor === option.value;
        const isFirst = index === 0;
        
        return (
          <Button
            key={option.value || 'none'}
            variant="ghost"
            size="icon"
            onClick={() => onColorSelect(option.value)}
            className="w-12 h-8 rounded-lg border-2 transition-all p-0"
            style={{
              backgroundColor: option.color,
              borderColor: isSelected ? colors.content.primary : 'transparent',
              transform: isSelected ? 'scale(1.05)' : 'scale(1)',
              color: isFirst ? colors.content.tertiary : 'transparent',
            }}
          >
            {isFirst && (
              <Plus 
                size={20} 
                strokeWidth={2.25}
                absoluteStrokeWidth={false}
                style={{ transform: 'rotate(45deg)' }}
              />
            )}
          </Button>
        );
      })}
    </div>
  );
};
