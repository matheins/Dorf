import Link from "next/link"
import { eq } from "drizzle-orm"
import { ExternalLinkIcon } from "lucide-react"

import { db } from "@/lib/db"
import { forms } from "@/lib/db/schema"
import { buttonVariants } from "@/components/ui/button"
import { DashboardHeader } from "@/components/header"
import { DashboardShell } from "@/components/shell"
import { TypographyH2 } from "@/components/typography"

import { SubmissionsTable } from "./_components/submissions-table"

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
            <span className="text-muted-foreground px-2">/</span>
            <span>{form.title}</span>
          </>
        }
        text="Explore submissions."
      >
        <div className="flex w-full flex-col justify-end gap-2 md:w-fit md:flex-row">
          <Link
            href={`/f/${form.id}`}
            target="_blank"
            className={buttonVariants({ variant: "outline" })}
          >
            Preview
            <ExternalLinkIcon className="ml-2 h-4 w-4" />
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
