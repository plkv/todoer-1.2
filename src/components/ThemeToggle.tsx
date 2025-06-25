import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Icon00 } from './ui/icons';
import { useTheme } from '@/hooks/useTheme';

export const ThemeToggle = () => {
  const { isDark, toggleTheme } = useTheme();
  
  return (
    <div className="flex items-center gap-2">
      <Icon00 className={`h-4 w-4 ${!isDark ? 'text-content-prim' : 'text-content-sec'}`} />
      <Switch
        checked={isDark}
        onCheckedChange={toggleTheme}
      />
      <Icon00 className={`h-4 w-4 ${isDark ? 'text-content-prim' : 'text-content-sec'}`} />
    </div>
  );
};
