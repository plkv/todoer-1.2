import * as React from 'react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarImage, AvatarFallback } from './avatar';

interface AvatarButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  user?: { picture?: string | null; name?: string | null };
}

export const AvatarButton = React.forwardRef<HTMLButtonElement, AvatarButtonProps>(
  ({ user, className, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        type={props.type || 'button'}
        disabled={disabled}
        className={cn(
          'inline-flex items-center justify-center p-[6px] h-9 w-9 min-w-[36px] min-h-[36px] rounded-[8px] transition-colors select-none outline-none',
          'bg-transparent text-content-prim',
          'hover:bg-fill-sec active:bg-fill-prim disabled:opacity-60',
          'focus-visible:ring-2 focus-visible:ring-accent-prim focus-visible:ring-offset-2',
          className
        )}
        {...props}
      >
        <Avatar className="h-full w-full">
          {user?.picture ? (
            <AvatarImage src={user.picture} alt={user.name || 'User'} className="h-full w-full rounded-full" style={{ borderRadius: 999 }} />
          ) : (
            <AvatarFallback className="h-full w-full rounded-full" style={{ borderRadius: 999 }}>{user?.name?.[0] || '?'}</AvatarFallback>
          )}
        </Avatar>
        {children}
      </button>
    );
  }
);
AvatarButton.displayName = 'AvatarButton'; 