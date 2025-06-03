
import React, { useState } from 'react';
import { useDrop } from 'react-dnd';
import { TaskCard } from './TaskCard';
import { Plus, Settings, ArrowUpDown } from 'lucide-react';
import { colors } from '@/lib/colors';

interface Task {
  id: string;
  title: string;
  isCompleted: boolean;
  timeEstimate?: string;
  color?: string;
}

interface BacklogSectionProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  onToggleComplete: (id: string, completed: boolean) => void;
  onAddTask: () => void;
  onMoveTask?: (taskId: string, sourceLocation: { day?: string; section?: string }, targetLocation: { day?: string; section?: string }) => void;
}

export const BacklogSection = ({ 
  tasks, 
  onTaskClick, 
  onToggleComplete, 
  onAddTask,
  onMoveTask
}: BacklogSectionProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'task',
    drop: (item: { id: string; sourceLocation: { day?: string; section?: string } }) => {
      if (onMoveTask) {
        onMoveTask(item.id, item.sourceLocation, {});
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  return (
    <div 
      ref={drop}
      className="border-t"
      style={{ 
        backgroundColor: isOver ? colors.fill.secondary : 'transparent',
        borderColor: colors.border.primary,
        marginTop: '6px',
        padding: '6px',
        transition: 'background-color 0.2s'
      }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between" style={{ marginBottom: '6px' }}>
          <div 
            className="flex items-center"
            style={{ gap: '4px' }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <h2 className="font-sf-pro-l" style={{ color: colors.content.primary }}>
              Backlog
            </h2>
            {isHovered && (
              <button
                onClick={onAddTask}
                className="h-7 w-7 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center"
                style={{ color: colors.content.tertiary }}
              >
                <Plus size={16} strokeWidth={2} />
              </button>
            )}
          </div>

          <div className="flex items-center" style={{ gap: '6px' }}>
            <div className="flex items-center" style={{ gap: '4px' }}>
              <button 
                className="flex items-center hover:opacity-70 transition-opacity rounded-md"
                style={{ color: colors.content.tertiary, gap: '4px', padding: '4px' }}
              >
                <span className="font-sf-pro-s">Filter</span>
                <Settings size={14} strokeWidth={2} />
              </button>
              
              <button 
                className="flex items-center hover:opacity-70 transition-opacity rounded-md"
                style={{ color: colors.content.tertiary, gap: '4px', padding: '4px' }}
              >
                <span className="font-sf-pro-s">Sort</span>
                <ArrowUpDown size={14} strokeWidth={2} />
              </button>
            </div>

            <button
              className="hover:bg-gray-100 transition-colors rounded-lg font-sf-pro-m"
              style={{ color: colors.content.secondary, padding: '4px 6px' }}
            >
              Style Guide
            </button>
          </div>
        </div>

        <div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 2xl:grid-cols-8"
          style={{ gap: '4px' }}
        >
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              {...task}
              onClick={() => onTaskClick(task)}
              onToggleComplete={onToggleComplete}
              sourceLocation={{}}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
