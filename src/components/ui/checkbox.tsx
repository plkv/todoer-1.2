"use client"

import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { CheckFat } from "@phosphor-icons/react"

import { cn } from "@/lib/utils"

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      "w-4 h-4 min-w-4 min-h-4 rounded-[4px] border border-[hsl(var(--brd-prim))] bg-transparent flex items-center justify-center transition-colors duration-150 data-[state=checked]:bg-[hsl(var(--accent-prim))] data-[state=checked]:border-[hsl(var(--accent-prim))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
      className
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator className="flex items-center justify-center text-content-prim data-[state=checked]:text-[hsl(var(--on-dark-content-prim))]">
      <CheckFat className="w-2.5 h-2.5" weight="fill" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
))
Checkbox.displayName = CheckboxPrimitive.Root.displayName

export { Checkbox }
