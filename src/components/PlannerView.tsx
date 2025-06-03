import React, { useEffect, useMemo } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { PlannerHeader } from './PlannerHeader';
import { DayColumn } from './DayColumn';
import { BacklogSection } from './BacklogSection';
import { TaskOverlay } from './TaskOverlay';
import { lightTheme, darkTheme } from '@/lib/colors';
import { usePlannerState } from '@/hooks/usePlannerState';
import { useTheme } from '@/hooks/useTheme';
import { getWeekDates, getCurrentDay } from '@/lib/utils';

export const PlannerView = () => {
  const { isDark, toggleTheme } = useTheme();
  const colors = isDark ? darkTheme : lightTheme;
  
  const {
    currentView,
    setCurrentView,
    weekData,
    backlogData,
    isOverlayOpen,
    setIsOverlayOpen,
    handleTaskClick,
    handleToggleComplete,
    handleAddTask,
    handleSaveNewTask,
    handleMoveTask,
    weekOffset,
    handlePrevWeek,
    handleNextWeek,
    selectedTask,
    handleSaveTask,
    handleDeleteTask
  } = usePlannerState();

  const weekDates = useMemo(() => getWeekDates(weekOffset), [weekOffset]);
  const currentDay = useMemo(() => getCurrentDay(), []);

  const handleSaveTaskData = (taskData: {
    id?: string;
    title: string;
    description: string;
    timeEstimate: string;
    color: string;
    isCompleted: boolean;
  }) => {
    if (taskData.id) {
      handleSaveTask(taskData.id, taskData);
    } else {
      handleSaveNewTask(taskData);
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen font-sf-pro" style={{ backgroundColor: colors.bg.primary }}>
        <PlannerHeader 
          currentView={currentView}
          onViewChange={setCurrentView}
          isDark={isDark}
          onThemeToggle={toggleTheme}
          onPrevWeek={handlePrevWeek}
          onNextWeek={handleNextWeek}
        />
        
        {/* Week Grid */}
        <div 
          className="grid grid-cols-7"
          style={{ 
            backgroundColor: 'transparent',
            paddingLeft: '6px',
            paddingRight: '6px',
            gap: '4px',
            gridTemplateRows: 'auto auto minmax(140px, auto) minmax(140px, auto) minmax(140px, auto)'
          }}
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
              onAddTask={(dayName, section) => handleAddTask(dayName, section)}
              onMoveTask={handleMoveTask}
              isDark={isDark}
            />
          ))}
        </div>

        <BacklogSection
          tasks={backlogData}
          onTaskClick={handleTaskClick}
          onToggleComplete={handleToggleComplete}
          onAddTask={() => handleAddTask()}
          onMoveTask={handleMoveTask}
        />

        <TaskOverlay 
          open={isOverlayOpen}
          onOpenChange={setIsOverlayOpen}
          task={selectedTask}
          onSave={handleSaveTaskData}
          onDelete={handleDeleteTask}
        />
      </div>
    </DndProvider>
  );
};
