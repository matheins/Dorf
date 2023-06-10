import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip"

interface InputRequiredHintProps {
  children: React.ReactNode
  required?: boolean
}

export const InputRequiredHint = ({
  children,
  required,
}: InputRequiredHintProps) => {
  return (
    <div className="relative">
      {children}
      {required && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger className="flex absolute -top-2 -right-2 bg-muted  rounded-full w-4 h-4 items-center justify-center text-sm text-center font-bold">
              <span className="relative top-[2px]">*</span>
            </TooltipTrigger>
            <TooltipContent>Required</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  )
}
