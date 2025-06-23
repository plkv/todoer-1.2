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
import { format } from 'date-fns';
import { MaterialIcon } from './MaterialIcon';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

interface TaskOverlayProps {
  task: ITask | null;
  displayDate: Date | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: ITask) => void;
  onDelete: (taskId: string) => void;
  onDuplicate: (task: ITask) => void;
}

const TaskOverlay = ({ task, displayDate, isOpen, onClose, onSave, onDelete, onDuplicate }: TaskOverlayProps) => {
  const [editedTask, setEditedTask] = useState<ITask | null>(task);

  useEffect(() => {
    setEditedTask(task);
  }, [task]);

  const handleFieldChange = (field: keyof ITask, value: any) => {
    if (editedTask) {
      setEditedTask({ ...editedTask, [field]: value });
    }
  };

  const handleSaveAndClose = () => {
    if (editedTask) {
      onSave(editedTask);
    }
    onClose();
  };

  const handleDelete = () => {
    if (editedTask?.id) {
      onDelete(editedTask.id);
    }
  };

  const handleDuplicate = () => {
    if (editedTask) {
      onDuplicate(editedTask);
    }
  };

  if (!editedTask) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleSaveAndClose()}>
      <DialogContent className="sm:max-w-[512px] bg-background text-foreground border-border p-6 flex flex-col gap-6">
        {/* Header with Checkbox and Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Checkbox
              id="completed"
              checked={editedTask.is_completed}
              onCheckedChange={(checked) => handleFieldChange('is_completed', !!checked)}
            />
            <label htmlFor="completed" className="text-style-p-m text-muted-foreground">
              {editedTask.is_completed ? 'Completed' : 'Not completed'}
            </label>
          </div>
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={handleDuplicate}>
                    <MaterialIcon name="content_copy" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Duplicate</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={handleDelete}>
                    <MaterialIcon name="delete" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Delete</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col gap-4">
          <div className="text-style-p-s text-muted-foreground ml-1.5">
            {displayDate ? format(displayDate, 'E, d MMM yyyy') : 'Date not set'}
          </div>

          <Textarea
            value={editedTask.title || ''}
            onChange={(e) => handleFieldChange('title', e.target.value)}
            placeholder="Task Title"
            className="text-style-h-l bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 resize-none"
          />

          <Textarea
            value={editedTask.description || ''}
            onChange={(e) => handleFieldChange('description', e.target.value)}
            placeholder="Description"
            className="text-style-p-m bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 resize-none min-h-[60px]"
          />
        </div>

        {/* Time Selector */}
        <div className="flex flex-col gap-2 p-1.5">
          <label className="text-style-h-s text-muted-foreground">TIME ESTIMATE</label>
          <TimeSelector
            value={editedTask.time_estimate || ''}
            onChange={(value) => handleFieldChange('time_estimate', value)}
          />
        </div>

        {/* Color Selector */}
        <div className="flex flex-col gap-2 p-1.5">
          <label className="text-style-h-s text-muted-foreground">COLOR</label>
          <ColorSelector
            value={editedTask.color || ''}
            onChange={(value) => handleFieldChange('color', value)}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TaskOverlay;
