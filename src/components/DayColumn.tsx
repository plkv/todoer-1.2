import React from 'react';
import { TimeSection } from './TimeSection';
import { ITask, DayTasks } from '@/types/Task';
import { cn } from '@/lib/utils';

interface DayColumnProps {
  dayName: string;
  date: string;
  tasks: DayTasks;
  isActive?: boolean;
  onTaskClick: (task: ITask) => void;
  onToggleComplete: (task: ITask, completed: boolean) => void;
  onAddTask: (date: string, section: string) => void;
  onMoveTask?: (taskId: string, sourceLocation: { day?: string; section?: string }, targetLocation: { day?: string; section?: string }) => void;
}

export const DayColumn = ({ 
  dayName, 
  date, 
  tasks, 
  isActive = false,
  onTaskClick, 
  onToggleComplete, 
  onAddTask,
  onMoveTask
}: DayColumnProps) => {

  return (
    <div className="grid grid-rows-subgrid row-span-5 gap-1.5">
      {/* Day Header */}
      <div className="flex flex-col flex-shrink-0 p-1.5 gap-0">
        <div className="flex items-center gap-2">
          <h2 
            className={cn(isActive ? "text-content-prim" : "text-content-tert")}
          >
            <span className="text-style-h-s">{dayName}</span>
          </h2>
          {isActive && (
            <div className="w-1.5 h-1.5 rounded-full bg-accent-prim" />
          )}
        </div>
        <h3 
          className={cn(isActive ? "text-content-prim" : "text-content-tert")}
        >
          <span className="text-style-h-l">{date}</span>
        </h3>
      </div>

      {/* Time Sections */}
      <TimeSection
        title="MORNING"
        tasks={tasks.morning}
        onTaskClick={onTaskClick}
        onToggleComplete={onToggleComplete}
        onAddTask={(section) => onAddTask(date, section)}
        onMoveTask={onMoveTask}
        dayName={date}
      />

      <TimeSection
        title="DAY"
        tasks={tasks.day}
        onTaskClick={onTaskClick}
        onToggleComplete={onToggleComplete}
        onAddTask={(section) => onAddTask(date, section)}
        onMoveTask={onMoveTask}
        dayName={date}
      />

      <TimeSection
        title="EVENING"
        tasks={tasks.evening}
        onTaskClick={onTaskClick}
        onToggleComplete={onToggleComplete}
        onAddTask={(section) => onAddTask(date, section)}
        onMoveTask={onMoveTask}
        dayName={date}
      />
    </div>
  );
};
