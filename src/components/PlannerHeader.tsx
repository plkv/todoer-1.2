import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
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
    handlePrevWeek, 
    handleNextWeek 
  } = usePlannerState();

  return (
    <div className="border-b-brd-prim bg-fill-prim px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-style-h-xl text-content-prim">Planner</h1>
          
          <div className="flex items-center gap-0.5">
            <Button variant="ghost" className="h-7 w-7 rounded-[6px] p-0 flex items-center justify-center" onClick={handlePrevWeek}>
              <ChevronLeft size={14} strokeWidth={2} />
            </Button>
            <Button variant="secondary" className="h-7 min-w-[44px] rounded-[6px] text-style-p-m-semibold text-content-prim px-2 flex items-center justify-center">Today</Button>
            <Button variant="ghost" className="h-7 w-7 rounded-[6px] p-0 flex items-center justify-center" onClick={handleNextWeek}>
              <ChevronRight size={14} strokeWidth={2} />
            </Button>
          </div>

          <div className="flex items-center rounded-[6px] bg-fill-sec p-0.5 gap-0.5">
            {(['Day', 'Week'] as const).map((view) => (
              <Button
                key={view}
                variant={currentView === view ? 'default' : 'ghost'}
                className={
                  (currentView === view
                    ? 'bg-bg-prim text-style-p-m-semibold text-content-prim rounded-[6px] h-7 min-w-[44px] px-2'
                    : 'bg-transparent text-style-p-m-semibold text-content-tert rounded-[6px] h-7 min-w-[44px] px-2')
                }
              >
                {view}
              </Button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 rounded-full p-0">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.picture} alt={user?.name || 'User'} />
                  <AvatarFallback className="bg-muted text-muted-foreground">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-style-p-m-semibold leading-none">{user?.name}</p>
                  <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={() => logout()} className="cursor-pointer text-style-p-m">
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};
