import React, { useState } from 'react';
import { useDrop } from 'react-dnd';
import { TaskCard } from './TaskCard';
import { Plus } from 'lucide-react';
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
        "group relative flex flex-col rounded-xl p-1.5 gap-1.5 transition-colors duration-200 ease-out",
        "min-h-[140px]",
        isOver ? 'bg-muted' : 'bg-transparent'
      )}
    >
      <h3 className="text-style-h-s px-1.5 text-muted-foreground transition-colors duration-200 ease-out group-hover:text-foreground">
        {title}
      </h3>
      
      <div className="flex flex-1 flex-col gap-1">
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
          className="flex cursor-pointer items-center gap-1.5 rounded-lg px-1.5 py-1 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-muted"
        >
          <Plus className="h-3 w-3 text-muted-foreground" strokeWidth={2.5} />
          <p className="text-style-p-m-semibold text-muted-foreground">
            Add task
          </p>
        </div>
      </div>
    </div>
  );
};
