export interface ITask {
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
  morning: ITask[];
  day: ITask[];
  evening: ITask[];
}

export type WeekData = Record<string, DayTasks>;

export type Task = ITask; // Alias for backward compatibility if needed
