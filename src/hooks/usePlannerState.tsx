import React, { useState, useCallback, useContext, createContext as createReactContext, useMemo, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ITask, WeekData, DayTasks } from '../types/Task';
import { tasks as tasksApi } from '../api/client';
import { startOfWeek, addWeeks, subWeeks, isSameWeek } from 'date-fns';
import { toast } from '@/components/ui/sonner';
  
// Эта функция-хелпер распределяет плоский список задач по датам и секциям
const distributeTasksToWeek = (tasks: ITask[], weekDates: { day: string; date: string; fullDate: Date }[]): Record<string, DayTasks> => {
  const weekData: Record<string, DayTasks> = {};
  weekDates.forEach(({ date }) => {
    weekData[date] = { morning: [], day: [], evening: [] };
  });
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

const HISTORY_KEY = 'planner:history';
const SETTINGS_KEY = 'planner:settings';
const HISTORY_LIMIT = 50;

function usePlannerStateImpl() {
  console.log('[toast] usePlannerStateImpl loaded');
  const queryClient = useQueryClient();

  // --- SETTINGS ---
  // Восстанавливаем настройки из localStorage
  const getInitialSettings = () => {
    try {
      const saved = localStorage.getItem(SETTINGS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          currentView: parsed.currentView || 'Week',
          selectedDate: parsed.selectedDate ? new Date(parsed.selectedDate) : new Date(),
        };
      }
    } catch {}
    return { currentView: 'Week', selectedDate: new Date() };
  };
  const [currentView, setCurrentViewState] = useState<'Week' | 'Day'>(getInitialSettings().currentView);
  const [selectedDate, setSelectedDateState] = useState<Date>(getInitialSettings().selectedDate);

  // Сохраняем настройки при изменении
  useEffect(() => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify({ currentView, selectedDate }));
  }, [currentView, selectedDate]);

  const setCurrentView = (view: 'Week' | 'Day') => setCurrentViewState(view);
  const setSelectedDate = (date: Date) => setSelectedDateState(date);

  // --- HISTORY ---
  // Восстанавливаем историю из localStorage
  const getInitialHistory = () => {
    try {
      const saved = localStorage.getItem(HISTORY_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          history: parsed.history || [],
          future: parsed.future || [],
        };
      }
    } catch {}
    return { history: [], future: [] };
  };
  const [history, setHistory] = useState<any[]>(getInitialHistory().history);
  const [future, setFuture] = useState<any[]>(getInitialHistory().future);

  // Сохраняем историю при изменении
  useEffect(() => {
    localStorage.setItem(HISTORY_KEY, JSON.stringify({ history, future }));
  }, [history, future]);

  const [selectedTask, setSelectedTask] = useState<ITask | null>(null);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [newTaskContext, setNewTaskContext] = useState<{ day?: string; section?: string }>({});

  // Получаем массив дат недели, в которую входит selectedDate
  const weekDates = React.useMemo(() => {
    const start = startOfWeek(selectedDate, { weekStartsOn: 1 }); // Пн
    return Array.from({ length: 7 }).map((_, i) => {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      return {
        day: date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase(),
        date: date.toISOString().slice(0, 10),
        fullDate: date,
      };
    });
  }, [selectedDate]);
  const weekDateStrings = weekDates.map(d => d.fullDate.toISOString().slice(0, 10));

  // Загрузка задач за неделю с сервера с помощью React Query
  const weekStart = weekDateStrings[0];
  const weekEnd = weekDateStrings[weekDateStrings.length - 1];
  const { data: allTasks = [], isLoading: isLoadingTasks } = useQuery<ITask[]>({
    queryKey: ['tasks', weekStart, weekEnd],
    queryFn: () => tasksApi.getByDate(weekStart, weekEnd),
  });

  // Фильтруем задачи на те, что в бэклоге, и те, что на неделе
  const backlogData = allTasks.filter(task => !task.day || !task.section);
  const weekTasks = allTasks.filter(task => task.day && weekDateStrings.includes(task.day) && task.section);
  const weekData = distributeTasksToWeek(weekTasks, weekDates);

  // --- Методы смены недели/даты ---
  const handlePrevWeek = () => setSelectedDate(subWeeks(selectedDate, 1));
  const handleNextWeek = () => setSelectedDate(addWeeks(selectedDate, 1));
  const handleDateChange = (date: Date) => setSelectedDate(date);
  const handleToday = () => setSelectedDate(new Date());

  // --- HISTORY HELPERS ---
  const getCurrentState = useCallback(() => allTasks, [allTasks]);
  const restoreState = useCallback((tasks: ITask[]) => {
    // TODO: Можно реализовать через queryClient.setQueryData, если нужно
    // queryClient.setQueryData(['tasks', weekStart, weekEnd], tasks);
    // Но для простоты пока не трогаем сервер, только локально
  }, []);

  const pushHistory = useCallback((snapshot: any) => {
    setHistory((prev) => {
      const next = [...prev, snapshot].slice(-HISTORY_LIMIT);
      return next;
    });
    setFuture([]);
  }, []);

  const undo = useCallback(() => {
    setHistory((prev) => {
      if (prev.length === 0) return prev;
      setFuture((f) => [getCurrentState(), ...f]);
      const last = prev[prev.length - 1];
      restoreState(last);
      return prev.slice(0, -1);
    });
  }, [getCurrentState, restoreState]);

  const redo = useCallback(() => {
    setFuture((prev) => {
      if (prev.length === 0) return prev;
      pushHistory(getCurrentState());
      const next = prev[0];
      restoreState(next);
      return prev.slice(1);
    });
  }, [getCurrentState, pushHistory, restoreState]);

  const isUndoAvailable = history.length > 0;
  const isRedoAvailable = future.length > 0;

  // --- МУТАЦИИ (создание, обновление, удаление) ---
  
  const createTaskMutation = useMutation({
    mutationFn: (newTaskData: Omit<ITask, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => tasksApi.create(newTaskData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      setIsOverlayOpen(false);
      setSelectedTask(null);
      console.log('[toast] onSuccess create');
      toast({ title: 'Задача создана', description: 'Задача успешно создана', variant: 'default' });
    },
    onError: (error: any) => {
      console.error('[toast] Ошибка при создании задачи:', error);
      toast({ title: 'Ошибка при создании задачи', description: error.message, variant: 'destructive' });
    },
  });
  
  const updateTaskMutation = useMutation({
    mutationFn: ({ taskId, data }: { taskId: string; data: Partial<ITask> & { _actionType?: string } }) =>
      tasksApi.update(taskId, data),
    onMutate: async ({ taskId, data }) => {
      await queryClient.cancelQueries({ queryKey: ['tasks'] });
      const previousTasks = queryClient.getQueryData<ITask[]>(['tasks']);
      queryClient.setQueryData<ITask[]>(['tasks'], (oldTasks = []) =>
        oldTasks.map((task) =>
          task.id === taskId ? { ...task, ...data } : task
        )
      );
      return { previousTasks, actionType: data._actionType };
    },
    onError: (err, variables, context) => {
      console.error('[toast] Ошибка обновления задачи, откат:', err);
      if (context?.previousTasks) {
        queryClient.setQueryData(['tasks'], context.previousTasks);
      }
      toast({ title: 'Ошибка обновления задачи', description: err.message, variant: 'destructive' });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
    onSuccess: (data, variables, context) => {
      if (context?.actionType === 'edit') {
        toast({ title: 'Задача обновлена', description: 'Задача успешно обновлена', variant: 'default' });
      } else if (context?.actionType === 'move') {
        toast({ title: 'Задача перемещена', description: 'Задача успешно перемещена', variant: 'default' });
      } else if (context?.actionType === 'complete') {
        toast({ title: 'Статус задачи изменён', description: 'Статус задачи успешно изменён', variant: 'default' });
      }
      setIsOverlayOpen(false);
      setSelectedTask(null);
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: (taskId: string) => tasksApi.delete(taskId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      setIsOverlayOpen(false);
      setSelectedTask(null);
      toast({ title: 'Задача удалена', description: 'Задача успешно удалена', variant: 'default' });
    },
    onError: (error: any) => {
      console.error("Ошибка при удалении задачи:", error);
      toast({ title: 'Ошибка при удалении задачи', description: error.message, variant: 'destructive' });
    },
  });

  // --- ОБРАБОТЧИКИ ДЕЙСТВИЙ ---

  const handleAddTask = (day?: string, section?: string) => {
    setNewTaskContext({ day, section });
    setSelectedTask(null);
    setIsOverlayOpen(true);
  };

  const handleSaveNewTask = (taskData: Partial<Omit<ITask, 'id' | 'user_id' | 'created_at' | 'updated_at'>>) => {
    console.log('[toast] handleSaveNewTask', taskData);
    let day: string | null = null;
    if (newTaskContext.day) {
      day = newTaskContext.day;
    }
    const payload = {
      title: taskData.title || 'Новая задача',
      description: taskData.description || null,
      color: taskData.color || null,
      is_completed: taskData.is_completed || false,
      section: newTaskContext.section || null,
      time_estimate: taskData.time_estimate || null,
      day: day,
    };
    console.log('[toast] createTaskMutation.mutate payload', payload);
    createTaskMutation.mutate(payload);
    console.log('[toast] createTaskMutation.mutate called');
    setNewTaskContext({});
  };

  const handleSaveTask = useCallback((taskId: string, taskData: Partial<ITask> & { _actionType?: string }) => {
    pushHistory(getCurrentState());
    updateTaskMutation.mutate({ taskId, data: { ...taskData, _actionType: 'edit' } as any });
  }, [updateTaskMutation, getCurrentState, pushHistory]);
  
  const handleToggleComplete = (task: ITask, completed: boolean) => {
    pushHistory(getCurrentState());
    updateTaskMutation.mutate({ taskId: task.id, data: { ...task, is_completed: completed, _actionType: 'complete' } as any });
  };

  const handleDeleteTask = useCallback((taskId: string) => {
    pushHistory(getCurrentState());
    deleteTaskMutation.mutate(taskId);
  }, [deleteTaskMutation, getCurrentState, pushHistory]);

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
        toast({ title: 'Задача продублирована', description: 'Копия задачи успешно создана', variant: 'default' });
      },
      onError: (error: any) => {
        toast({ title: 'Ошибка при дублировании задачи', description: error.message, variant: 'destructive' });
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
    pushHistory(getCurrentState());
    const updatedTask = {
      ...taskToMove,
      day: targetLocation.day || null,
      section: targetLocation.section || null,
    };
    updateTaskMutation.mutate({ taskId, data: { ...updatedTask, _actionType: 'move' } as any });
  };

  const handleTaskClick = (task: ITask) => {
    setSelectedTask(task);
    setIsOverlayOpen(true);
  };

  return {
    currentView,
    setCurrentView,
    weekData,
    backlogData,
    isLoadingTasks,
    selectedTask,
    setSelectedTask,
    isOverlayOpen,
    setIsOverlayOpen,
    newTaskContext,
    setNewTaskContext,
    weekDates,
    selectedDate,
    setSelectedDate,
    handlePrevWeek,
    handleNextWeek,
    handleDateChange: setSelectedDate,
    handleToday: () => setSelectedDate(new Date()),
    handleTaskClick,
    handleAddTask,
    handleSaveNewTask,
    handleSaveTask,
    handleToggleComplete,
    handleDeleteTask,
    handleDuplicateTask,
    handleMoveTask,
    undo,
    redo,
    isUndoAvailable,
    isRedoAvailable,
  };
}

const PlannerStateContext = createReactContext<ReturnType<typeof usePlannerStateImpl> | undefined>(undefined);

export const PlannerStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const value = usePlannerStateImpl();
  return (
    <PlannerStateContext.Provider value={value}>
      {children}
    </PlannerStateContext.Provider>
  );
};

export function usePlannerState() {
  const ctx = useContext(PlannerStateContext);
  if (!ctx) throw new Error('usePlannerState must be used within PlannerStateProvider');
  return ctx;
}
