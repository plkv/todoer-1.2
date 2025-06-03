
import React, { useState } from 'react';
import { useDrop } from 'react-dnd';
import { TaskCard } from './TaskCard';
import { Plus } from 'lucide-react';
import { lightTheme, darkTheme } from '@/lib/colors';

interface Task {
  id: string;
  title: string;
  isCompleted: boolean;
  timeEstimate?: string;
  color?: string;
}

interface TimeSectionProps {
  title: string;
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  onToggleComplete: (id: string, completed: boolean) => void;
  onAddTask: (section: string) => void;
  onMoveTask?: (taskId: string, sourceLocation: { day?: string; section?: string }, targetLocation: { day?: string; section?: string }) => void;
  dayName?: string;
  className?: string;
  isDark?: boolean;
}

export const TimeSection = ({ 
  title, 
  tasks, 
  onTaskClick, 
  onToggleComplete, 
  onAddTask,
  onMoveTask,
  dayName,
  className = "",
  isDark = false
}: TimeSectionProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isAddButtonHovered, setIsAddButtonHovered] = useState(false);
  const colors = isDark ? darkTheme : lightTheme;

  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'task',
    drop: (item: { id: string; sourceLocation: { day?: string; section?: string } }) => {
      console.log('Drop event:', { 
        taskId: item.id, 
        sourceLocation: item.sourceLocation, 
        targetLocation: { day: dayName, section: title },
        dayName,
        sectionTitle: title
      });
      
      if (onMoveTask) {
        onMoveTask(item.id, item.sourceLocation, { day: dayName, section: title });
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }), [onMoveTask, dayName, title]);

  function getSectionBackgroundColor() {
    if (isOver) return colors.fill.tertiary;
    return colors.fill.primary;
  }

  function getAddButtonBackgroundColor() {
    if (isAddButtonHovered) return colors.fill.secondary;
    return colors.fill.primary;
  }

  return (
    <div 
      ref={drop}
      className={`relative flex flex-col rounded-xl transition-all duration-200 ease-out ${className}`}
      style={{
        backgroundColor: getSectionBackgroundColor(),
        minHeight: '140px',
        padding: '6px',
        gap: '6px'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Section Header */}
      <div className="flex-shrink-0">
        <h3 
          className="font-sf-pro-s transition-colors duration-200 ease-out"
          style={{
            color: isHovered || isOver ? colors.content.secondary : colors.content.tertiary,
          }}
        >
          {title}
        </h3>
      </div>
      
      {/* Tasks Container */}
      <div className="flex flex-col flex-1" style={{ gap: '4px' }}>
        {/* Tasks */}
        <div className="flex flex-col" style={{ gap: '4px' }}>
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              {...task}
              onClick={() => onTaskClick(task)}
              onToggleComplete={onToggleComplete}
              sourceLocation={{ day: dayName, section: title }}
              isDark={isDark}
            />
          ))}
        </div>
        
        {/* Add Button - always reserves space */}
        <div 
          className="cursor-pointer transition-all duration-200 ease-out flex items-center rounded-lg"
          style={{
            backgroundColor: isHovered ? getAddButtonBackgroundColor() : 'transparent',
            opacity: isHovered ? 1 : 0,
            padding: '4px 6px',
            gap: '6px',
            height: '28px',
          }}
          onMouseEnter={() => setIsAddButtonHovered(true)}
          onMouseLeave={() => setIsAddButtonHovered(false)}
          onClick={() => isHovered && onAddTask(title)}
        >
          {/* Icon placeholder (like checkbox) */}
          <div className="flex-shrink-0 w-4 h-4 flex items-center justify-center">
            <Plus 
              size={12} 
              strokeWidth={2.5}
              style={{ color: colors.content.tertiary }}
            />
          </div>

          {/* Title */}
          <div className="flex-1 min-w-0">
            <p 
              className="font-sf-pro-m transition-colors duration-200 ease-out"
              style={{
                color: colors.content.tertiary,
              }}
            >
              Add task
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
