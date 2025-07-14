import React from 'react';
import { useDrag } from 'react-dnd';
import { cn } from '@/lib/utils';
import { ITask } from '@/types/Task';
import { Checkbox } from '@/components/ui/checkbox';
import { colorMap } from '@/styles/colors';

interface TaskCardProps {
  task: ITask;
  onClick: () => void;
  onToggleComplete: (task: ITask, completed: boolean) => void;
  sourceLocation?: { day?: string; section?: string };
}

export const TaskCard = ({ task, onClick, onToggleComplete, sourceLocation }: TaskCardProps) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'task',
    item: { id: task.id, sourceLocation },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const handleCheckboxChange = (checked: boolean) => {
    onToggleComplete(task, checked);
  };

  const rgb = task.color && colorMap[task.color] ? colorMap[task.color] : undefined;
  const colorClass = task.color ? `card-bg-${task.color}` : 'bg-fill-prim';
  const colorHoverClass = task.color ? `hover:card-bg-${task.color}-hover` : 'hover:bg-fill-sec';

  return (
    <div
      ref={drag}
      onClick={onClick}
      className={cn(
        'group flex flex-row items-start gap-1 min-h-32 rounded-md p-6 transition-colors duration-200 ease-out min-w-0 w-full',
        'active:cursor-grabbing cursor-grab',
        isDragging && 'opacity-50',
        colorClass,
        colorHoverClass
      )}
    >
      <Checkbox
        checked={task.is_completed}
        onCheckedChange={(checked) => {
          handleCheckboxChange(!!checked);
        }}
        onClick={e => e.stopPropagation()}
        className={cn(
          'size-4 min-w-4 min-h-4 rounded-sm relative flex items-center justify-center shrink-0 transition-colors duration-150',
          !task.is_completed && 'hover:border-brd-tert',
          task.is_completed && 'border-[hsl(var(--accent-prim))] bg-[hsl(var(--accent-prim))]'
        )}
      />

      <div className="basis-0 grow max-h-32 min-h-px min-w-px relative shrink-0 flex flex-col justify-center overflow-hidden">
        <p
          className={cn(
            task.is_completed ? 'text-content-tert' : 'text-content-prim',
            'text-sm'
          )}
          style={{
            maxHeight: '32px',
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            textOverflow: 'ellipsis',
            whiteSpace: 'normal',
          }}
        >
          {task.title}
        </p>
      </div>

      {task.time_estimate && (
        <div className="flex-shrink-0 h-4 flex items-center py-0.5">
          <span
            className={cn(
              'font-normal text-xs leading-4 text-nowrap',
              task.is_completed ? 'text-content-tert' : 'text-content-sec'
            )}
          >
            {task.time_estimate}
          </span>
        </div>
      )}
    </div>
  );
};
