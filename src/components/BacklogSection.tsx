import { Button } from '@/components/ui/button';
import { Plus, Settings, Inbox } from 'lucide-react';
import { TaskCard } from './TaskCard';
import { cn } from '@/lib/utils';
import { useDrop } from 'react-dnd';
import React, { useState, useEffect } from 'react';
import { ITask } from '@/types/Task';
import { IconPlus, IconSettings, IconList, IconMore } from './ui/icons';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from './ui/dropdown-menu';

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
  onDuplicateList: (newListId: string, newListName: string, newTasks: ITask[]) => void;
  onDeleteAllTasks: (listId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onRestoreTask: (task: ITask) => void;
  onDeleteList: (listId: string) => void;
};

// Новый компонент для одной секции списка
const BacklogListSection = ({
  list,
  onMoveTask,
  onTaskClick,
  onToggleComplete,
  onAddTask,
  onDeleteList,
  onDeleteAllTasks,
  onDuplicateList,
  onRestoreTask,
  onDeleteTask,
  setUndoStack,
  undoStack,
}: any) => {
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

  // Локальные обработчики для секции
  const handleDeleteList = () => {
    if (list.id === 'inbox') return;
    setUndoStack((stack: any[]) => [...stack, { type: 'delete-list', listId: list.id, list, tasks: list.tasks }]);
    onDeleteList(list.id);
  };
  const handleDuplicateList = () => {
    const newListId = `${list.id}-copy-${Date.now()}`;
    const newListName = `${list.name} (копия)`;
    const newTasks = list.tasks.map((task: ITask) => ({
      ...task,
      id: `${task.id}-copy-${Date.now()}`,
      section: newListId,
    }));
    onDuplicateList(newListId, newListName, newTasks);
  };
  const handleDeleteAllTasks = () => onDeleteAllTasks(list.id);
  const handleDeleteTask = (task: ITask) => {
    setUndoStack((stack: any[]) => [...stack, { type: 'delete-task', task }]);
    onDeleteTask(task.id);
  };

  return (
    <div key={list.id} ref={drop} className={cn("w-full p-2 rounded-lg transition-colors", isOver && "bg-fill-sec")}> 
      {/* List Header */}
      <div className="flex items-center gap-2 mb-1 w-full">
        <span className="flex items-center justify-center w-6 h-6 rounded bg-fill-sec">
          {React.isValidElement(list.icon) && (list.icon.type && (list.icon.type as any).displayName && (list.icon.type as any).displayName.startsWith('Icon'))
            ? React.cloneElement(list.icon as React.ReactElement, { size: 'm' })
            : list.icon}
        </span>
        <span className="text-style-p-m-bold text-content-prim truncate">{list.name}</span>
        <span className="text-style-p-m bg-fill-sec rounded px-2 py-0.5">{list.tasks.length}</span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost-sec"
              size="m"
              className="ml-auto"
              title="Меню списка"
            >
              <IconMore size="m" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {list.id === 'inbox' ? (
              <DropdownMenuItem onSelect={handleDeleteAllTasks} className="text-red-600">Удалить все задачи</DropdownMenuItem>
            ) : (
              <>
                <DropdownMenuItem onSelect={handleDeleteList} className="text-red-600">Удалить список</DropdownMenuItem>
                <DropdownMenuItem onSelect={handleDeleteAllTasks}>Удалить все задачи</DropdownMenuItem>
                <DropdownMenuItem onSelect={handleDuplicateList}>Дублировать список</DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
        <Button
          variant="ghost-prim"
          size="m"
          title="Добавить задачу"
          onClick={() => onAddTask(list.id)}
        >
          <IconPlus size="m" />
        </Button>
      </div>
      {/* Tasks */}
      <div className="flex flex-col flex-1 w-full p-[2px_0] gap-2 items-stretch">
        {list.tasks.map((task: ITask) => (
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
};

export const BacklogSection = ({
  lists,
  onAddList,
  onSettingsClick,
  onAddTask,
  onTaskClick,
  onToggleComplete,
  onMoveTask,
  onDuplicateList,
  onDeleteAllTasks,
  onDeleteTask,
  onRestoreTask,
  onDeleteList,
}: BacklogSectionProps) => {
  const [undoStack, setUndoStack] = useState<any[]>([]);
  const totalTasks = lists.reduce((sum, list) => sum + list.tasks.length, 0);

  // Undo handler
  useEffect(() => {
    const handleUndo = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        if (undoStack.length === 0) return;
        const last = undoStack[undoStack.length - 1];
        setUndoStack(stack => stack.slice(0, -1));
        if (last.type === 'delete-task') {
          onRestoreTask(last.task);
        } else if (last.type === 'delete-list') {
          onDuplicateList(last.list.id, last.list.name, last.tasks);
        } else if (last.type === 'delete-all-tasks') {
          last.tasks.forEach((task: ITask) => onRestoreTask(task));
        }
      }
    };
    window.addEventListener('keydown', handleUndo);
    return () => window.removeEventListener('keydown', handleUndo);
  }, [undoStack, onRestoreTask, onDuplicateList]);

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
      <div className="flex flex-col flex-1 w-full p-[2px_0] gap-2 items-stretch">
        {lists.map((list) => (
          <BacklogListSection
            key={list.id}
            list={list}
            onMoveTask={onMoveTask}
            onTaskClick={onTaskClick}
            onToggleComplete={onToggleComplete}
            onAddTask={onAddTask}
            onDeleteList={onDeleteList}
            onDeleteAllTasks={onDeleteAllTasks}
            onDuplicateList={onDuplicateList}
            onRestoreTask={onRestoreTask}
            onDeleteTask={onDeleteTask}
            setUndoStack={setUndoStack}
            undoStack={undoStack}
          />
        ))}
      </div>
    </aside>
  );
};
