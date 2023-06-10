import Link from "next/link"

import { TypographyMuted } from "@/components/typography"

export default function FormLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="container my-8 max-w-3xl">
      {children}
      <div className="mt-8 flex justify-center text-center">
        <Link href="/" target="_blank">
          <TypographyMuted>
            build with{" "}
            <span className="heading font-heading text-foreground">
              Dorf.build
            </span>
          </TypographyMuted>
        </Link>
      </div>
    </div>
  )
}
