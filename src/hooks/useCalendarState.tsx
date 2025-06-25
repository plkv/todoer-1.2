import React, { createContext, useContext, useState, useCallback } from 'react';

interface CalendarStateContextProps {
  selectedDate: Date;
  setDate: (date: Date) => void;
  goToday: () => void;
  goPrev: () => void;
  goNext: () => void;
}

const CalendarStateContext = createContext<CalendarStateContextProps | undefined>(undefined);

export const CalendarStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const setDate = useCallback((date: Date) => setSelectedDate(date), []);
  const goToday = useCallback(() => setSelectedDate(new Date()), []);
  const goPrev = useCallback(() => setSelectedDate(prev => {
    const d = new Date(prev);
    d.setDate(d.getDate() - 1);
    return d;
  }), []);
  const goNext = useCallback(() => setSelectedDate(prev => {
    const d = new Date(prev);
    d.setDate(d.getDate() + 1);
    return d;
  }), []);

  return (
    <CalendarStateContext.Provider value={{ selectedDate, setDate, goToday, goPrev, goNext }}>
      {children}
    </CalendarStateContext.Provider>
  );
};

export function useCalendarState() {
  const ctx = useContext(CalendarStateContext);
  if (!ctx) throw new Error('useCalendarState must be used within CalendarStateProvider');
  return ctx;
} 