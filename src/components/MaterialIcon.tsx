
import React from 'react';
import { cn } from '@/lib/utils';
import { Check, Plus, ChevronLeft, ChevronRight, Sun, Settings, ArrowUpDown, Trash2 } from 'lucide-react';

interface MaterialIconProps {
  name: string;
  className?: string;
  size?: number;
  style?: React.CSSProperties;
}

const iconMap = {
  check: Check,
  add: Plus,
  chevron_left: ChevronLeft,
  chevron_right: ChevronRight,
  wb_sunny: Sun,
  tune: Settings,
  sort: ArrowUpDown,
  close: Plus, // Using Plus rotated 45deg for close
  delete: Trash2,
} as const;

export const MaterialIcon = ({ name, className, size = 16, style }: MaterialIconProps) => {
  console.log('MaterialIcon rendering:', { name, size, style });
  
  const IconComponent = iconMap[name as keyof typeof iconMap] || Plus;
  
  return (
    <IconComponent
      size={size}
      strokeWidth={2.25}
      absoluteStrokeWidth={false}
      className={cn('select-none', className)}
      style={{
        transform: name === 'close' ? 'rotate(45deg)' : undefined,
        ...style
      }}
    />
  );
};
