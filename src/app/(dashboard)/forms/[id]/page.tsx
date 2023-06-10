import Link from "next/link"
import { eq } from "drizzle-orm"
import { ExternalLinkIcon } from "lucide-react"

import { db } from "@/lib/db"
import { forms } from "@/lib/db/schema"
import { buttonVariants } from "@/components/ui/button"
import { DashboardHeader } from "@/components/header"
import { DashboardShell } from "@/components/shell"
import { SubmissionsTable } from "@/components/submissions-table"
import { TypographyH2 } from "@/components/typography"

export const runtime = "edge"

const getForm = async ({ id }: { id: string }) => {
  const form = await db.query.forms.findFirst({
    where: eq(forms.id, id),
    with: {
      submissions: true,
    },
  })

  if (!form) {
    throw new Error("Form not found")
  }

  return form
}

const Form = async ({ params: { id } }: { params: { id: string } }) => {
  const form = await getForm({ id })

  return (
    <DashboardShell>
      <DashboardHeader
        heading={
          <>
            <Link className="text-muted-foreground" href="/forms">
              Your forms
            </Link>
            <span className="px-2 text-muted-foreground">/</span>
            <span>{form.title}</span>
          </>
        }
        text="Explore submissions."
      >
        <div className="flex flex-col md:flex-row gap-2 justify-end w-full md:w-fit">
          <Link
            href={`/f/${form.id}`}
            target="_blank"
            className={buttonVariants({ variant: "outline" })}
          >
            Preview
            <ExternalLinkIcon className="w-4 h-4 ml-2" />
          </Link>
          <Link href={`/forms/${form.id}/edit`} className={buttonVariants()}>
            Edit
          </Link>
        </div>
      </DashboardHeader>
      <TypographyH2>Submissions</TypographyH2>

      {/* @ts-expect-error Async Server Component */}
      <SubmissionsTable formId={form.id} />
    </DashboardShell>
  )
}

export default Form
