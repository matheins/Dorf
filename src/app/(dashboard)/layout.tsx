import Link from "next/link"
import { notFound } from "next/navigation"

import { getCurrentUser } from "@/lib/session"
import { FeedbackButton } from "@/components/feedback-button"
import { Icons } from "@/components/icons"
import { SiteFooter } from "@/components/site-footer"
import { UserAccountNav } from "@/components/user-account-nav"

interface DashboardLayoutProps {
  children?: React.ReactNode
}

export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const user = await getCurrentUser()

  if (!user) {
    return notFound()
  }

  return (
    <div className="flex min-h-screen flex-col space-y-6">
      <header className="bg-background sticky top-0 z-40 border-b">
        <div className="container flex h-16 items-center justify-between py-4">
          <Link href="/dashboard">
            <Icons.logoWord className="w-24" />
          </Link>
          <div className="flex gap-4">
            <FeedbackButton size={"sm"} />
            <UserAccountNav
              user={{
                name: user.name,
                image: user.image,
                email: user.email,
              }}
            />
          </div>
        </div>
      </header>
      <div className="container flex-1 gap-12">
        <main className="flex w-full flex-col overflow-hidden">{children}</main>
      </div>
      <SiteFooter className="border-t" />
    </div>
  )
}
