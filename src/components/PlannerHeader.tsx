import React from 'react';
import { Button } from '@/components/ui/button';
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
    handlePrevPeriod, 
    handleNextPeriod,
    handleToday
  } = usePlannerState();

  return (
    <div className="border-b border-b-brd-prim px-4 py-3">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-2 min-w-0">
          <Button variant="ghost" size="sm">Week</Button>
        </div>
        <div className="flex flex-row-reverse items-center gap-0.5 min-w-0">
          <Button variant="ghost" size="sm" onClick={handleNextPeriod}>
            <span className="material-symbols-rounded">chevron_right</span>
          </Button>
          <Button variant="ghost" size="sm">
            <span className="material-symbols-rounded">expand_less</span>
          </Button>
          <Button variant="ghost" size="sm">
            <span className="material-symbols-rounded">expand_more</span>
          </Button>
          <Button variant="ghost" size="sm" onClick={handleToday}>Today</Button>
          <Button variant="ghost" size="sm" onClick={handlePrevPeriod}>
            <span className="material-symbols-rounded">chevron_left</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
