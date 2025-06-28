import React from 'react';
import { render, screen } from '@testing-library/react';
import { BacklogSection, List } from '../BacklogSection';
import { ITask } from '@/types/Task';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

describe('BacklogSection', () => {
  const tasks: ITask[] = [
    { id: '1', user_id: 'u1', title: 'Task 1', description: null, is_completed: false, time_estimate: null, color: null, day: null, section: 'inbox', created_at: '', updated_at: '' },
    { id: '2', user_id: 'u1', title: 'Task 2', description: null, is_completed: false, time_estimate: null, color: null, day: null, section: 'inbox', created_at: '', updated_at: '' },
  ];
  const lists: List[] = [
    { id: 'inbox', name: 'Inbox', icon: <span data-testid="icon">*</span>, tasks },
  ];
  const noop = () => {};

  it('renders list name and task count', () => {
    render(
      <DndProvider backend={HTML5Backend}>
        <BacklogSection
          lists={lists}
          onAddList={noop}
          onSettingsClick={noop}
          onAddTask={noop}
          onTaskClick={noop}
          onToggleComplete={noop}
          onMoveTask={noop}
          onDuplicateList={noop}
          onDeleteAllTasks={noop}
          onDeleteTask={noop}
          onRestoreTask={noop}
          onDeleteList={noop}
        />
      </DndProvider>
    );
    expect(screen.getByText('Inbox')).toBeInTheDocument();
    expect(screen.getAllByText('2').length).toBeGreaterThan(0);
  });
}); 