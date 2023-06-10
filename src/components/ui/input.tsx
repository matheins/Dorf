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
            <Icon className="h-4 w-4 text-muted-foreground opacity-50" />
          </div>
        )}
        <input
          type={type}
          className={cn(
            "flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
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
