interface DashboardHeaderProps {
  heading: string | React.ReactNode
  text?: string
  children?: React.ReactNode
}

export function DashboardHeader({
  heading,
  text,
  children,
}: DashboardHeaderProps) {
  return (
    <div className="flex flex-col justify-between px-2 lg:flex-row lg:items-center">
      <div className="grid gap-1">
        <h1 className="font-heading text-3xl md:text-4xl">{heading}</h1>
        {text && <p className="text-muted-foreground text-lg">{text}</p>}
      </div>
      {children}
    </div>
  )
}
