import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { TimeSelector } from './TimeSelector';
import { ColorSelector } from './ColorSelector';
import { ITask } from '@/types/Task';

interface TaskOverlayProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task?: ITask | null;
  onSave: (taskData: Partial<ITask>) => void;
  onDelete?: (taskId: string) => void;
}

export const TaskOverlay = ({ open, onOpenChange, task, onSave, onDelete }: TaskOverlayProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [timeEstimate, setTimeEstimate] = useState<string | null>(null);
  const [color, setColor] = useState<string | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || '');
      setTimeEstimate(task.time_estimate || null);
      setColor(task.color || null);
      setIsCompleted(task.is_completed);
    } else {
      // Reset for new task
      setTitle('');
      setDescription('');
      setTimeEstimate(null);
      setColor(null);
      setIsCompleted(false);
    }
  }, [task, open]);

  const handleSave = () => {
    onSave({
      ...task,
      id: task?.id,
      title: title || 'New Task',
      description,
      time_estimate: timeEstimate,
      color,
      is_completed: isCompleted,
    });
    onOpenChange(false);
  };

  const handleDelete = () => {
    if (task?.id && onDelete) {
      onDelete(task.id);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="text-style-h-l">{task ? 'Edit Task' : 'New Task'}</DialogTitle>
          <DialogDescription className="text-style-p-m">
            {task ? 'Update the details of your task.' : 'Create a new task to track.'}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Task title"
          />
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add a description..."
          />
          <div className="flex items-center space-x-2">
            <Checkbox
              id="isCompleted"
              checked={isCompleted}
              onCheckedChange={(checked) => setIsCompleted(Boolean(checked))}
            />
            <label
              htmlFor="isCompleted"
              className="leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              <span className="text-style-p-m">Mark as completed</span>
            </label>
          </div>
          <div>
            <h4 className="mb-2 text-muted-foreground"><span className="text-style-h-s">TIME ESTIMATE</span></h4>
            <TimeSelector value={timeEstimate || ''} onChange={setTimeEstimate} />
          </div>
          <div>
            <h4 className="mb-2 text-muted-foreground"><span className="text-style-h-s">COLOR</span></h4>
            <ColorSelector value={color} onChange={setColor} />
          </div>
        </div>
        <DialogFooter className="sm:justify-between">
          <div>
            {task && onDelete && (
              <Button 
                variant="destructive" 
                onClick={handleDelete} 
              >
                <span className="text-style-p-m-semibold">Delete Task</span>
              </Button>
            )}
          </div>
          <Button 
            onClick={handleSave} 
          >
            <span className="text-style-p-m-semibold">Save changes</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
