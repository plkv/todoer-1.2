
import React, { useState } from 'react';
import { useDrag } from 'react-dnd';
import { Checkbox } from '@/components/ui/checkbox';
import { lightTheme, darkTheme, getTaskCardColors } from '@/lib/colors';

interface TaskCardProps {
  id: string;
  title: string;
  isCompleted: boolean;
  timeEstimate?: string;
  color?: string;
  onClick: () => void;
  onToggleComplete: (id: string, completed: boolean) => void;
  sourceLocation?: { day?: string; section?: string };
  isDark?: boolean;
}

export const TaskCard = ({ 
  id, 
  title, 
  isCompleted, 
  timeEstimate, 
  color, 
  onClick, 
  onToggleComplete,
  sourceLocation,
  isDark = false
}: TaskCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const colors = isDark ? darkTheme : lightTheme;

  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'task',
    item: { id, sourceLocation },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const getBackgroundColor = () => {
    if (color) {
      const baseColor = colors.accent[color as keyof typeof colors.accent];
      if (!baseColor) return 'transparent';

      let opacity = '0A'; // 4% default
      if (isPressed) opacity = '1F'; // 12%
      else if (isHovered) opacity = '14'; // 8%

      return `${baseColor}${opacity}`;
    } else {
      if (isPressed) return colors.fill.tertiary;
      if (isHovered) return colors.fill.secondary;
      return colors.fill.primary;
    }
  };

  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleCheckboxChange = (checked: boolean | 'indeterminate') => {
    onToggleComplete(id, checked === true);
  };

  return (
    <div 
      ref={drag}
      className="cursor-pointer transition-all duration-200 ease-out flex items-center rounded-lg"
      style={{
        backgroundColor: getBackgroundColor(),
        opacity: isDragging ? 0.5 : (isCompleted ? 0.7 : 1),
        padding: '4px 6px',
        gap: '6px',
        cursor: isDragging ? 'grabbing' : 'grab',
      }}
      onMouseEnter={() => !isDragging && setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsPressed(false);
      }}
      onMouseDown={() => !isDragging && setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onClick={onClick}
    >
      {/* Checkbox */}
      <div onClick={handleCheckboxClick} className="flex-shrink-0">
        <Checkbox 
          checked={isCompleted}
          onCheckedChange={handleCheckboxChange}
          className="w-4 h-4"
        />
      </div>

      {/* Title */}
      <div className="flex-1 min-w-0">
        <p 
          className={`font-sf-pro-m transition-colors duration-200 ${isCompleted ? 'line-through' : ''}`}
          style={{
            color: isCompleted ? colors.content.tertiary : colors.content.primary,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            wordBreak: 'break-word',
          }}
        >
          {title}
        </p>
      </div>

      {/* Time estimate */}
      {timeEstimate && (
        <div className="flex-shrink-0">
          <span 
            className="font-sf-pro-m transition-colors duration-200"
            style={{
              color: colors.content.tertiary,
              fontSize: '10px',
              lineHeight: '12px'
            }}
          >
            {timeEstimate}
          </span>
        </div>
      )}
    </div>
  );
};
