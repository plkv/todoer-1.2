import { useTheme } from "@/hooks/useTheme"
import { Toaster as Sonner, toast } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { isDark } = useTheme()

  return (
    <Sonner
      theme={isDark ? "dark" : "light"}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-fill-prim group-[.toaster]:text-content-prim group-[.toaster]:border-brd-prim group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-content-sec",
          actionButton:
            "group-[.toast]:bg-accent-prim group-[.toast]:text-content-prim",
          cancelButton:
            "group-[.toast]:bg-fill-sec group-[.toast]:text-content-sec",
        },
      }}
      {...props}
    />
  )
}

export { Toaster, toast }
