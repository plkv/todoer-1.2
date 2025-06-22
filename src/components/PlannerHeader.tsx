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
    <div className="border-b bg-background px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-style-h-xl">Planner</h1>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8 text-foreground/60" onClick={handlePrevWeek}>
              <ChevronLeft size={16} strokeWidth={2} />
            </Button>
            
            <Button variant="secondary" className="text-style-p-m-semibold">Today</Button>
            
            <Button variant="ghost" size="icon" className="h-8 w-8 text-foreground/60" onClick={handleNextWeek}>
              <ChevronRight size={16} strokeWidth={2} />
            </Button>
          </div>

          <div className="flex items-center rounded-lg bg-muted p-1">
            {(['Day', 'Week'] as const).map((view) => (
              <Button
                key={view}
                variant={currentView === view ? 'outline' : 'ghost'}
                size="sm"
                onClick={() => setCurrentView(view)}
                className="text-style-p-m-semibold"
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
