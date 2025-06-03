
export interface Task {
  id: string;
  title: string;
  isCompleted: boolean;
  timeEstimate?: string;
  color?: string;
}

export interface DayTasks {
  morning: Task[];
  day: Task[];
  evening: Task[];
}

export type WeekData = Record<string, DayTasks>;
