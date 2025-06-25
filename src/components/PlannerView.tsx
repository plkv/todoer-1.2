import { useMemo } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { usePlannerState } from '@/hooks/usePlannerState';
import { useTheme } from '@/hooks/useTheme';
import { PlannerHeader } from './PlannerHeader';
import { DayColumn } from './DayColumn';
import { BacklogSection } from './BacklogSection';
import TaskOverlay from './TaskOverlay';
import { ITask } from '@/types/Task';
import { getWeekdayLabel } from '@/lib/utils';

export const PlannerView = () => {
  const { isDark } = useTheme();
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

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex h-screen w-full flex-col bg-fill-prim font-sans text-content-prim">
        <PlannerHeader />
        <div 
          className="grid flex-1"
          style={{ gridTemplateColumns: `repeat(${safePeriodDates.length}, 1fr)`, gridTemplateRows: 'auto 1fr' }}
        >
          {safePeriodDates.map(({ date }) => (
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
          ))}
        </div>
        <div className="border-t-brd-prim">
        <BacklogSection
          tasks={backlogData}
          onTaskClick={handleTaskClick}
          onToggleComplete={handleToggleComplete}
            onAddTask={() => handleAddTask(null, 'backlog')}
          onMoveTask={handleMoveTask}
        />
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
    </DndProvider>
  );
};
