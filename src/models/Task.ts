export interface ITask {
  title: string;
  description?: string;
  isCompleted: boolean;
  timeEstimate: string;
  color?: string;
  day?: 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT' | 'SUN';
  section?: 'morning' | 'day' | 'evening';
  userId: string;
  createdAt: Date;
  updatedAt: Date;
} 