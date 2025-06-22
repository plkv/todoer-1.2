import { useMemo } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { usePlannerState } from '@/hooks/usePlannerState';
import { useTheme } from '@/hooks/useTheme';
import { getWeekDates, getCurrentDay } from '@/lib/utils';
import { PlannerHeader } from './PlannerHeader';
import { DayColumn } from './DayColumn';
import { BacklogSection } from './BacklogSection';
import { TaskOverlay } from './TaskOverlay';
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
    handleAddTask,
    handleMoveTask,
    weekOffset,
  } = usePlannerState();

  const weekDates = useMemo(() => getWeekDates(weekOffset), [weekOffset]);
  const currentDay = useMemo(() => getCurrentDay(), []);

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
          open={isOverlayOpen}
          onOpenChange={setIsOverlayOpen}
          task={selectedTask}
          onSave={handleSave}
          onDelete={handleDeleteTask}
        />
      </div>
    </DndProvider>
  );
};
