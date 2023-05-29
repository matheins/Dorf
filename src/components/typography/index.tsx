export function H1({ children }: { children: React.ReactNode }) {
  return (
    <h1 className="font-heading scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
      {children}
    </h1>
  )
}

export function H2({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-heading scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
      {children}
    </h2>
  )
}

export function H3({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="font-heading scroll-m-20 text-2xl font-semibold tracking-tight">
      {children}
    </h3>
  )
}

export function H4({ children }: { children: React.ReactNode }) {
  return (
    <h4 className="font-heading scroll-m-20 text-xl font-semibold tracking-tight">
      {children}
    </h4>
  )
}

export function P({ children }: { children: React.ReactNode }) {
  return <p className="leading-7 [&:not(:first-child)]:mt-6">{children}</p>
}

export function Blockquote({ children }: { children: React.ReactNode }) {
  return (
    <blockquote className="mt-6 border-l-2 pl-6 italic">{children}</blockquote>
  )
}

export function Ul({ children }: { children: React.ReactNode }) {
  return <ul className="my-6 ml-6 list-disc [&>li]:mt-2">{children}</ul>
}

export function InlineCode({ children }: { children: React.ReactNode }) {
  return (
    <ul className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
      {children}
    </ul>
  )
}

export function Lead({ children }: { children: React.ReactNode }) {
  return <p className="text-xl text-muted-foreground">{children}</p>
}

export function Large({ children }: { children: React.ReactNode }) {
  return <div className="text-lg font-semibold">{children}</div>
}

export function Small({ children }: { children: React.ReactNode }) {
  return <small className="text-sm font-medium leading-none">{children}</small>
}

export function Muted({ children }: { children: React.ReactNode }) {
  return <p className="text-sm text-muted-foreground">{children}</p>
}
