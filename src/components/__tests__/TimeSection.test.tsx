import React from 'react';
import { render, screen } from '@testing-library/react';
import { TimeSection } from '../TimeSection';
import { ITask } from '@/types/Task';
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

describe('TimeSection', () => {
  const tasks: ITask[] = [
    { id: '1', user_id: 'u1', title: 'Morning Task', description: null, is_completed: false, time_estimate: null, color: null, day: null, section: null, created_at: '', updated_at: '' },
  ];
  const noop = () => {};

  it('renders section title and tasks', () => {
    render(
      <DndProvider backend={HTML5Backend}>
        <TimeSection
          title="MORNING"
          tasks={tasks}
          onTaskClick={noop}
          onToggleComplete={noop}
          onAddTask={noop}
        />
      </DndProvider>
    );
    expect(screen.getByText('MORNING')).toBeInTheDocument();
    expect(screen.getByText('Morning Task')).toBeInTheDocument();
  });
}); 