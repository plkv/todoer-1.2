import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Возвращает массив вида [{ day: 'MON', date: '2024-06-04' }, ...] для текущей недели
export function getCurrentWeekDates() {
  const days = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
  const today = new Date();
  // Определяем понедельник этой недели
  const monday = new Date(today);
  const dayOfWeek = (today.getDay() + 6) % 7; // 0=MON, 6=SUN
  monday.setDate(today.getDate() - dayOfWeek);

  return days.map((day, idx) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + idx);
    return {
      day,
      date: d.toISOString().slice(0, 10) // YYYY-MM-DD
    };
  });
}

// Возвращает массив вида [{ day: 'MON', date: 'May 26' }, ...] для недели с указанным смещением
export function getWeekDates(weekOffset = 0): { day: string; date: string; fullDate: Date }[] {
  const now = new Date();
  now.setDate(now.getDate() + weekOffset * 7);
  // Monday is start of week
  const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay() + (now.getDay() === 0 ? -6 : 1))); 

  return Array.from({ length: 7 }).map((_, i) => {
    const date = new Date(startOfWeek);
    date.setDate(date.getDate() + i);
    return {
      day: format(date, 'E').toUpperCase(), // MON, TUE
      date: format(date, 'd MMM').toUpperCase(), // 18 MAY
      fullDate: date,
    };
  });
}

// Возвращает текущий день недели в формате 'MON', 'TUE' и т.д.
export function getCurrentDay() {
  const days = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
  // Преобразуем воскресенье (0) в 6, остальные дни сдвигаем на 1 назад
  const dayIndex = (new Date().getDay() + 6) % 7;
  return days[dayIndex];
}
