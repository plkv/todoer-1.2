import * as React from "react"
import { cn } from "@/lib/utils"

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'm' | 's' | 'l'
  iconLeft?: React.ReactNode
  iconRight?: React.ReactNode
  secondary?: React.ReactNode
}

const variantClasses = {
  primary:
    'bg-accent-prim text-on-dark-content-prim hover:bg-accent-prim/90 active:bg-accent-prim/80 disabled:bg-accent-prim/40',
  secondary:
    'bg-fill-sec text-content-prim hover:bg-fill-sec/80 active:bg-fill-sec/60 disabled:bg-fill-sec/40',
  ghost:
    'bg-transparent text-content-prim hover:bg-fill-sec active:bg-fill-prim disabled:text-content-tert',
}

const sizeClasses = {
  l: 'h-7 min-h-[28px] rounded-[10px] px-4',
  m: 'h-7 min-h-[28px] rounded-[8px] px-3',
  s: 'h-7 min-h-[28px] rounded-[6px] px-2',
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { variant = 'primary', size = 'm', iconLeft, iconRight, secondary, className, children, disabled, ...props },
    ref
  ) => {
    const hasLabel = !!children;
    const hasSecondary = !!secondary;
    const hasIconLeft = !!iconLeft;
    const hasIconRight = !!iconRight;
    // Только одна иконка, без текста и secondary
    const iconOnly = (hasIconLeft && !hasLabel && !hasSecondary && !hasIconRight) || (hasIconRight && !hasLabel && !hasSecondary && !hasIconLeft);

    return (
      <button
        ref={ref}
        type={props.type || 'button'}
        disabled={disabled}
        className={cn(
          'inline-flex items-center font-medium transition-colors select-none outline-none focus-visible:ring-2 focus-visible:ring-accent-prim focus-visible:ring-offset-2',
          variantClasses[variant],
          sizeClasses[size],
          iconOnly ? 'w-7 h-7 min-w-[28px] min-h-[28px] justify-center p-0' : 'min-h-[28px] h-7 px-3 gap-1',
          disabled && 'cursor-not-allowed opacity-60',
          className
        )}
        {...props}
      >
        {/* Left outer spacer */}
        {!iconOnly && <span className="w-1" aria-hidden="true" />}
        {/* Icon left */}
        {iconLeft && <span className="flex items-center justify-center">{iconLeft}</span>}
        {/* Gap between iconLeft and label/secondary */}
        {iconLeft && (hasLabel || hasSecondary) && <span className="w-1" aria-hidden="true" />}
        {/* Label */}
        {hasLabel && <span className="truncate">{children}</span>}
        {/* Gap between label and secondary */}
        {hasLabel && hasSecondary && <span className="w-1" aria-hidden="true" />}
        {/* Secondary label */}
        {hasSecondary && <span className="text-style-p-s text-content-tert truncate">{secondary}</span>}
        {/* Gap между secondary и iconRight */}
        {(hasLabel || hasSecondary) && iconRight && <span className="w-1" aria-hidden="true" />}
        {/* Icon right */}
        {iconRight && <span className="flex items-center justify-center">{iconRight}</span>}
        {/* Right outer spacer */}
        {!iconOnly && <span className="w-1" aria-hidden="true" />}
      </button>
    );
  }
)
Button.displayName = "Button"
