import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Task, WeekData, DayTasks } from '@/types/Task';
import { tasks as tasksApi } from '@/api/client';

// Эта функция-хелпер распределяет плоский список задач по дням и секциям
const distributeTasksToWeek = (tasks: Task[]): WeekData => {
  const weekData: WeekData = {
    'MON': { morning: [], day: [], evening: [] },
    'TUE': { morning: [], day: [], evening: [] },
    'WED': { morning: [], day: [], evening: [] },
    'THU': { morning: [], day: [], evening: [] },
    'FRI': { morning: [], day: [], evening: [] },
    'SAT': { morning: [], day: [], evening: [] },
    'SUN': { morning: [], day: [], evening: [] },
  };

  tasks.forEach(task => {
    if (task.day && task.section && weekData[task.day]) {
      const sectionKey = task.section.toLowerCase() as keyof DayTasks;
      if (weekData[task.day][sectionKey]) {
        weekData[task.day][sectionKey].push(task);
      }
    }
  });

  return weekData;
};

export const usePlannerState = () => {
  const queryClient = useQueryClient();

  const [currentView, setCurrentView] = useState<'Week' | 'Day' | 'Month'>('Week');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [newTaskContext, setNewTaskContext] = useState<{ day?: string; section?: string }>({});

  // Загрузка всех задач с сервера с помощью React Query
  const { data: allTasks = [], isLoading: isLoadingTasks } = useQuery<Task[]>({
    queryKey: ['tasks'],
    queryFn: tasksApi.getAll,
  });

  // Фильтруем задачи на те, что в бэклоге, и те, что на неделе
  const backlogData = allTasks.filter(task => !task.day || !task.section);
  const weekTasks = allTasks.filter(task => task.day && task.section);
  const weekData = distributeTasksToWeek(weekTasks);

  // --- МУТАЦИИ (создание, обновление, удаление) ---
  
  const mutationOptions = {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      setIsOverlayOpen(false);
      setSelectedTask(null);
    },
    onError: (error: any) => {
      console.error("Ошибка при выполнении операции:", error);
      // Здесь можно было бы показать toast с ошибкой
    },
  };

  const createTaskMutation = useMutation({
    mutationFn: (newTaskData: Omit<Task, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => tasksApi.create(newTaskData),
    ...mutationOptions,
  });
  
  const updateTaskMutation = useMutation({
    mutationFn: ({ taskId, data }: { taskId: string; data: Partial<Task> }) => tasksApi.update(taskId, data),
    ...mutationOptions,
  });

  const deleteTaskMutation = useMutation({
    mutationFn: (taskId: string) => tasksApi.delete(taskId),
    ...mutationOptions,
  });

  // --- ОБРАБОТЧИКИ ДЕЙСТВИЙ ---

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
  }) => {
    createTaskMutation.mutate({
      title: taskData.title,
      description: taskData.description,
      color: taskData.color,
      is_completed: false,
      day: newTaskContext.day || null,
      section: newTaskContext.section || null,
      time_estimate: taskData.timeEstimate,
    });
    setNewTaskContext({});
  };

  const handleSaveTask = (taskId: string, taskData: {
    title: string;
    description: string;
    timeEstimate: string;
    color: string;
    isCompleted: boolean;
  }) => {
    updateTaskMutation.mutate({ taskId, data: {
      title: taskData.title,
      description: taskData.description,
      time_estimate: taskData.timeEstimate,
      color: taskData.color,
      is_completed: taskData.isCompleted
    } });
  };
  
  const handleToggleComplete = (taskId: string, completed: boolean) => {
    const task = allTasks.find(t => t.id === taskId);
    if(task) {
      updateTaskMutation.mutate({ taskId, data: { is_completed: completed } });
    }
  };

  const handleDeleteTask = (taskId: string) => {
    deleteTaskMutation.mutate(taskId);
  };

  const handleMoveTask = (
    taskId: string,
    sourceLocation: { day?: string; section?: string },
    targetLocation: { day?: string; section?: string }
  ) => {
    const task = allTasks.find(t => t.id === taskId);
    if (task) {
        updateTaskMutation.mutate({ 
            taskId, 
            data: { 
                day: targetLocation.day || null,
                section: targetLocation.section || null
            } 
        });
    }
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsOverlayOpen(true);
  };
  
  // Функции, которые пока не используются с API (пагинация по неделям)
  // Их нужно будет реализовывать отдельно на бэкенде
  const [weekOffset, setWeekOffset] = useState(0); 
  const handlePrevWeek = () => setWeekOffset(prev => prev - 1);
  const handleNextWeek = () => setWeekOffset(prev => prev + 1);


  return {
    currentView,
    setCurrentView,
    weekData,
    backlogData,
    isLoadingTasks,
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
    handleDeleteTask,
  };
};
