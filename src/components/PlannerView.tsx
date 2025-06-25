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
import { IconSettings, IconInbox, Icon00 } from './ui/icons';

export const PlannerView = () => {
  const { isDark } = useTheme();
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

  // Группировка задач беклога по section
  const backlogLists: List[] = useMemo(() => {
    // Собираем уникальные секции (section) из задач беклога
    const sectionMap: Record<string, { name: string; icon: React.ReactNode }> = {
      inbox: { name: 'Инбокс', icon: <IconInbox className="w-4 h-4" /> },
      // Можно добавить дефолтные иконки для других секций
    };
    // Собираем все секции
    backlogData.forEach(task => {
      const section = (task.section || 'inbox').toLowerCase();
      if (!sectionMap[section]) {
        sectionMap[section] = { name: section.charAt(0).toUpperCase() + section.slice(1), icon: <span>📁</span> };
      }
    });
    // Формируем массив списков
    return Object.entries(sectionMap).map(([section, meta]) => ({
      id: section,
      name: meta.name,
      icon: meta.icon,
      tasks: backlogData.filter(task => (task.section || 'inbox').toLowerCase() === section),
    }));
  }, [backlogData]);

  // Добавление нового списка (section)
  const handleAddList = () => {
    // Пример: prompt для имени списка, можно заменить на модалку
    const name = window.prompt('Название нового списка');
    if (!name) return;
    // Создаём фиктивную задачу для появления списка (или реализовать отдельную сущность "список")
    handleSaveNewTask({ title: 'Новая задача', section: name });
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex flex-row h-screen w-full bg-fill-prim font-sans text-content-prim lg:flex-row flex-col">
        {/* nav-global */}
        <nav className="flex flex-col items-center justify-between w-16 min-w-16 h-screen max-h-screen py-4 bg-bg-sec border-r border-brd-prim flex-shrink-0 overflow-hidden">
          <div className="flex flex-col items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="h-10 w-10 rounded-full p-0 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-accent-prim">
                  <Avatar>
                    {user?.picture ? (
                      <AvatarImage src={user.picture} alt={user.name || 'User'} />
                    ) : (
                      <AvatarFallback>{user?.name?.[0] || '?'}</AvatarFallback>
                    )}
                  </Avatar>
                </button>
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
            <button className="flex items-center justify-center w-10 h-10 rounded-md hover:bg-fill-prim transition-colors" title="Settings">
              <Icon00 width={20} height={20} />
            </button>
          </div>
        </nav>
        {/* backlog (вторая колонка) */}
        <aside className="backlog lg:w-64 w-full h-screen max-h-screen overflow-y-auto border-r border-brd-prim flex-shrink-0 bg-bg-sec">
          <BacklogSection
            lists={backlogLists}
            onAddList={handleAddList}
            onSettingsClick={() => {}}
            onAddTask={section => handleAddTask(undefined, section)}
            onTaskClick={handleTaskClick}
            onToggleComplete={handleToggleComplete}
            onMoveTask={(taskId, source, target) => handleMoveTask(taskId, { section: source.section }, { section: target.section })}
          />
        </aside>
        {/* content (третья колонка) */}
        <div className="flex-1 h-screen max-h-screen overflow-y-auto flex flex-col min-w-0">
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
