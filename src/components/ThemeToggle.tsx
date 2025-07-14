import React from 'react';
import { Switch } from '@/components/ui/switch';
import { useTheme } from '@/hooks/useTheme';

export const ThemeToggle = () => {
  const { isDark, toggleTheme } = useTheme();
  
  return (
    <div className="flex items-center gap-2">
      <span className={`material-symbols-rounded ${!isDark ? 'text-content-prim' : 'text-content-sec'}`}>settings</span>
      <Switch
        checked={isDark}
        onCheckedChange={toggleTheme}
      />
      <span className={`material-symbols-rounded ${isDark ? 'text-content-prim' : 'text-content-sec'}`}>settings</span>
    </div>
  );
};
