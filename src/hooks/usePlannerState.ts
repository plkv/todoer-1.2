import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ITask, WeekData, DayTasks } from '@/types/Task';
import { tasks as tasksApi } from '@/api/client';
  
// Эта функция-хелпер распределяет плоский список задач по дням и секциям
const distributeTasksToWeek = (tasks: ITask[]): WeekData => {
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
  const [selectedTask, setSelectedTask] = useState<ITask | null>(null);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [newTaskContext, setNewTaskContext] = useState<{ day?: string; section?: string }>({});
  const [history, setHistory] = useState<any[]>([]);
  const [future, setFuture] = useState<any[]>([]);

  // Загрузка всех задач с сервера с помощью React Query
  const { data: allTasks = [], isLoading: isLoadingTasks } = useQuery<ITask[]>({
    queryKey: ['tasks'],
    queryFn: tasksApi.getAll,
  });

  // Фильтруем задачи на те, что в бэклоге, и те, что на неделе
  const backlogData = allTasks.filter(task => !task.day || !task.section);
  const weekTasks = allTasks.filter(task => task.day && task.section);
  const weekData = distributeTasksToWeek(weekTasks);

  // Сохраняем снапшот для undo
  const pushHistory = useCallback((snapshot: any) => {
    setHistory((prev) => [...prev, snapshot]);
    setFuture([]);
  }, []);

  // Undo
  const undo = useCallback(() => {
    setHistory((prev) => {
      if (prev.length === 0) return prev;
      setFuture((f) => [getCurrentState(), ...f]);
      const last = prev[prev.length - 1];
      restoreState(last);
      return prev.slice(0, -1);
    });
  }, []);

  // Redo
  const redo = useCallback(() => {
    setFuture((prev) => {
      if (prev.length === 0) return prev;
      pushHistory(getCurrentState());
      const next = prev[0];
      restoreState(next);
      return prev.slice(1);
    });
  }, [pushHistory]);

  // Получить текущий state (allTasks)
  const getCurrentState = useCallback(() => {
    return allTasks;
  }, [allTasks]);

  // Восстановить state (allTasks)
  const restoreState = useCallback((snapshot: any) => {
    queryClient.setQueryData(['tasks'], snapshot);
  }, [queryClient]);

  // --- МУТАЦИИ (создание, обновление, удаление) ---
  
  const createTaskMutation = useMutation({
    mutationFn: (newTaskData: Omit<ITask, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => tasksApi.create(newTaskData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      setIsOverlayOpen(false);
      setSelectedTask(null);
    },
    onError: (error: any) => {
      console.error("Ошибка при создании задачи:", error);
    },
  });
  
  const updateTaskMutation = useMutation({
    mutationFn: ({ taskId, data }: { taskId: string; data: Partial<ITask> }) =>
      tasksApi.update(taskId, data),
    onMutate: async ({ taskId, data }) => {
      await queryClient.cancelQueries({ queryKey: ['tasks'] });
      const previousTasks = queryClient.getQueryData<ITask[]>(['tasks']);
      queryClient.setQueryData<ITask[]>(['tasks'], (oldTasks = []) =>
        oldTasks.map((task) =>
          task.id === taskId ? { ...task, ...data } : task
        )
      );
      return { previousTasks };
    },
    onError: (err, variables, context) => {
      console.error("Ошибка обновления задачи, откат:", err);
      if (context?.previousTasks) {
        queryClient.setQueryData(['tasks'], context.previousTasks);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: (taskId: string) => tasksApi.delete(taskId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      setIsOverlayOpen(false);
      setSelectedTask(null);
    },
    onError: (error: any) => {
      console.error("Ошибка при удалении задачи:", error);
    },
  });

  // --- ОБРАБОТЧИКИ ДЕЙСТВИЙ ---

  const handleAddTask = (day?: string, section?: string) => {
    setNewTaskContext({ day, section });
    setSelectedTask(null);
    setIsOverlayOpen(true);
  };

  const handleSaveNewTask = (taskData: Partial<Omit<ITask, 'id' | 'user_id' | 'created_at' | 'updated_at'>>) => {
    createTaskMutation.mutate({
      title: taskData.title || 'Новая задача',
      description: taskData.description || null,
      color: taskData.color || null,
      is_completed: taskData.is_completed || false,
      day: newTaskContext.day || null,
      section: newTaskContext.section || null,
      time_estimate: taskData.time_estimate || null,
    });
    setNewTaskContext({});
  };

  const handleSaveTask = useCallback((taskId: string, taskData: Partial<ITask>) => {
    pushHistory(getCurrentState());
    updateTaskMutation.mutate(
      { taskId, data: taskData },
      {
        onSuccess: () => {
          setIsOverlayOpen(false);
          setSelectedTask(null);
        },
      }
    );
  }, [getCurrentState, pushHistory, updateTaskMutation]);
  
  const handleToggleComplete = (task: ITask, completed: boolean) => {
    updateTaskMutation.mutate({
      taskId: task.id,
      data: { ...task, is_completed: completed },
    });
  };

  const handleDeleteTask = useCallback((taskId: string) => {
    pushHistory(getCurrentState());
    deleteTaskMutation.mutate(taskId);
  }, [getCurrentState, pushHistory, deleteTaskMutation]);

  const handleDuplicateTask = (taskToDuplicate: ITask) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, created_at, updated_at, user_id, ...taskData } = taskToDuplicate;
    createTaskMutation.mutate({
      ...taskData,
      title: `${taskData.title} (Copy)`, // Add (Copy) to the title
    }, {
      onSuccess: () => {
        setIsOverlayOpen(false);
        setSelectedTask(null);
      }
    });
  };

  const handleMoveTask = (
    taskId: string, 
    sourceLocation: { day?: string; section?: string }, 
    targetLocation: { day?: string; section?: string }
  ) => {
    const taskToMove = allTasks.find(t => t.id === taskId);
    if (!taskToMove) return;
    
    const updatedTask = {
        ...taskToMove,
      day: targetLocation.day || null,
      section: targetLocation.section || null,
    };

    pushHistory(getCurrentState());
    updateTaskMutation.mutate({ 
      taskId, 
      data: updatedTask 
    });
  };

  const handleTaskClick = (task: ITask) => {
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
    handleDuplicateTask,
    newTaskContext,
    undo,
    redo,
  };
};
