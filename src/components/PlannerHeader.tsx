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
    <div className="border-b-brd-prim bg-fill-prim px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 min-w-0">
          <h1 className="text-style-h-xl text-content-prim truncate">Planner</h1>
          
          <div className="flex items-center gap-0.5 min-w-0">
            <Button variant="ghost" className="rounded-[6px] p-0 flex items-center justify-center min-w-0" onClick={handlePrevPeriod}>
              <IconChevronLeft size={14} strokeWidth={2} />
            </Button>
            <Button variant="secondary" className="rounded-[6px] text-style-p-m-semibold text-content-prim px-2 flex items-center justify-center min-w-0" onClick={handleToday}>Today</Button>
            <Button variant="ghost" className="rounded-[6px] p-0 flex items-center justify-center min-w-0" onClick={handleNextPeriod}>
              <IconChevronRight size={14} strokeWidth={2} />
            </Button>
          </div>

          <div className="flex items-center rounded-[6px] bg-fill-sec p-0.5 gap-0.5 min-w-0">
            {(['Day', 'Week'] as const).map((view) => (
              <Button
                key={view}
                variant={currentView === view ? 'default' : 'ghost'}
                className={
                  (currentView === view
                    ? 'bg-bg-prim text-style-p-m-semibold text-content-prim rounded-[6px] px-2 min-w-0'
                    : 'bg-transparent text-style-p-m-semibold text-content-tert rounded-[6px] px-2 min-w-0')
                }
              >
                {view}
              </Button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
};
