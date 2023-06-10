import * as React from "react"
import { AtSignIcon } from "lucide-react"

import { cn } from "@/lib/utils"

import { Icons } from "../icons"
import { InputRequiredHint } from "./input-required-hint"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: keyof typeof Icons
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, required, icon, ...props }, ref) => {
    const Icon = icon ? Icons[icon] : undefined

    return (
      <InputRequiredHint required={required}>
        {Icon && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Icon className="text-muted-foreground h-4 w-4 opacity-50" />
          </div>
        )}
        <input
          type={type}
          className={cn(
            "border-input ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border bg-transparent px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            Icon ? "pl-10" : "pl-3",
            className
          )}
          ref={ref}
          {...props}
        />
      </InputRequiredHint>
    )
  }
)
Input.displayName = "Input"

export { Input }
