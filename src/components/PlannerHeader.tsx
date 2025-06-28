import React from 'react';
import { Button } from '@/components/ui/button';
import { IconChevronLeft, IconChevronRight, IconChevronUp, IconChevronDown } from './ui/icons';
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
          <Button variant="ghost-prim" size="m">Week</Button>
        </div>
        <div className="flex flex-row-reverse items-center gap-0.5 min-w-0">
          <Button variant="ghost-prim" size="m" onClick={handleNextPeriod}>
            <IconChevronRight />
          </Button>
          <Button variant="ghost-prim" size="m">
            <IconChevronUp />
          </Button>
          <Button variant="ghost-prim" size="m">
            <IconChevronDown />
          </Button>
          <Button variant="ghost-prim" size="m" onClick={handleToday}>Today</Button>
          <Button variant="ghost-prim" size="m" onClick={handlePrevPeriod}>
            <IconChevronLeft />
          </Button>
        </div>
      </div>
    </div>
  );
};
