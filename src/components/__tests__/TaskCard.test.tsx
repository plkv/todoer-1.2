import React from 'react';
import { render, screen } from '@testing-library/react';
import { TaskCard } from '../TaskCard';
import { Task } from '@/types/Task';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

describe('TaskCard', () => {
  const baseTask: Task = {
    id: '1',
    user_id: 'u1',
    title: 'Test Task',
    description: null,
    is_completed: false,
    time_estimate: '15m',
    color: null,
    day: null,
    section: null,
    created_at: '',
    updated_at: '',
  };
  const noop = () => {};

  it('renders title', () => {
    render(
      <DndProvider backend={HTML5Backend}>
        <TaskCard task={baseTask} onClick={noop} onToggleComplete={noop} />
      </DndProvider>
    );
    expect(screen.getByText('Test Task')).toBeInTheDocument();
  });
  it('renders time_estimate', () => {
    render(
      <DndProvider backend={HTML5Backend}>
        <TaskCard task={baseTask} onClick={noop} onToggleComplete={noop} />
      </DndProvider>
    );
    expect(screen.getByText('15m')).toBeInTheDocument();
  });
}); 