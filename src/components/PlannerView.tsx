
import React, { useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { PlannerHeader } from './PlannerHeader';
import { DayColumn } from './DayColumn';
import { BacklogSection } from './BacklogSection';
import { TaskOverlay } from './TaskOverlay';
import { NewTaskOverlay } from './NewTaskOverlay';
import { lightTheme, darkTheme } from '@/lib/colors';
import { usePlannerState } from '@/hooks/usePlannerState';
import { useTheme } from '@/hooks/useTheme';
import { dates } from '@/data/mockData';

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
    isNewTaskOverlayOpen,
    setIsNewTaskOverlayOpen,
    handleTaskClick,
    handleToggleComplete,
    handleAddTask,
    handleSaveNewTask,
    handleMoveTask
  } = usePlannerState();

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen font-sf-pro" style={{ backgroundColor: colors.bg.primary }}>
        <PlannerHeader 
          currentView={currentView}
          onViewChange={setCurrentView}
          isDark={isDark}
          onThemeToggle={toggleTheme}
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
          {dates.map(({ day, date }) => (
            <DayColumn
              key={day}
              dayName={day}
              date={date}
              tasks={weekData[day]}
              isActive={day === 'WED'}
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
        />

        <NewTaskOverlay
          open={isNewTaskOverlayOpen}
          onOpenChange={setIsNewTaskOverlayOpen}
          onSave={handleSaveNewTask}
        />
      </div>
    </DndProvider>
  );
};
