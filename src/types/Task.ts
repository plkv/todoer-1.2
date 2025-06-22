export interface Task {
  id: string;
  user_id: number;
  title: string;
  description: string | null;
  is_completed: boolean;
  time_estimate: string | null;
  color: string | null;
  day: string | null;
  section: string | null;
  created_at: string;
  updated_at: string;
}

export interface DayTasks {
  morning: Task[];
  day: Task[];
  evening: Task[];
}

export type WeekData = Record<string, DayTasks>;
