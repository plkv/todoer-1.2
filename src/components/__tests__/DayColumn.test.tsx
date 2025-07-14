import React from 'react';
import { render, screen } from '@testing-library/react';
import { DayColumn } from '../DayColumn';
import { ITask, DayTasks } from '@/types/Task';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

jest.mock('react-dnd', () => ({
  useDrag: () => [{}, jest.fn(), jest.fn()],
  useDrop: () => [{}, jest.fn()],
  DndProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

jest.mock('react-dnd-html5-backend', () => ({
  HTML5Backend: jest.fn(),
}));

describe('DayColumn', () => {
  const tasks: DayTasks = {
    morning: [
      { id: '1', user_id: 'u1', title: 'Morning Task', description: null, is_completed: false, time_estimate: null, color: null, day: null, section: null, created_at: '', updated_at: '' },
    ],
    day: [],
    evening: [],
  };
  const noop = () => {};

  it('renders dayName and morning task', () => {
    render(
      <DndProvider backend={HTML5Backend}>
        <DayColumn
          dayName="Понедельник"
          date="2024-06-24"
          tasks={tasks}
          onTaskClick={noop}
          onToggleComplete={noop}
          onAddTask={noop}
        />
      </DndProvider>
    );
    expect(screen.getByText('Понедельник')).toBeInTheDocument();
    expect(screen.getByText('Morning Task')).toBeInTheDocument();
  });
}); 