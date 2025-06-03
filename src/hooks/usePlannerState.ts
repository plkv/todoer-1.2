
import { useState } from 'react';
import { Task, WeekData, DayTasks } from '@/types/Task';
import { initialWeekData, backlogTasks, generateId } from '@/data/mockData';

export const usePlannerState = () => {
  const [currentView, setCurrentView] = useState<'Week' | 'Day' | 'Month'>('Week');
  const [weekData, setWeekData] = useState<WeekData>(initialWeekData);
  const [backlogData, setBacklogData] = useState<Task[]>(backlogTasks);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [isNewTaskOverlayOpen, setIsNewTaskOverlayOpen] = useState(false);
  const [newTaskContext, setNewTaskContext] = useState<{ day?: string; section?: string }>({});

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsOverlayOpen(true);
  };

  const handleToggleComplete = (taskId: string, completed: boolean) => {
    setWeekData(prev => {
      const newData = { ...prev };
      Object.keys(newData).forEach(day => {
        ['morning', 'day', 'evening'].forEach(timeSection => {
          const section = newData[day][timeSection as keyof DayTasks];
          const taskIndex = section.findIndex(task => task.id === taskId);
          if (taskIndex !== -1) {
            section[taskIndex] = { ...section[taskIndex], isCompleted: completed };
          }
        });
      });
      return newData;
    });

    setBacklogData(prev => 
      prev.map(task => 
        task.id === taskId ? { ...task, isCompleted: completed } : task
      )
    );
  };

  const handleAddTask = (day?: string, section?: string) => {
    setNewTaskContext({ day, section });
    setIsNewTaskOverlayOpen(true);
  };

  const handleSaveNewTask = (taskData: {
    title: string;
    description: string;
    timeEstimate: string;
    color: string;
    isCompleted: boolean;
  }) => {
    const newTask: Task = {
      id: generateId(),
      title: taskData.title,
      isCompleted: taskData.isCompleted,
      timeEstimate: taskData.timeEstimate,
      color: taskData.color
    };

    const { day, section } = newTaskContext;

    if (day && section) {
      setWeekData(prev => ({
        ...prev,
        [day]: {
          ...prev[day],
          [section.toLowerCase()]: [...prev[day][section.toLowerCase() as keyof DayTasks], newTask]
        }
      }));
    } else {
      setBacklogData(prev => [...prev, newTask]);
    }

    setNewTaskContext({});
  };

  const handleMoveTask = (
    taskId: string, 
    sourceLocation: { day?: string; section?: string }, 
    targetLocation: { day?: string; section?: string }
  ) => {
    console.log('Moving task:', { taskId, sourceLocation, targetLocation });
    console.log('Source section:', sourceLocation.section, 'Target section:', targetLocation.section);
    console.log('Same day?', sourceLocation.day === targetLocation.day);
    console.log('Same section?', sourceLocation.section?.toUpperCase() === targetLocation.section?.toUpperCase());
    
    // Проверяем, перетягиваем ли мы в ту же секцию
    const isSameLocation = sourceLocation.day === targetLocation.day && 
                          sourceLocation.section?.toUpperCase() === targetLocation.section?.toUpperCase();
    
    console.log('Is same location?', isSameLocation);
    
    // Найти задачу для перемещения/дублирования
    let taskToMove: Task | null = null;
    
    // Найти задачу в исходном местоположении
    if (sourceLocation.day && sourceLocation.section) {
      const sourceSection = weekData[sourceLocation.day][sourceLocation.section.toLowerCase() as keyof DayTasks];
      taskToMove = sourceSection.find(task => task.id === taskId) || null;
    } else {
      taskToMove = backlogData.find(task => task.id === taskId) || null;
    }
    
    if (!taskToMove) {
      console.log('Task not found');
      return;
    }
    
    if (isSameLocation) {
      // Если перетягиваем в ту же секцию - создаем дубликат
      console.log('Same location, creating duplicate');
      const duplicatedTask: Task = {
        ...taskToMove,
        id: generateId()
      };
      
      if (targetLocation.day && targetLocation.section) {
        setWeekData(prev => ({
          ...prev,
          [targetLocation.day!]: {
            ...prev[targetLocation.day!],
            [targetLocation.section!.toLowerCase()]: [
              ...prev[targetLocation.day!][targetLocation.section!.toLowerCase() as keyof DayTasks],
              duplicatedTask
            ]
          }
        }));
      } else {
        setBacklogData(prev => [...prev, duplicatedTask]);
      }
    } else {
      // Если перетягиваем в другую секцию - перемещаем задачу
      console.log('Different location, moving task');
      
      // Удалить из источника
      if (sourceLocation.day && sourceLocation.section) {
        setWeekData(prev => ({
          ...prev,
          [sourceLocation.day!]: {
            ...prev[sourceLocation.day!],
            [sourceLocation.section!.toLowerCase()]: prev[sourceLocation.day!][sourceLocation.section!.toLowerCase() as keyof DayTasks]
              .filter(task => task.id !== taskId)
          }
        }));
      } else {
        setBacklogData(prev => prev.filter(task => task.id !== taskId));
      }
      
      // Добавить в цель
      if (targetLocation.day && targetLocation.section) {
        setWeekData(prev => ({
          ...prev,
          [targetLocation.day!]: {
            ...prev[targetLocation.day!],
            [targetLocation.section!.toLowerCase()]: [
              ...prev[targetLocation.day!][targetLocation.section!.toLowerCase() as keyof DayTasks],
              taskToMove
            ]
          }
        }));
      } else {
        setBacklogData(prev => [...prev, taskToMove]);
      }
    }
  };

  return {
    currentView,
    setCurrentView,
    weekData,
    backlogData,
    selectedTask,
    isOverlayOpen,
    setIsOverlayOpen,
    isNewTaskOverlayOpen,
    setIsNewTaskOverlayOpen,
    handleTaskClick,
    handleToggleComplete,
    handleAddTask,
    handleSaveNewTask,
    handleMoveTask
  };
};
