import * as React from "react"
import { cn } from "@/lib/utils"

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost-prim' | 'ghost-sec'
  size?: 'm' | 'l'
  icon?: React.ReactNode
  label?: React.ReactNode
  secondary?: React.ReactNode
  children?: React.ReactNode // если нужен полный кастом
}

const variantClasses = {
  primary:
    'bg-accent-prim text-on-dark-content-prim hover:bg-accent-sec active:bg-accent-prim/80 disabled:bg-accent-prim/40',
  secondary:
    'bg-fill-prim text-content-prim hover:bg-fill-sec active:bg-fill-prim/60 disabled:bg-fill-prim/40',
  'ghost-prim':
    'bg-transparent text-content-prim hover:bg-fill-sec active:bg-fill-prim disabled:text-content-tert',
  'ghost-sec':
    'bg-transparent text-content-sec hover:bg-fill-sec active:bg-fill-prim disabled:text-content-tert',
}

const buttonSizeMap = {
  m: {
    height: 'min-h-[28px] min-w-[28px]',
    rounded: 'rounded-[6px]',
    padding: 'p-1.5', // 6px
    gap: 'gap-1', // 4px
    icon: {
      height: 'min-h-[28px] min-w-[28px]',
      rounded: 'rounded-[6px]',
      padding: 'p-1.5',
      gap: 'gap-0',
    }
  },
  l: {
    height: 'min-h-[36px] min-w-[36px]',
    rounded: 'rounded-[6px]',
    padding: 'p-2', // 8px
    gap: 'gap-1', // 4px
    icon: {
      height: 'min-h-[36px] min-w-[36px]',
      rounded: 'rounded-[6px]',
      padding: 'p-2',
      gap: 'gap-0',
    }
  }
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'm', icon, label, secondary, children, className, disabled, ...props }, ref) => {
    // debug outline color map
    const debugBoxShadowMap: Record<string, string> = {
      'primary-m': 'inset 0 0 0 2px red',
      'primary-l': 'inset 0 0 0 2px orange',
      'secondary-m': 'inset 0 0 0 2px green',
      'secondary-l': 'inset 0 0 0 2px blue',
      'ghost-prim-m': 'inset 0 0 0 2px purple',
      'ghost-prim-l': 'inset 0 0 0 2px pink',
      'ghost-sec-m': 'inset 0 0 0 2px #7FFF00',
      'ghost-sec-l': 'inset 0 0 0 2px cyan',
    };
    const debugKey = `${variant}-${size}`;
    const debugBoxShadow = debugBoxShadowMap[debugKey] || 'inset 0 0 0 2px gray';
    const debugStyle = { boxShadow: debugBoxShadow };

    if (children && (!icon && !label && !secondary)) {
      return (
        <button
          ref={ref}
          type={props.type || 'button'}
          disabled={disabled}
          className={cn(
            'inline-flex items-center justify-center transition-colors select-none outline-none focus-visible:ring-2 focus-visible:ring-accent-prim focus-visible:ring-offset-2',
            variantClasses[variant],
            buttonSizeMap[size].height,
            buttonSizeMap[size].rounded,
            buttonSizeMap[size].padding,
            className
          )}
          style={debugStyle}
          {...props}
        >
          {children}
        </button>
      );
    }

    const isIconOnly = !!icon && !label && !secondary;
    const hasMultiple = [icon, label, secondary].filter(Boolean).length > 1;
    const sizeStyles = isIconOnly
      ? buttonSizeMap[size].icon
      : buttonSizeMap[size];

    return (
      <button
        ref={ref}
        type={props.type || 'button'}
        disabled={disabled}
        className={cn(
          'inline-flex items-center justify-center transition-colors select-none outline-none focus-visible:ring-2 focus-visible:ring-accent-prim focus-visible:ring-offset-2',
          variantClasses[variant],
          sizeStyles.height,
          sizeStyles.rounded,
          sizeStyles.padding,
          isIconOnly ? sizeStyles.gap : hasMultiple ? sizeStyles.gap : '',
          'text-style-p-l',
          disabled && 'cursor-not-allowed opacity-60',
          className
        )}
        style={debugStyle}
        {...props}
      >
        {icon && <span className={isIconOnly ? '' : 'flex items-center justify-center'}>{icon}</span>}
        {label && <span className="truncate">{label}</span>}
        {secondary && <span className="text-style-p-s text-content-tert truncate">{secondary}</span>}
      </button>
    );
  }
)
Button.displayName = "Button"
