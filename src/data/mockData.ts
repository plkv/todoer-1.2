
import { Task, WeekData } from '@/types/Task';

export const generateId = () => Math.random().toString(36).substr(2, 9);

export const initialWeekData: WeekData = {
  'MON': {
    morning: [
      { id: generateId(), title: 'hjkjikjkjk', isCompleted: false }
    ],
    day: [],
    evening: []
  },
  'TUE': {
    morning: [
      { id: generateId(), title: 'Если в тексте задачи две строки, карточ...', isCompleted: false }
    ],
    day: [
      { id: generateId(), title: 'sdfsdf', isCompleted: false },
      { id: generateId(), title: 'dskfjvbsdfklvj', isCompleted: false },
      { id: generateId(), title: 'лрили', isCompleted: false }
    ],
    evening: [
      { id: generateId(), title: 'длолдодь', isCompleted: false }
    ]
  },
  'WED': {
    morning: [],
    day: [
      { id: generateId(), title: 'another test', isCompleted: false, timeEstimate: '15m' },
      { id: generateId(), title: 'Если в тексте задачи две...', isCompleted: false, timeEstimate: '15m', color: 'red' },
      { id: generateId(), title: 'Если в тексте задачи две...', isCompleted: false, timeEstimate: '1h', color: 'red' },
      { id: generateId(), title: 'тайтл', isCompleted: false, color: 'green' }
    ],
    evening: [
      { id: generateId(), title: 'Ensure the background extends...', isCompleted: false }
    ]
  },
  'THU': { morning: [], day: [], evening: [] },
  'FRI': { morning: [], day: [], evening: [] },
  'SAT': { morning: [], day: [], evening: [] },
  'SUN': {
    morning: [
      { id: generateId(), title: 'настроить календар', isCompleted: false },
      { id: generateId(), title: 'оплатить грузинский налог', isCompleted: false, color: 'red' },
      { id: generateId(), title: 'отправить фото коучу', isCompleted: false, color: 'red' },
      { id: generateId(), title: 'Оплатить бухгалтера груэия', isCompleted: false, color: 'purple' },
      { id: generateId(), title: 'ещё что-то', isCompleted: false, timeEstimate: '1h', color: 'blue' }
    ],
    day: [],
    evening: []
  }
};

export const backlogTasks: Task[] = [
  { id: generateId(), title: 'чего надо сделать', isCompleted: false }
];

export const dates = [
  { day: 'MON', date: 'May 26' },
  { day: 'TUE', date: 'May 27' },
  { day: 'WED', date: 'May 28' },
  { day: 'THU', date: 'May 29' },
  { day: 'FRI', date: 'May 30' },
  { day: 'SAT', date: 'May 31' },
  { day: 'SUN', date: 'Jun 1' }
];
