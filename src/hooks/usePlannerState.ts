import { useState, useEffect } from 'react';
import { Task, WeekData, DayTasks } from '@/types/Task';
import { initialWeekData, backlogTasks, generateId } from '@/data/mockData';

// Тип для хранения данных всех недель
type WeeksData = Record<string, WeekData>;

export const usePlannerState = () => {
  const [currentView, setCurrentView] = useState<'Week' | 'Day' | 'Month'>('Week');
  const [weekOffset, setWeekOffset] = useState(0);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [newTaskContext, setNewTaskContext] = useState<{ day?: string; section?: string }>({});
  
  // Загрузка всех данных из localStorage
  const loadWeeksData = (): WeeksData => {
    try {
      const data = localStorage.getItem('weeksData');
      return data ? JSON.parse(data) : { '0': initialWeekData };
    } catch {
      return { '0': initialWeekData };
    }
  };

  const [weeksData, setWeeksData] = useState<WeeksData>(loadWeeksData);
  const [backlogData, setBacklogData] = useState<Task[]>(() => {
    try {
      const data = localStorage.getItem('backlogData');
      return data ? JSON.parse(data) : backlogTasks;
    } catch {
      return backlogTasks;
    }
  });

  // Получаем данные текущей недели
  const weekData = weeksData[weekOffset.toString()] || {
    'MON': { morning: [], day: [], evening: [] },
    'TUE': { morning: [], day: [], evening: [] },
    'WED': { morning: [], day: [], evening: [] },
    'THU': { morning: [], day: [], evening: [] },
    'FRI': { morning: [], day: [], evening: [] },
    'SAT': { morning: [], day: [], evening: [] },
    'SUN': { morning: [], day: [], evening: [] }
  };

  // Сохраняем все данные при изменениях
  useEffect(() => {
    localStorage.setItem('weeksData', JSON.stringify(weeksData));
  }, [weeksData]);

  useEffect(() => {
    localStorage.setItem('backlogData', JSON.stringify(backlogData));
  }, [backlogData]);

  const handlePrevWeek = () => {
    setWeekOffset(prev => prev - 1);
  };

  const handleNextWeek = () => {
    setWeekOffset(prev => prev + 1);
  };

  const handleToggleComplete = (taskId: string, completed: boolean) => {
    setWeeksData(prev => {
      const newData = { ...prev };
      const currentWeek = newData[weekOffset.toString()] || { ...weekData };
      
      Object.keys(currentWeek).forEach(day => {
        ['morning', 'day', 'evening'].forEach(timeSection => {
          const section = currentWeek[day][timeSection as keyof DayTasks];
          const taskIndex = section.findIndex(task => task.id === taskId);
          if (taskIndex !== -1) {
            section[taskIndex] = { ...section[taskIndex], isCompleted: completed };
          }
        });
      });

      newData[weekOffset.toString()] = currentWeek;
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
    setSelectedTask(null);
    setIsOverlayOpen(true);
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
      color: taskData.color,
      description: taskData.description
    };

    const { day, section } = newTaskContext;

    if (day && section) {
      setWeeksData(prev => {
        const newData = { ...prev };
        const currentWeek = newData[weekOffset.toString()] || { ...weekData };
        
        currentWeek[day] = {
          ...currentWeek[day],
          [section.toLowerCase()]: [...currentWeek[day][section.toLowerCase() as keyof DayTasks], newTask]
        };

        newData[weekOffset.toString()] = currentWeek;
        return newData;
      });
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
    const isSameLocation = sourceLocation.day === targetLocation.day && 
                          sourceLocation.section?.toUpperCase() === targetLocation.section?.toUpperCase();
    
    let taskToMove: Task | null = null;
    
    if (sourceLocation.day && sourceLocation.section) {
      const sourceWeek = weeksData[weekOffset.toString()] || weekData;
      const sourceSection = sourceWeek[sourceLocation.day][sourceLocation.section.toLowerCase() as keyof DayTasks];
      taskToMove = sourceSection.find(task => task.id === taskId) || null;
    } else {
      taskToMove = backlogData.find(task => task.id === taskId) || null;
    }
    
    if (!taskToMove) return;
    
    if (isSameLocation) {
      const duplicatedTask: Task = {
        ...taskToMove,
        id: generateId()
      };
      
      if (targetLocation.day && targetLocation.section) {
        setWeeksData(prev => {
          const newData = { ...prev };
          const currentWeek = newData[weekOffset.toString()] || { ...weekData };
          
          currentWeek[targetLocation.day!] = {
            ...currentWeek[targetLocation.day!],
            [targetLocation.section!.toLowerCase()]: [
              ...currentWeek[targetLocation.day!][targetLocation.section!.toLowerCase() as keyof DayTasks],
              duplicatedTask
            ]
          };

          newData[weekOffset.toString()] = currentWeek;
          return newData;
        });
      } else {
        setBacklogData(prev => [...prev, duplicatedTask]);
      }
    } else {
      if (sourceLocation.day && sourceLocation.section) {
        setWeeksData(prev => {
          const newData = { ...prev };
          const currentWeek = newData[weekOffset.toString()] || { ...weekData };
          
          currentWeek[sourceLocation.day!] = {
            ...currentWeek[sourceLocation.day!],
            [sourceLocation.section!.toLowerCase()]: currentWeek[sourceLocation.day!][sourceLocation.section!.toLowerCase() as keyof DayTasks]
              .filter(task => task.id !== taskId)
          };

          newData[weekOffset.toString()] = currentWeek;
          return newData;
        });
      } else {
        setBacklogData(prev => prev.filter(task => task.id !== taskId));
      }
      
      if (targetLocation.day && targetLocation.section) {
        setWeeksData(prev => {
          const newData = { ...prev };
          const currentWeek = newData[weekOffset.toString()] || { ...weekData };
          
          currentWeek[targetLocation.day!] = {
            ...currentWeek[targetLocation.day!],
            [targetLocation.section!.toLowerCase()]: [
              ...currentWeek[targetLocation.day!][targetLocation.section!.toLowerCase() as keyof DayTasks],
              taskToMove
            ]
          };

          newData[weekOffset.toString()] = currentWeek;
          return newData;
        });
      } else {
        setBacklogData(prev => [...prev, taskToMove]);
      }
    }
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsOverlayOpen(true);
  };

  const handleSaveTask = (taskId: string, taskData: {
    title: string;
    description: string;
    timeEstimate: string;
    color: string;
    isCompleted: boolean;
  }) => {
    setWeeksData(prev => {
      const newData = { ...prev };
      const currentWeek = newData[weekOffset.toString()] || { ...weekData };
      
      Object.keys(currentWeek).forEach(day => {
        ['morning', 'day', 'evening'].forEach(timeSection => {
          const section = currentWeek[day][timeSection as keyof DayTasks];
          const taskIndex = section.findIndex(task => task.id === taskId);
          if (taskIndex !== -1) {
            section[taskIndex] = { 
              ...section[taskIndex],
              title: taskData.title,
              description: taskData.description,
              timeEstimate: taskData.timeEstimate,
              color: taskData.color,
              isCompleted: taskData.isCompleted
            };
          }
        });
      });

      newData[weekOffset.toString()] = currentWeek;
      return newData;
    });

    setBacklogData(prev => 
      prev.map(task => 
        task.id === taskId ? {
          ...task,
          title: taskData.title,
          description: taskData.description,
          timeEstimate: taskData.timeEstimate,
          color: taskData.color,
          isCompleted: taskData.isCompleted
        } : task
      )
    );
  };

  const handleDeleteTask = (taskId: string) => {
    setWeeksData(prev => {
      const newData = { ...prev };
      const currentWeek = newData[weekOffset.toString()] || { ...weekData };
      
      Object.keys(currentWeek).forEach(day => {
        ['morning', 'day', 'evening'].forEach(timeSection => {
          currentWeek[day][timeSection as keyof DayTasks] = 
            currentWeek[day][timeSection as keyof DayTasks].filter(task => task.id !== taskId);
        });
      });

      newData[weekOffset.toString()] = currentWeek;
      return newData;
    });

    setBacklogData(prev => prev.filter(task => task.id !== taskId));
  };

  return {
    currentView,
    setCurrentView,
    weekData,
    backlogData,
    selectedTask,
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
    handleSaveTask,
    handleDeleteTask
  };
};
