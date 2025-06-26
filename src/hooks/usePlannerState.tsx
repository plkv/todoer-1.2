import React, { useState, useCallback, useContext, createContext as createReactContext, useMemo, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ITask, WeekData, DayTasks } from '../types/Task';
import { tasks as tasksApi } from '../api/client';
import { startOfWeek, addWeeks, subWeeks, isSameWeek } from 'date-fns';
import { toast } from '@/components/ui/sonner';
import { getWeekDateStrings, getMonthDateStrings, getDayDateString, getWeekdayLabel } from '@/lib/utils';
  
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

// Добавляем типы для режима просмотра и периода
export type CalendarView = 'Day' | 'Week' | 'Month';

function getMonthDates(date: Date) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const days: { day: string; date: string; fullDate: Date }[] = [];
  for (let d = new Date(firstDay); d <= lastDay; d.setDate(d.getDate() + 1)) {
    days.push({
      day: d.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase(),
      date: d.toISOString().slice(0, 10),
      fullDate: new Date(d),
    });
  }
  return days;
}

function getDayDate(date: Date) {
  return [{
    day: date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase(),
    date: date.toISOString().slice(0, 10),
    fullDate: date,
  }];
}

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
  const [currentView, setCurrentViewState] = useState<CalendarView>(getInitialSettings().currentView);
  const [selectedDate, setSelectedDateState] = useState<Date>(getInitialSettings().selectedDate);

  // Сохраняем настройки при изменении
  useEffect(() => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify({ currentView, selectedDate }));
  }, [currentView, selectedDate]);

  const setCurrentView = (view: CalendarView) => setCurrentViewState(view);
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

  // --- ПЕРИОД КАЛЕНДАРЯ ---
  const periodDateStrings = useMemo(() => {
    if (currentView === 'Day') return [getDayDateString(selectedDate)];
    if (currentView === 'Month') return getMonthDateStrings(selectedDate);
    // Week по умолчанию
    return getWeekDateStrings(selectedDate);
  }, [selectedDate, currentView]);

  // --- API ---
  const periodStart = periodDateStrings[0];
  const periodEnd = periodDateStrings[periodDateStrings.length - 1];
  const { data: allTasks = [], isLoading: isLoadingTasks } = useQuery<ITask[]>({
    queryKey: ['tasks', periodStart, periodEnd],
    queryFn: () => tasksApi.getByDate(periodStart, periodEnd),
  });

  // Фильтруем задачи на те, что в бэклоге, и те, что в периоде
  const backlogData = allTasks.filter(task => !task.day || !task.section);
  const periodTasks = allTasks.filter(task => task.day && periodDateStrings.includes(task.day) && task.section);

  // --- Данные для UI: periodDates ---
  const periodDates = useMemo(() =>
    periodDateStrings.map(date => ({
      date,
      dayName: getWeekdayLabel(date),
      fullDate: new Date(date),
    })),
    [periodDateStrings]
  );

  // --- Распределение задач по датам и секциям ---
  const distributeTasksToPeriod = (tasks: ITask[], dateStrings: string[]): Record<string, DayTasks> => {
    const data: Record<string, DayTasks> = {};
    dateStrings.forEach(date => {
      data[date] = { morning: [], day: [], evening: [] };
    });
    tasks.forEach(task => {
      if (task.day && task.section && data[task.day]) {
        const sectionKey = task.section.toLowerCase() as keyof DayTasks;
        if (data[task.day][sectionKey]) {
          data[task.day][sectionKey].push(task);
        }
      }
    });
    return data;
  };
  const periodData = distributeTasksToPeriod(periodTasks, periodDateStrings);

  // --- Методы перехода ---
  const goToDate = (date: Date) => setSelectedDate(date);
  const goToWeek = (date: Date) => {
    setCurrentView('Week');
    setSelectedDate(date);
  };
  const goToMonth = (date: Date) => {
    setCurrentView('Month');
    setSelectedDate(date);
  };

  // --- Методы смены периода ---
  const handlePrevPeriod = () => {
    if (currentView === 'Day') setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate() - 1));
    else if (currentView === 'Week') setSelectedDate(subWeeks(selectedDate, 1));
    else if (currentView === 'Month') setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1));
  };
  const handleNextPeriod = () => {
    if (currentView === 'Day') setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate() + 1));
    else if (currentView === 'Week') setSelectedDate(addWeeks(selectedDate, 1));
    else if (currentView === 'Month') setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1));
  };

  // --- HISTORY HELPERS ---
  const getCurrentState = useCallback(() => allTasks, [allTasks]);
  const restoreState = useCallback((tasks: ITask[]) => {
    // TODO: Можно реализовать через queryClient.setQueryData, если нужно
    // queryClient.setQueryData(['tasks', periodStart, periodEnd], tasks);
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
      toast('Задача создана', { description: 'Задача успешно создана' });
    },
    onError: (error: any) => {
      console.error('[toast] Ошибка при создании задачи:', error);
      toast('Ошибка при создании задачи', { description: error.message });
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
      toast('Ошибка обновления задачи', { description: err.message });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
    onSuccess: (data, variables, context) => {
      if (context?.actionType === 'edit') {
        toast('Задача обновлена', { description: 'Задача успешно обновлена' });
      } else if (context?.actionType === 'move') {
        toast('Задача перемещена', { description: 'Задача успешно перемещена' });
      } else if (context?.actionType === 'complete') {
        toast('Статус задачи изменён', { description: 'Статус задачи успешно изменён' });
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
      toast('Задача удалена', { description: 'Задача успешно удалена' });
    },
    onError: (error: any) => {
      console.error("Ошибка при удалении задачи:", error);
      toast('Ошибка при удалении задачи', { description: error.message });
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
        toast('Задача продублирована', { description: 'Копия задачи успешно создана' });
      },
      onError: (error: any) => {
        toast('Ошибка при дублировании задачи', { description: error.message });
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

  // --- SECTIONS (списки) ---
  const SECTIONS_KEY = 'planner:sections';
  const getInitialSections = () => {
    try {
      const saved = localStorage.getItem(SECTIONS_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      { id: 'inbox', name: 'Инбокс' },
    ];
  };
  const [sections, setSections] = useState<{ id: string; name: string }[]>(getInitialSections());
  useEffect(() => {
    localStorage.setItem(SECTIONS_KEY, JSON.stringify(sections));
  }, [sections]);

  const handleAddList = () => {
    const name = window.prompt('Название нового списка');
    if (!name) return;
    const id = name.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now();
    setSections(prev => [...prev, { id, name }]);
  };
  const handleDeleteList = (listId: string) => {
    if (listId === 'inbox') return;
    setSections(prev => prev.filter(s => s.id !== listId));
    // Удалить все задачи с этим section
    // (реализация удаления задач — ниже, если потребуется)
  };
  const handleDuplicateList = (listId: string) => {
    const orig = sections.find(s => s.id === listId);
    if (!orig) return;
    const newName = orig.name + ' (копия)';
    const newId = newName.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now();
    setSections(prev => [...prev, { id: newId, name: newName }]);
    // Дублировать задачи (реализация — ниже, если потребуется)
  };

  return {
    currentView,
    setCurrentView,
    periodData,
    backlogData,
    isLoadingTasks,
    selectedTask,
    setSelectedTask,
    isOverlayOpen,
    setIsOverlayOpen,
    newTaskContext,
    setNewTaskContext,
    periodDates,
    selectedDate,
    setSelectedDate,
    goToDate,
    goToWeek,
    goToMonth,
    handlePrevPeriod,
    handleNextPeriod,
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
    sections,
    handleAddList,
    handleDeleteList,
    handleDuplicateList,
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
