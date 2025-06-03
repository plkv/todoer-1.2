
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { ThemeToggle } from './ThemeToggle';
import { lightTheme, darkTheme } from '@/lib/colors';

interface PlannerHeaderProps {
  currentView: 'Week' | 'Day' | 'Month';
  onViewChange: (view: 'Week' | 'Day' | 'Month') => void;
  isDark: boolean;
  onThemeToggle: () => void;
}

export const PlannerHeader = ({ currentView, onViewChange, isDark, onThemeToggle }: PlannerHeaderProps) => {
  const colors = isDark ? darkTheme : lightTheme;

  return (
    <div 
      className="border-b"
      style={{ 
        backgroundColor: colors.bg.primary,
        borderColor: colors.border.primary,
        padding: '12px 16px'
      }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="font-sf-pro-xl" style={{ color: colors.content.primary }}>
            Planner
          </h1>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-lg transition-colors"
              style={{ 
                color: colors.content.secondary,
                backgroundColor: 'transparent'
              }}
            >
              <ChevronLeft size={16} strokeWidth={2} />
            </Button>
            
            <Button
              variant="ghost"
              className="rounded-lg font-sf-pro-m-bold transition-all px-3 py-1"
              style={{
                backgroundColor: colors.content.primary,
                color: colors.bg.primary
              }}
            >
              Today
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-lg transition-colors"
              style={{ 
                color: colors.content.secondary,
                backgroundColor: 'transparent'
              }}
            >
              <ChevronRight size={16} strokeWidth={2} />
            </Button>
          </div>

          <div 
            className="flex items-center rounded-xl p-1"
            style={{ backgroundColor: colors.fill.primary }}
          >
            {(['Day', 'Week'] as const).map((view) => (
              <Button
                key={view}
                variant="ghost"
                size="sm"
                onClick={() => onViewChange(view)}
                className="font-sf-pro-m transition-all rounded-lg px-3 py-1"
                style={{
                  color: currentView === view ? colors.content.primary : colors.content.secondary,
                  backgroundColor: currentView === view ? colors.bg.primary : 'transparent',
                  boxShadow: currentView === view ? '0 1px 2px rgba(0, 0, 0, 0.08)' : 'none'
                }}
              >
                {view}
              </Button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle isDark={isDark} onToggle={onThemeToggle} />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-8 w-8 rounded-full p-0 transition-colors"
                style={{ 
                  backgroundColor: 'transparent'
                }}
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage 
                    src="https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?w=32&h=32&fit=crop&crop=face" 
                    alt="User" 
                  />
                  <AvatarFallback 
                    style={{ 
                      backgroundColor: colors.fill.primary,
                      color: colors.content.secondary,
                      fontSize: '12px'
                    }}
                  >
                    U
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="end"
              className="w-48"
              style={{
                backgroundColor: colors.bg.primary,
                borderColor: colors.border.primary,
                color: colors.content.primary
              }}
            >
              <DropdownMenuItem 
                style={{ color: colors.content.primary }}
                className="hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem 
                style={{ color: colors.content.primary }}
                className="hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem 
                style={{ color: colors.content.primary }}
                className="hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Help
              </DropdownMenuItem>
              <DropdownMenuSeparator style={{ backgroundColor: colors.border.primary }} />
              <DropdownMenuItem 
                style={{ color: colors.content.primary }}
                className="hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};
