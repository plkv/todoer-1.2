import React from 'react';
import { Button } from '@/components/ui/button';
import { IconChevronLeft, IconChevronRight } from './ui/icons';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';
import { usePlannerState } from '@/hooks/usePlannerState';
import { ThemeToggle } from './ThemeToggle';

export const PlannerHeader = () => {
  const { user, logout } = useAuth();
  const { 
    currentView, 
    setCurrentView, 
    handlePrevPeriod, 
    handleNextPeriod,
    handleToday
  } = usePlannerState();

  return (
    <div className="border-b border-b-brd-prim px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 min-w-0">
          <div className="flex items-center gap-0.5 min-w-0">
            <Button variant="ghost-prim" size="m" onClick={handlePrevPeriod}>
              <IconChevronLeft size="l" strokeWidth={2} />
            </Button>
            <Button variant="secondary" size="m" onClick={handleToday}>Today</Button>
            <Button variant="ghost-prim" size="m" onClick={handleNextPeriod}>
              <IconChevronRight size="l" strokeWidth={2} />
            </Button>
          </div>
          <div className="flex items-center rounded-[6px] bg-fill-sec p-0.5 gap-0.5 min-w-0">
            {(['Day', 'Week'] as const).map((view) => (
              <Button
                key={view}
                variant={currentView === view ? 'primary' : 'ghost-sec'}
                size="m"
              >
                {view}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
