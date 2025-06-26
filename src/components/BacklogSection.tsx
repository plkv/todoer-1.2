import { Button } from '@/components/ui/button';
import { Plus, Settings, Inbox } from 'lucide-react';
import { TaskCard } from './TaskCard';
import { cn } from '@/lib/utils';
import { useDrop } from 'react-dnd';
import React from 'react';
import { ITask } from '@/types/Task';
import { IconPlus, IconSettings, IconList } from './ui/icons';

export type List = {
  id: string;
  name: string;
  icon: React.ReactNode;
  tasks: ITask[];
};

type BacklogSectionProps = {
  lists: List[];
  onAddList: () => void;
  onSettingsClick: () => void;
  onAddTask: (listId: string) => void;
  onTaskClick: (task: ITask) => void;
  onToggleComplete: (task: ITask, completed: boolean) => void;
  onMoveTask: (taskId: string, sourceLocation: { section?: string }, targetLocation: { section?: string }) => void;
};

export const BacklogSection = ({
  lists,
  onAddList,
  onSettingsClick,
  onAddTask,
  onTaskClick,
  onToggleComplete,
  onMoveTask,
}: BacklogSectionProps) => {
  const totalTasks = lists.reduce((sum, list) => sum + list.tasks.length, 0);

  return (
    <aside className="flex flex-col gap-1.5 items-start align-stretch h-full w-full min-w-0 bg-bg-sec border-r border-brd-prim overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-start gap-1 w-full p-3 [gap:4px] [align-self:stretch]">
        <span className="text-style-h-l text-content-prim">Backlog</span>
        <span className="text-style-h-l text-content-sec">{totalTasks}</span>
        <Button
          variant="ghost-prim"
          size="m"
          className="ml-auto"
          onClick={onSettingsClick}
          title="Настройки"
        >
          <IconSettings size="m" />
        </Button>
        <Button
          variant="ghost-prim"
          size="m"
          onClick={onAddList}
          title="Добавить список"
        >
          <IconPlus size="m" />
        </Button>
      </div>
      {/* Content container */}
      <div className="flex flex-col flex-1 w-full p-[2px_0] gap-1 items-start">
        {lists.map((list) => {
          // Drag-n-drop для секции
          const [{ isOver }, drop] = useDrop(() => ({
            accept: 'task',
            drop: (item: { id: string; sourceLocation: { section?: string } }) => {
              if (onMoveTask) {
                onMoveTask(item.id, item.sourceLocation, { section: list.id });
              }
            },
            collect: (monitor) => ({
              isOver: monitor.isOver(),
            }),
          }), [onMoveTask, list.id]);

          return (
            <div key={list.id} ref={drop} className={cn("mb-2 last:mb-0 p-2 bg-bg-prim rounded-lg min-w-0 transition-colors", isOver && "bg-fill-sec")}> 
              {/* List Header */}
              <div className="flex items-center gap-2 mb-1">
                <span className="flex items-center justify-center w-6 h-6 rounded bg-fill-sec">
                  {React.isValidElement(list.icon) && (list.icon.type && (list.icon.type as any).displayName && (list.icon.type as any).displayName.startsWith('Icon'))
                    ? React.cloneElement(list.icon as React.ReactElement, { size: 'm' })
                    : list.icon}
                </span>
                <span className="text-style-p-m-bold text-content-prim truncate">{list.name}</span>
                <span className="text-style-p-m bg-fill-sec rounded px-2 py-0.5">{list.tasks.length}</span>
                <Button
                  variant="ghost-prim"
                  size="l"
                  className="ml-auto"
                  onClick={() => onAddTask(list.id)}
                  title="Добавить задачу"
                >
                  <IconPlus size="l" />
                </Button>
              </div>
              {/* Tasks */}
              <div className="flex flex-col min-w-0">
                {list.tasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onClick={() => onTaskClick(task)}
                    onToggleComplete={onToggleComplete}
                    sourceLocation={{ section: list.id }}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
};
