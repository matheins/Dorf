import * as React from "react"

import { cn } from "@/lib/utils"

const TypographyH1 = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h1
    className={cn(
      "font-heading scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl",
      className
    )}
    ref={ref}
    {...props}
  />
))
TypographyH1.displayName = "TypographyH1"

const TypographyH2 = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h2
    className={cn(
      "font-heading scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0",
      className
    )}
    ref={ref}
    {...props}
  />
))
TypographyH2.displayName = "TypographyH2"

const TypographyH3 = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "font-heading scroll-m-20 text-2xl font-semibold tracking-tight",
      className
    )}
    {...props}
  />
))
TypographyH3.displayName = "TypographyH3"

const TypographyH4 = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h4
    ref={ref}
    className={cn(
      "font-heading scroll-m-20 text-xl font-semibold tracking-tight",
      className
    )}
    {...props}
  />
))
TypographyH4.displayName = "TypographyH4"

const TypographyP = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("leading-7 [&:not(:first-child)]:mt-6", className)}
    {...props}
  />
))
TypographyP.displayName = "TypographyP"

const TypographyBlockquote = React.forwardRef<
  HTMLQuoteElement,
  React.HTMLAttributes<HTMLQuoteElement>
>(({ className, ...props }, ref) => (
  <blockquote
    ref={ref}
    className={cn("mt-6 border-l-2 pl-6 italic", className)}
    {...props}
  />
))
TypographyBlockquote.displayName = "TypographyBlockquote"

const TypographyUl = React.forwardRef<
  HTMLUListElement,
  React.HTMLAttributes<HTMLUListElement>
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn("my-6 ml-6 list-disc [&>li]:mt-2", className)}
    {...props}
  />
))
TypographyUl.displayName = "TypographyUl"

const TypographyInlineCode = React.forwardRef<
  HTMLUListElement,
  React.HTMLAttributes<HTMLUListElement>
>(({ className, ...props }, ref) => (
  <code
    ref={ref}
    className={cn(
      "bg-muted relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold"
    )}
    {...props}
  />
))
TypographyInlineCode.displayName = "TypographyInlineCode"

const TypographyLead = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-muted-foreground text-xl", className)}
    {...props}
  />
))
TypographyLead.displayName = "TypographyLead"

const TypographyLarge = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-lg font-semibold", className)}
    {...props}
  />
))
TypographyLarge.displayName = "TypographyLarge"

const TypographySmall = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement>
>(({ className, ...props }, ref) => (
  <small
    ref={ref}
    className={cn("text-sm font-medium leading-none", className)}
    {...props}
  />
))
TypographySmall.displayName = "TypographySmall"

const TypographyMuted = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn("text-muted-foreground text-sm")} {...props} />
))
TypographyMuted.displayName = "TypographyMuted"

export {
  TypographyH1,
  TypographyH2,
  TypographyH3,
  TypographyH4,
  TypographyP,
  TypographyBlockquote,
  TypographyUl,
  TypographyInlineCode,
  TypographyLead,
  TypographyLarge,
  TypographySmall,
  TypographyMuted,
}
