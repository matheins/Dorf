import Link from "next/link"

import { TypographyMuted } from "@/components/typography"

export default function FormLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="container max-w-3xl my-8">
      {children}
      <div className="flex text-center mt-8 justify-center">
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
