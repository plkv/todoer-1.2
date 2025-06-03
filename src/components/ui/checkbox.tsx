
import * as React from "react"
import { Square, SquareCheck } from "lucide-react"
import { colors } from "@/lib/colors"
import { cn } from "@/lib/utils"

interface CheckboxProps {
  checked?: boolean | 'indeterminate';
  onCheckedChange?: (checked: boolean | 'indeterminate') => void;
  className?: string;
}

const Checkbox = React.forwardRef<
  HTMLButtonElement,
  CheckboxProps
>(({ className, checked = false, onCheckedChange, ...props }, ref) => {
  const [isHovered, setIsHovered] = React.useState(false);

  const handleClick = () => {
    onCheckedChange?.(!checked);
  };

  const getIconColor = () => {
    if (checked) {
      // Когда задача выполнена - всегда tertiary, меняется только по ховеру
      return isHovered ? colors.content.secondary : colors.content.tertiary;
    }
    if (isHovered) {
      return colors.content.secondary;
    }
    return colors.content.tertiary;
  };

  return (
    <button
      ref={ref}
      type="button"
      className={cn(
        "flex items-center justify-center w-4 h-4 transition-colors focus:outline-none",
        className
      )}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...props}
    >
      {checked ? (
        <SquareCheck 
          size={16} 
          strokeWidth={2.25}
          absoluteStrokeWidth={false}
          style={{ color: getIconColor() }}
        />
      ) : (
        <Square 
          size={16} 
          strokeWidth={2.25}
          absoluteStrokeWidth={false}
          style={{ color: getIconColor() }}
        />
      )}
    </button>
  );
});

Checkbox.displayName = "Checkbox";

export { Checkbox }
