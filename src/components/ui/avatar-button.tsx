import * as React from "react"
import { cn } from "@/lib/utils"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

export interface AvatarButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  user?: {
    name?: string
    email?: string
    picture?: string
  }
}

export const AvatarButton = React.forwardRef<HTMLButtonElement, AvatarButtonProps>(
  ({ user, className, children, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        variant="ghost"
        size="icon"
        className={cn("h-btn-l w-btn-l min-w-btn-l min-h-btn-l rounded-btn", className)}
        {...props}
      >
        <Avatar className="size-7 rounded-lg">
          {user?.picture ? (
            <AvatarImage src={user.picture} alt={user.name || 'User'} className="h-full w-full rounded-lg" />
          ) : (
            <AvatarFallback className="h-full w-full rounded-lg">{user?.name?.[0] || '?'}</AvatarFallback>
          )}
        </Avatar>
        {children}
      </Button>
    );
  }
);
AvatarButton.displayName = 'AvatarButton'; 