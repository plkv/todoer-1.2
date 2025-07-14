import React from 'react';
import { useState } from 'react';
import { useDrop } from 'react-dnd';
import { TaskCard } from './TaskCard';
import { IconPlus } from './ui/icons';
import { ITask } from '@/types/Task';
import { cn } from '@/lib/utils';

interface TimeSectionProps {
  title: string;
  tasks: ITask[];
  onTaskClick: (task: ITask) => void;
  onToggleComplete: (task: ITask, completed: boolean) => void;
  onAddTask: (section: string) => void;
  onMoveTask?: (taskId: string, sourceLocation: { day?: string; section?: string }, targetLocation: { day?: string; section?: string }) => void;
  dayName?: string;
}

const periodTimes: Record<string, string> = {
  MORNING: '8–12',
  DAY: '12–19',
  EVENING: '19–22',
};

export const TimeSection = ({ 
  title, 
  tasks, 
  onTaskClick, 
  onToggleComplete, 
  onAddTask,
  onMoveTask,
  dayName,
}: TimeSectionProps) => {

  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'task',
    drop: (item: { id: string; sourceLocation: { day?: string; section?: string } }) => {
      if (onMoveTask) {
        onMoveTask(item.id, item.sourceLocation, { day: dayName, section: title });
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }), [onMoveTask, dayName, title]);

  return (
    <div 
      ref={drop}
      className={cn(
        "group relative flex flex-col rounded-xl p-1.5 gap-1.5 transition-colors duration-200 ease-out min-h-140"
      )}
    >
      <h3 className="text-xs font-semibold px-1.5 text-content-tert transition-colors duration-200 ease-out group-hover:text-content-prim flex items-center gap-2">
        {title}
        {periodTimes[title] && (
          <span className="hidden group-hover:inline text-xs text-content-tert">
            {periodTimes[title]}
          </span>
        )}
      </h3>
      
      <div className="flex flex-col gap-1 w-full min-w-0">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onClick={() => onTaskClick(task)}
              onToggleComplete={onToggleComplete}
              sourceLocation={{ day: dayName, section: title }}
            />
          ))}
        
        <div 
          onClick={() => onAddTask(title)}
          className="group/add-task flex flex-row items-center gap-1 min-h-7 rounded-md p-6 cursor-pointer justify-between transition-colors duration-200 ease-out opacity-0 group-hover:opacity-100 w-full min-w-0"
        >
          <div className="flex flex-row items-center gap-1">
            <IconPlus size="m" className="text-content-tert" strokeWidth={2.5} />
            <p className="text-sm text-content-tert">
              Add task
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
