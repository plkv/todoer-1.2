import { useMemo } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { usePlannerState } from '@/hooks/usePlannerState';
import { useTheme } from '@/hooks/useTheme';
import { getWeekDates, getCurrentDay } from '@/lib/utils';
import { PlannerHeader } from './PlannerHeader';
import { DayColumn } from './DayColumn';
import { BacklogSection } from './BacklogSection';
import TaskOverlay from './TaskOverlay';
import { ITask } from '@/types/Task';

export const PlannerView = () => {
  const { isDark } = useTheme();
  const {
    weekData,
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
    weekOffset,
    newTaskContext,
  } = usePlannerState();

  const weekDates = useMemo(() => getWeekDates(weekOffset), [weekOffset]);
  const currentDay = useMemo(() => getCurrentDay(), []);

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
    const dateInfo = weekDates.find((d) => d.day === day);
    return dateInfo ? dateInfo.fullDate : new Date();
  }, [isOverlayOpen, taskForOverlay, weekDates]);

  const handleSave = (taskData: Partial<ITask>) => {
    if (taskData.id) {
      handleSaveTask(taskData.id, taskData);
    } else {
      handleSaveNewTask(taskData);
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex h-screen w-full flex-col bg-background font-sans text-foreground">
        <PlannerHeader />
        <div 
          className="grid flex-1"
          style={{ gridTemplateColumns: 'repeat(7, 1fr)', gridTemplateRows: 'auto 1fr' }}
        >
          {weekDates.map(({ day, date }) => (
            <DayColumn
              key={day}
              dayName={day}
              date={date}
              tasks={weekData[day]}
              isActive={weekOffset === 0 && day === currentDay}
              onTaskClick={handleTaskClick}
              onToggleComplete={handleToggleComplete}
              onAddTask={handleAddTask}
              onMoveTask={handleMoveTask}
            />
          ))}
        </div>
        <div className="border-t">
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
