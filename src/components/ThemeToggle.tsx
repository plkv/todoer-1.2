import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';

export const ThemeToggle = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className="flex items-center gap-2">
      <Sun className={`h-4 w-4 ${!isDark ? 'text-foreground' : 'text-muted-foreground'}`} />
      <Switch
        checked={isDark}
        onCheckedChange={toggleTheme}
      />
      <Moon className={`h-4 w-4 ${isDark ? 'text-foreground' : 'text-muted-foreground'}`} />
    </div>
  );
};
