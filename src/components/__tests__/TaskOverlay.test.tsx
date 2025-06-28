import React from 'react';
import { render, screen } from '@testing-library/react';
import TaskOverlay from '../TaskOverlay';
import { ITask } from '@/types/Task';

describe('TaskOverlay', () => {
  const task: ITask = {
    id: '1',
    user_id: 'u1',
    title: 'Overlay Task',
    description: null,
    is_completed: true,
    time_estimate: null,
    color: null,
    day: null,
    section: null,
    created_at: '',
    updated_at: '',
  };
  const noop = () => {};

  it('renders title and completed state', () => {
    render(
      <TaskOverlay
        task={task}
        displayDate={null}
        isOpen={true}
        onClose={noop}
        onSave={noop}
        onDelete={noop}
        onDuplicate={noop}
      />
    );
    expect(screen.getByDisplayValue('Overlay Task')).toBeInTheDocument();
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
  });
}); 