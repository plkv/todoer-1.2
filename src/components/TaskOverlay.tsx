import React, { useState, useEffect, useRef } from 'react';
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
import { Copy, Trash, Check } from '@phosphor-icons/react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { cn } from '@/lib/utils';
import { IconClose } from './ui/icons';

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
  const titleRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setEditedTask(task);
  }, [task]);

  useEffect(() => {
    if (isOpen && titleRef.current) {
      titleRef.current.focus();
    }
  }, [isOpen]);

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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'Enter' && !e.shiftKey) {
      if (document.activeElement && document.activeElement.tagName === 'TEXTAREA') {
        const textarea = document.activeElement as HTMLTextAreaElement;
        if (textarea && textarea.value.includes('\n')) return;
      }
      e.preventDefault();
      handleSaveAndClose();
    }
  };

  if (!editedTask) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleSaveAndClose()}>
      <DialogContent
        hideCloseButton={true}
        className="w-full max-w-[520px] bg-bg-prim text-content-prim border border-brd-prim pt-6 pr-[18px] pb-10 pl-[18px] flex flex-col gap-6"
        onKeyDown={handleKeyDown}
      >
        <DialogTitle className="sr-only">Task details</DialogTitle>
        <DialogDescription className="sr-only">Edit task details, time estimate, and color.</DialogDescription>
        {/* Header with Checkbox and Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 ml-2">
            <Checkbox
              checked={editedTask.is_completed}
              onCheckedChange={(checked) => handleFieldChange('is_completed', !!checked)}
              className="w-4 h-4 rounded border border-brd-prim flex items-center justify-center transition-colors duration-150"
            />
            <label className="text-sm text-content-sec select-none">
              {editedTask.is_completed ? 'Completed' : 'Not completed'}
            </label>
          </div>
          <div className="flex flex-1 justify-end">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost-prim" size="l" onClick={handleDelete}>
                    <IconClose size="l" />
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
          <div className="text-xs text-content-tert ml-2">
            {displayDate ? format(displayDate, 'E, d MMM yyyy') : 'Date not set'}
          </div>
          <Textarea
            ref={titleRef}
            value={editedTask.title || ''}
            onChange={(e) => handleFieldChange('title', e.target.value)}
            placeholder="Task Title"
            autoFocus
            className="text-lg font-semibold bg-bg-prim border-brd-prim focus-visible:ring-0 focus-visible:ring-offset-0 resize-none min-h-[40px] ml-2 placeholder:text-content-tert"
          />
          <Textarea
            value={editedTask.description || ''}
            onChange={(e) => handleFieldChange('description', e.target.value)}
            placeholder="Description"
            className="text-sm bg-bg-prim border-brd-prim focus-visible:ring-0 focus-visible:ring-offset-0 resize-none min-h-[60px] ml-2 placeholder:text-content-tert"
          />
        </div>

        {/* Time Selector */}
        <div className="flex flex-col gap-2 p-1.5 ml-2">
          <label className="text-xs text-content-sec font-medium uppercase tracking-wide">Time estimate</label>
          <TimeSelector 
            value={editedTask.time_estimate || ''}
            onChange={(value) => handleFieldChange('time_estimate', value)}
          />
        </div>

        {/* Color Selector */}
        <div className="flex flex-col gap-2 p-1.5 ml-2">
          <label className="text-xs text-content-sec font-medium uppercase tracking-wide">Color</label>
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
