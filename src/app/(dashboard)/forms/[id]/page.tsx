import Link from "next/link"
import { eq } from "drizzle-orm"
import { ExternalLinkIcon } from "lucide-react"

import { db } from "@/lib/db"
import { forms } from "@/lib/db/schema"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { DashboardHeader } from "@/components/header"
import { Icons } from "@/components/icons"
import { DashboardShell } from "@/components/shell"
import { TypographyH2 } from "@/components/typography"

import { FormNav } from "./_components/form-nav"
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
      <div>
        <Link
          className={cn(buttonVariants({ variant: "link" }), "-ml-2")}
          href={"/forms"}
        >
          <Icons.arrowLeft className="mr-2 h-4 w-4" />
          All forms
        </Link>
      </div>
      <DashboardHeader heading={form.title} text="Explore submissions.">
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
      <FormNav formId={id} />
      {/* @ts-expect-error Async Server Component */}
      <SubmissionsTable formId={form.id} />
    </DashboardShell>
  )
}

export default Form
