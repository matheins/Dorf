import * as React from "react"

import { cn } from "@/lib/utils"

import { InputRequiredHint } from "./input-required-hint"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, required, ...props }, ref) => {
    return (
      <InputRequiredHint required={required}>
        <textarea
          className={cn(
            "border-input ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-[80px] w-full rounded-md border bg-transparent px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          ref={ref}
          {...props}
        />
      </InputRequiredHint>
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
