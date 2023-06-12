import { notFound } from "next/navigation"
import { eq } from "drizzle-orm"

import { db } from "@/lib/db"
import { forms } from "@/lib/db/schema"
import { Separator } from "@/components/ui/separator"
import { FormRenderer } from "@/components/form-renderer"
import { TypographyH1, TypographyLead } from "@/components/typography"

const getForm = async ({ id }: { id: string }) => {
  const form = await db.query.forms.findFirst({
    where: eq(forms.id, id),
    with: {
      fields: {
        orderBy: (fields, { asc }) => [asc(fields.createdAt)],
      },
    },
  })

  return form
}

const Form = async ({ params }: { params: { id: string } }) => {
  const { id } = params

  const form = await getForm({ id })

  if (!form?.published || form.archived) {
    notFound()
  }

  return (
    <div>
      <div className="space-y-8">
        <TypographyH1>{form.title}</TypographyH1>
        <TypographyLead>{form.description}</TypographyLead>
      </div>
      <Separator className="mb-8 mt-4" />
      <FormRenderer form={form} />
    </div>
  )
}

export default Form
