import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const statusBadgeVariants = cva(
  "inline-flex items-center rounded-md text-xs font-medium ring-1 ring-inset px-2 py-1 transition-colors",
  {
    variants: {
      variant: {
        default:
          "ring-blue-600/20 text-blue-800 bg-blue-50 dark:bg-blue-400/10 dark:text-blue-500 dark:ring-blue-400/20",
        success:
          "ring-green-600/20 text-green-800 bg-green-50 dark:bg-green-400/10 dark:text-green-500 dark:ring-green-400/20",
        error:
          "ring-red-600/20 text-red-800 bg-red-50 dark:bg-red-400/10 dark:text-red-500 dark:ring-red-400/20",
        warning:
          "ring-yellow-600/20 text-yellow-800 bg-yellow-50 dark:bg-yellow-400/10 dark:text-yellow-500 dark:ring-yellow-400/20",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof statusBadgeVariants> {}

function StatusBadge({ className, variant, ...props }: BadgeProps) {
  return (
    <div
      className={cn(statusBadgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { StatusBadge, statusBadgeVariants }
