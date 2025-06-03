import React from 'react';
import { TimeSection } from './TimeSection';
import { lightTheme, darkTheme } from '@/lib/colors';
import { Task, DayTasks } from '@/types/Task';

interface DayColumnProps {
  dayName: string;
  date: string;
  tasks: DayTasks;
  isActive?: boolean;
  onTaskClick: (task: Task) => void;
  onToggleComplete: (id: string, completed: boolean) => void;
  onAddTask: (day: string, section: string) => void;
  onMoveTask?: (taskId: string, sourceLocation: { day?: string; section?: string }, targetLocation: { day?: string; section?: string }) => void;
  isDark?: boolean;
}

export const DayColumn = ({ 
  dayName, 
  date, 
  tasks, 
  isActive = false,
  onTaskClick, 
  onToggleComplete, 
  onAddTask,
  onMoveTask,
  isDark = false
}: DayColumnProps) => {
  const colors = isDark ? darkTheme : lightTheme;

  return (
    <div 
      className="grid grid-rows-subgrid row-span-5"
      style={{
        backgroundColor: 'transparent',
        gap: '6px'
      }}
    >
      {/* Day Header */}
      <div 
        className="flex flex-col flex-shrink-0"
        style={{ 
          padding: '6px',
          gap: '4px'
        }}
      >
        <div className="flex items-center gap-2">
          <h2 className="font-sf-pro-s" style={{ color: isActive ? colors.content.primary : colors.content.tertiary }}>
            {dayName}
          </h2>
          {isActive && (
            <div 
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: colors.accent.blue }}
            />
          )}
        </div>
        <h3 className="font-sf-pro-m-bold" style={{ color: isActive ? colors.content.primary : colors.content.tertiary, fontSize: '16px', lineHeight: '20px' }}>
          {date}
        </h3>
      </div>

      {/* Spacer for alignment */}
      <div></div>

      {/* Time Sections */}
      <TimeSection
        title="MORNING"
        tasks={tasks.morning}
        onTaskClick={onTaskClick}
        onToggleComplete={onToggleComplete}
        onAddTask={(section) => onAddTask(dayName, section)}
        onMoveTask={onMoveTask}
        dayName={dayName}
        isDark={isDark}
      />

      <TimeSection
        title="DAY"
        tasks={tasks.day}
        onTaskClick={onTaskClick}
        onToggleComplete={onToggleComplete}
        onAddTask={(section) => onAddTask(dayName, section)}
        onMoveTask={onMoveTask}
        dayName={dayName}
        isDark={isDark}
      />

      <TimeSection
        title="EVENING"
        tasks={tasks.evening}
        onTaskClick={onTaskClick}
        onToggleComplete={onToggleComplete}
        onAddTask={(section) => onAddTask(dayName, section)}
        onMoveTask={onMoveTask}
        dayName={dayName}
        isDark={isDark}
      />
    </div>
  );
};
