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
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

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
        className="w-full max-w-520 bg-bg-prim text-content-prim border border-brd-prim pt-0 pr-0 pb-4 pl-0 flex flex-col rounded-lg shadow-lg"
        onKeyDown={handleKeyDown}
      >
        <DialogTitle className="sr-only">Task details</DialogTitle>
        <DialogDescription className="sr-only">Edit task details, time estimate, and color.</DialogDescription>
        {/* Header: чекбокс + заголовок */}
        <div className="flex flex-row-reverse items-start justify-start p-4 w-full gap-4">
          <div className="flex items-center justify-center h-6 w-6">
            <Checkbox
              checked={editedTask.is_completed}
              onCheckedChange={(checked) => handleFieldChange('is_completed', !!checked)}
              className="w-6 h-6 rounded border border-brd-prim flex items-center justify-center transition-colors duration-150"
            />
          </div>
          <div className="flex-1 flex items-center">
            <Textarea
              ref={titleRef}
              value={editedTask.title || ''}
              onChange={(e) => handleFieldChange('title', e.target.value)}
              placeholder="Task Title"
              autoFocus
              className="text-lg font-semibold bg-bg-prim border-brd-prim focus-visible:ring-0 focus-visible:ring-offset-0 resize-none min-h-10 px-0 py-0 border-none shadow-none"
            />
          </div>
          <div className="flex items-center gap-2">
            <span
              role="button"
              tabIndex={0}
              onClick={handleDelete}
              className="inline-flex items-center justify-center rounded-btn p-1.5 cursor-pointer hover:bg-fill-sec focus-visible:ring-2 focus-visible:ring-accent-prim focus-visible:ring-offset-2"
            >
              <IconClose />
            </span>
          </div>
        </div>
        {/* Дата и период */}
        <div className="flex flex-row items-center gap-2 px-4 pt-2">
          <span className="text-sm text-content-prim font-semibold">{displayDate ? format(displayDate, 'd MMM yyyy') : 'Date not set'}</span>
          <span className="text-xs text-content-tert font-medium">Morning</span>
        </div>
        {/* Сегментированные табы (таймеры) */}
        <div className="px-4 pt-6">
          <Tabs defaultValue="5m" className="w-full">
            <TabsList className="flex flex-row gap-1 bg-fill-sec rounded-md p-1">
              {['5m','15m','30m','1h','2h','3h+'].map((label) => (
                <TabsTrigger key={label} value={label} className="text-xs font-semibold px-2 py-1 rounded-md">
                  {label}
                </TabsTrigger>
              ))}
            </TabsList>
            <TabsContent value="5m" />
            <TabsContent value="15m" />
            <TabsContent value="30m" />
            <TabsContent value="1h" />
            <TabsContent value="2h" />
            <TabsContent value="3h+" />
          </Tabs>
        </div>
        {/* Описание */}
        <div className="px-4 pt-6">
          <Textarea
            value={editedTask.description || ''}
            onChange={(e) => handleFieldChange('description', e.target.value)}
            placeholder="Description"
            className="text-sm bg-bg-prim border-brd-prim focus-visible:ring-0 focus-visible:ring-offset-0 resize-none min-h-16 placeholder:text-content-tert"
          />
        </div>
        {/* Action-кнопки */}
        <div className="flex flex-row gap-2 justify-end px-4 pt-6">
          <Button variant="ghost-prim" size="m" onClick={handleDuplicate}>
            Duplicate
          </Button>
          <Button variant="ghost-prim" size="m" onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TaskOverlay;
