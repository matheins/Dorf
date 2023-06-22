"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

interface FormNavProps extends React.HTMLAttributes<HTMLDivElement> {
  formId: string
}

export function FormNav({ className, formId, ...props }: FormNavProps) {
  const pathname = usePathname()

  const nav = [
    {
      title: "Submissions",
      href: `/forms/${formId}`,
    },
    {
      title: "Webhooks",
      href: `/forms/${formId}/webhooks`,
      label: "beta",
    },
  ]

  return (
    <div className="relative">
      <ScrollArea className="max-w-[600px] lg:max-w-none">
        <div className={cn("flex items-center", className)} {...props}>
          {nav.map((item) => (
            <Link
              href={item.href}
              key={item.href}
              className={cn(
                "flex items-center px-4",
                pathname === item.href
                  ? "text-primary font-bold"
                  : "text-muted-foreground font-medium"
              )}
            >
              {item.title}{" "}
              {item.label && (
                <span className="ml-2 rounded-md bg-[#adfa1d] px-1.5 py-0.5 text-xs font-medium leading-none text-[#000000] no-underline group-hover:no-underline">
                  {item.label}
                </span>
              )}
            </Link>
          ))}
        </div>
        <ScrollBar orientation="horizontal" className="invisible" />
      </ScrollArea>
    </div>
  )
}
