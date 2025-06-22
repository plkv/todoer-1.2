import { useDrag } from 'react-dnd';
import { cn } from '@/lib/utils';
import { Task } from '@/types/Task';
import { Checkbox } from '@/components/ui/checkbox';

interface TaskCardProps {
  task: Task;
  onClick: () => void;
  onToggleComplete: (task: Task, completed: boolean) => void;
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

  return (
    <div
      ref={drag}
      onClick={onClick}
      className={cn(
        'group flex cursor-grab items-center gap-2 rounded-lg p-1.5 transition-all duration-200 ease-out',
        'active:cursor-grabbing',
        isDragging && 'opacity-50',
        task.is_completed && 'opacity-60',
        task.color ? `bg-${task.color}-100 dark:bg-${task.color}-900/50` : 'bg-muted/70 hover:bg-muted'
      )}
    >
      <Checkbox 
        checked={task.is_completed}
        onCheckedChange={handleCheckboxChange}
        onClick={(e) => e.stopPropagation()}
      />

      <p 
        className={cn(
          "text-style-p-m-semibold flex-1 truncate",
          task.is_completed ? "text-muted-foreground line-through" : "text-foreground"
        )}
      >
        <span className="text-style-p-m-semibold">{task.title}</span>
      </p>

      {task.time_estimate && (
        <div className="flex-shrink-0 text-xs text-muted-foreground">
          {task.time_estimate}
        </div>
      )}
    </div>
  );
};
