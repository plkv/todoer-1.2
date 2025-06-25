import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Возвращает массив дат недели (YYYY-MM-DD) для выбранной даты
export function getWeekDateStrings(selectedDate: Date): string[] {
  const start = new Date(selectedDate);
  const dayOfWeek = (start.getDay() + 6) % 7; // 0=MON
  start.setDate(start.getDate() - dayOfWeek);
  return Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d.toISOString().slice(0, 10);
  });
}

// Возвращает массив дат месяца (YYYY-MM-DD) для выбранной даты
export function getMonthDateStrings(selectedDate: Date): string[] {
  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  return Array.from({ length: daysInMonth }).map((_, i) => {
    const d = new Date(year, month, i + 1);
    return d.toISOString().slice(0, 10);
  });
}

// Возвращает дату дня (YYYY-MM-DD)
export function getDayDateString(date: Date): string {
  return date.toISOString().slice(0, 10);
}

// Для UI: получить день недели из даты (например, 'ПН', 'ВТ', ...)
export function getWeekdayLabel(dateString: string, locale = 'ru-RU') {
  return new Date(dateString).toLocaleDateString(locale, { weekday: 'short' }).toUpperCase();
}
