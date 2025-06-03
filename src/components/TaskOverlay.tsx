
import React, { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { TimeSelector } from './TimeSelector';
import { ColorSelector } from './ColorSelector';
import { MaterialIcon } from './MaterialIcon';
import { lightTheme, darkTheme } from '@/lib/colors';
import { useTheme } from '@/hooks/useTheme';

interface TaskOverlayProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const TaskOverlay = ({ open, onOpenChange }: TaskOverlayProps) => {
  const { isDark } = useTheme();
  const colors = isDark ? darkTheme : lightTheme;
  
  const [isCompleted, setIsCompleted] = useState(false);
  const [selectedTime, setSelectedTime] = useState('15m');
  const [selectedColor, setSelectedColor] = useState('');
  const [taskTitle, setTaskTitle] = useState('Если в тексте задачи две строки, карточка должна увеличиваться по высоте (hug по высоте, fill по ширине), а не обрезать текст или ломать layout.');
  const [description, setDescription] = useState('');

  const handleCheckboxChange = (checked: boolean | 'indeterminate') => {
    setIsCompleted(checked === true);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="w-[512px] p-0 gap-0 shadow-[0px_4px_32px_0px_rgba(0,0,0,0.12)]"
        style={{ 
          borderRadius: '20px',
          padding: '24px 18px 40px 18px',
          backgroundColor: colors.bg.primary,
          border: 'none'
        }}
        hideCloseButton={true}
      >
        <div 
          className="flex flex-col items-start self-stretch"
          style={{ gap: '24px' }}
        >
          {/* Header with checkbox and delete */}
          <div className="flex items-center justify-between self-stretch">
            <div 
              className="flex items-center flex-1"
              style={{ gap: '4px' }}
            >
              <Checkbox 
                checked={isCompleted}
                onCheckedChange={handleCheckboxChange}
                className="w-5 h-5"
              />
              <span 
                className="text-sm font-medium"
                style={{ color: colors.content.secondary }}
              >
                {isCompleted ? 'Completed' : 'Not completed'}
              </span>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              style={{ color: colors.content.tertiary }}
            >
              <MaterialIcon name="delete" size={20} />
            </Button>
          </div>

          {/* Date container */}
          <div 
            className="flex items-center self-stretch"
            style={{ 
              padding: '0px 6px',
              gap: '10px'
            }}
          >
            <span 
              style={{
                color: colors.content.tertiary,
                fontFamily: '"SF Pro"',
                fontSize: '12px',
                fontWeight: 510,
                lineHeight: '16px',
                letterSpacing: '-0.24px',
                fontFeatureSettings: "'ss01' on, 'ss02' on, 'ss07' on, 'cv03' on, 'cv08' on, 'cv12' on"
              }}
            >
              Wed, 28 May 2025
            </span>
          </div>

          {/* Task Title Textarea */}
          <div 
            className="flex items-center self-stretch"
            style={{ padding: '6px' }}
          >
            <Textarea
              placeholder="Task title"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              className="flex-1 p-0 min-h-0 bg-transparent resize-none focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-[color:var(--placeholder-color)]"
              style={{
                '--placeholder-color': colors.content.tertiary,
                color: colors.content.primary,
                fontFamily: '"SF Pro"',
                fontSize: '18px',
                fontWeight: 700,
                lineHeight: '24px',
                letterSpacing: '-0.54px',
                fontFeatureSettings: "'ss01' on, 'ss02' on, 'ss07' on, 'cv03' on, 'cv08' on, 'cv12' on",
                height: 'auto',
                border: 'none',
                outline: 'none'
              } as React.CSSProperties}
              rows={1}
            />
          </div>

          {/* Description Textarea */}
          <div 
            className="flex flex-col items-center self-stretch"
            style={{ padding: '6px' }}
          >
            <Textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="self-stretch p-0 bg-transparent resize-none focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-[color:var(--placeholder-color)]"
              style={{
                '--placeholder-color': colors.content.tertiary,
                minHeight: '48px',
                color: colors.content.tertiary,
                fontFamily: '"SF Pro"',
                fontSize: '12px',
                fontWeight: 510,
                lineHeight: '16px',
                letterSpacing: '-0.24px',
                fontFeatureSettings: "'ss01' on, 'ss02' on, 'ss07' on, 'cv03' on, 'cv08' on, 'cv12' on",
                border: 'none',
                outline: 'none'
              } as React.CSSProperties}
              rows={3}
            />
          </div>

          {/* Time Section */}
          <div className="self-stretch">
            <h3 
              className="uppercase tracking-wide mb-4"
              style={{
                color: colors.content.tertiary,
                fontFamily: '"SF Pro"',
                fontSize: '11px',
                fontWeight: 700,
                lineHeight: '16px',
                letterSpacing: '0%',
                fontFeatureSettings: "'ss01' on, 'ss02' on, 'ss07' on, 'cv03' on, 'cv08' on, 'cv12' on"
              }}
            >
              TIME
            </h3>
            <TimeSelector 
              selectedTime={selectedTime}
              onTimeSelect={setSelectedTime}
              isDark={isDark}
            />
          </div>

          {/* Color Section */}
          <div className="self-stretch">
            <h3 
              className="uppercase tracking-wide mb-4"
              style={{
                color: colors.content.tertiary,
                fontFamily: '"SF Pro"',
                fontSize: '11px',
                fontWeight: 700,
                lineHeight: '16px',
                letterSpacing: '0%',
                fontFeatureSettings: "'ss01' on, 'ss02' on, 'ss07' on, 'cv03' on, 'cv08' on, 'cv12' on"
              }}
            >
              COLOR
            </h3>
            <ColorSelector 
              selectedColor={selectedColor}
              onColorSelect={setSelectedColor}
              isDark={isDark}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
