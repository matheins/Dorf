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
            <TooltipTrigger className="bg-muted absolute -right-2 -top-2 flex  h-4 w-4 items-center justify-center rounded-full text-center text-sm font-bold">
              <span className="relative top-[2px]">*</span>
            </TooltipTrigger>
            <TooltipContent>Required</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  )
}
