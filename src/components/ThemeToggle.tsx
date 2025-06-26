import React from 'react';
import { Switch } from '@/components/ui/switch';
import { IconSettings } from './ui/icons';
import { useTheme } from '@/hooks/useTheme';

export const ThemeToggle = () => {
  const { isDark, toggleTheme } = useTheme();
  
  return (
    <div className="flex items-center gap-2">
      <IconSettings size="xl" className={`${!isDark ? 'text-content-prim' : 'text-content-sec'}`} />
      <Switch
        checked={isDark}
        onCheckedChange={toggleTheme}
      />
      <IconSettings size="xl" className={`${isDark ? 'text-content-prim' : 'text-content-sec'}`} />
    </div>
  );
};
