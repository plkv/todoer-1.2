
import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Sun, Moon } from 'lucide-react';
import { lightTheme, darkTheme } from '@/lib/colors';

interface ThemeToggleProps {
  isDark: boolean;
  onToggle: () => void;
}

export const ThemeToggle = ({ isDark, onToggle }: ThemeToggleProps) => {
  const colors = isDark ? darkTheme : lightTheme;
  
  return (
    <div className="flex items-center gap-2">
      <Sun 
        size={16} 
        style={{ color: isDark ? colors.content.tertiary : colors.content.secondary }}
      />
      <Switch
        checked={isDark}
        onCheckedChange={onToggle}
      />
      <Moon 
        size={16} 
        style={{ color: isDark ? colors.content.secondary : colors.content.tertiary }}
      />
    </div>
  );
};
