import React from 'react';
import { useMemo } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { usePlannerState } from '@/hooks/usePlannerState';
import { useTheme } from '@/hooks/useTheme';
import { PlannerHeader } from './PlannerHeader';
import { DayColumn } from './DayColumn';
import { BacklogSection, List } from './BacklogSection';
import TaskOverlay from './TaskOverlay';
import { ITask } from '@/types/Task';
import { getWeekdayLabel } from '@/lib/utils';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { useAuth } from '@/hooks/useAuth';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from './ui/dropdown-menu';
import { IconSettings, IconList, IconSun, IconMoon, IconAuto } from './ui/icons';
import { AvatarButton } from './ui/avatar-button';

export const PlannerView = () => {
  const { isDark, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const {
    periodData,
    backlogData,
    isOverlayOpen,
    setIsOverlayOpen,
    selectedTask,
    handleTaskClick,
    handleToggleComplete,
    handleSaveNewTask,
    handleSaveTask,
    handleDeleteTask,
    handleDuplicateTask,
    handleAddTask,
    handleMoveTask,
    periodDates,
    selectedDate,
    newTaskContext,
    sections,
    handleAddList,
    handleDeleteList,
    handleDuplicateList,
  } = usePlannerState();

  const safePeriodDates = Array.isArray(periodDates) ? periodDates : [];

  const taskForOverlay = useMemo(() => {
    if (selectedTask) return selectedTask;
    if (isOverlayOpen && !selectedTask) {
      return {
        id: '',
        title: '',
        description: null,
        day: newTaskContext.day || null,
        section: newTaskContext.section || null,
        time_estimate: null,
        is_completed: false,
        color: null,
        user_id: '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      } as ITask;
    }
    return null;
  }, [selectedTask, isOverlayOpen, newTaskContext]);

  const displayDateForOverlay = useMemo(() => {
    if (!isOverlayOpen || !taskForOverlay) return null;
    const day = taskForOverlay.day;
    if (!day) return new Date();
    const dateInfo = safePeriodDates.find((d) => d.date === day);
    return dateInfo ? dateInfo.fullDate : new Date();
  }, [isOverlayOpen, taskForOverlay, safePeriodDates]);

  const handleSave = (taskData: Partial<ITask>) => {
    if (taskData.id) {
      handleSaveTask(taskData.id, taskData);
    } else {
      handleSaveNewTask(taskData);
    }
  };

  // Формируем списки на основе sections
  const backlogLists: List[] = useMemo(() => {
    return sections.map(section => ({
      id: section.id,
      name: section.name,
      icon: section.id === 'inbox' ? <IconList className="w-4 h-4" /> : <span>📁</span>,
      tasks: backlogData.filter(task => (task.section || 'inbox') === section.id),
    }));
  }, [sections, backlogData]);

  // Новый переключатель темы с 3 состояниями
  const [themeMode, setThemeMode] = React.useState<'auto' | 'light' | 'dark'>(() => {
    const saved = localStorage.getItem('theme-mode');
    if (saved === 'light' || saved === 'dark' || saved === 'auto') return saved;
    return 'auto';
  });

  React.useEffect(() => {
    localStorage.setItem('theme-mode', themeMode);
    if (themeMode === 'auto') {
      const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.classList.toggle('dark', systemDark);
    } else {
      document.documentElement.classList.toggle('dark', themeMode === 'dark');
    }
  }, [themeMode]);

  const handleThemeModeSwitch = () => {
    setThemeMode((prev) =>
      prev === 'auto' ? 'light' : prev === 'light' ? 'dark' : 'auto'
    );
  };

  const handleDeleteAllTasks = (listId: string) => {
    const tasksToDelete = backlogData.filter(task => (task.section || 'inbox') === listId);
    tasksToDelete.forEach(task => handleDeleteTask(task.id));
  };

  const handleRestoreTask = (task: ITask) => {
    handleSaveNewTask(task);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex flex-row h-screen w-full bg-fill-prim font-sans text-content-prim lg:flex-row flex-col">
        {/* nav-global */}
        <nav className="flex flex-col items-center justify-between w-16 min-w-16 h-screen max-h-screen py-4 bg-bg-sec border-r border-brd-prim flex-shrink-0 overflow-hidden">
          <div className="flex flex-col items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <AvatarButton user={user} />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-style-p-m-semibold leading-none">{user?.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={logout} className="cursor-pointer text-style-p-m">
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <button
              className="inline-flex items-center justify-center h-9 w-9 min-w-[36px] min-h-[36px] p-2 rounded-[8px] bg-transparent text-content-prim hover:bg-fill-sec active:bg-fill-prim disabled:opacity-60 focus-visible:ring-2 focus-visible:ring-accent-prim focus-visible:ring-offset-2 transition-colors"
              title="Theme Mode"
              onClick={handleThemeModeSwitch}
            >
              {themeMode === 'auto' && <IconAuto size="l" />}
              {themeMode === 'light' && <IconSun size="l" />}
              {themeMode === 'dark' && <IconMoon size="l" />}
            </button>
          </div>
        </nav>
        {/* backlog (вторая колонка) */}
        <aside className="backlog lg:w-64 w-full h-screen max-h-screen overflow-y-auto flex-shrink-0 bg-bg-sec">
          <BacklogSection
            lists={backlogLists}
            onAddList={handleAddList}
            onSettingsClick={() => {}}
            onAddTask={section => handleAddTask(undefined, section)}
            onTaskClick={handleTaskClick}
            onToggleComplete={handleToggleComplete}
            onMoveTask={(taskId, source, target) => handleMoveTask(taskId, { section: source.section }, { section: target.section })}
            onDuplicateList={handleDuplicateList}
            onDeleteAllTasks={handleDeleteAllTasks}
            onDeleteTask={handleDeleteTask}
            onRestoreTask={handleRestoreTask}
            onDeleteList={handleDeleteList}
          />
        </aside>
        {/* content (третья колонка) */}
        <div className="flex-1 h-screen max-h-screen overflow-y-auto flex flex-col min-w-0 bg-bg-prim">
          <PlannerHeader />
          <div 
            className="grid flex-1 min-w-0"
            style={{ gridTemplateColumns: `repeat(${safePeriodDates.length}, 1fr)`, gridTemplateRows: 'auto 1fr' }}
          >
            {safePeriodDates.map(({ date }) => (
              <div className="min-w-0" key={date}>
                <DayColumn
                  key={date}
                  dayName={getWeekdayLabel(date)}
                  date={date}
                  tasks={periodData[date]}
                  isActive={date === selectedDate.toISOString().slice(0, 10)}
                  onTaskClick={handleTaskClick}
                  onToggleComplete={handleToggleComplete}
                  onAddTask={handleAddTask}
                  onMoveTask={handleMoveTask}
                />
              </div>
            ))}
          </div>
          <TaskOverlay 
            isOpen={isOverlayOpen}
            onClose={() => setIsOverlayOpen(false)}
            task={taskForOverlay}
            displayDate={displayDateForOverlay}
            onSave={handleSave}
            onDelete={handleDeleteTask}
            onDuplicate={handleDuplicateTask}
          />
        </div>
      </div>
    </DndProvider>
  );
};
