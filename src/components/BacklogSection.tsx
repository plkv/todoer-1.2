import { useDrop } from 'react-dnd';
import { TaskCard } from './TaskCard';
import { Plus, Settings, ArrowUpDown } from 'lucide-react';
import { ITask } from '@/types/Task';
import { cn } from '@/lib/utils';

interface BacklogSectionProps {
  tasks: ITask[];
  onTaskClick: (task: ITask) => void;
  onToggleComplete: (task: ITask, completed: boolean) => void;
  onAddTask: () => void;
  onMoveTask?: (taskId: string, sourceLocation: { day?: string; section?: string }, targetLocation: { day?: string; section?: string }) => void;
}

export const BacklogSection = ({ 
  tasks, 
  onTaskClick, 
  onToggleComplete, 
  onAddTask,
  onMoveTask
}: BacklogSectionProps) => {

  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'task',
    drop: (item: { id: string; sourceLocation: { day?: string; section?: string } }) => {
      if (onMoveTask) {
        onMoveTask(item.id, item.sourceLocation, {});
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  return (
    <div 
      ref={drop}
      className={cn(
        "border-t-brd-prim p-2 transition-colors",
        isOver ? "bg-fill-sec" : "bg-fill-prim"
      )}
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-2 flex items-center justify-between">
          <div className="group flex items-center gap-1">
            <h2 className="text-style-h-l text-content-prim">
              Backlog
            </h2>
              <button
                onClick={onAddTask}
                className="flex h-7 w-7 items-center justify-center rounded-lg text-content-sec opacity-0 transition-opacity group-hover:opacity-100 hover:bg-fill-sec text-style-p-m"
              >
                <Plus size={16} strokeWidth={2} />
              </button>
          </div>

          <div className="flex items-center gap-2">
            <button className="text-style-p-m flex items-center gap-1 rounded-md p-1 text-content-sec transition-colors hover:bg-fill-sec hover:text-content-prim">
              <span>Filter</span>
                <Settings size={14} strokeWidth={2} />
              </button>
            <button className="text-style-p-m flex items-center gap-1 rounded-md p-1 text-content-sec transition-colors hover:bg-fill-sec hover:text-content-prim">
              <span>Sort</span>
                <ArrowUpDown size={14} strokeWidth={2} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onClick={() => onTaskClick(task)}
              onToggleComplete={onToggleComplete}
              sourceLocation={{}}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
