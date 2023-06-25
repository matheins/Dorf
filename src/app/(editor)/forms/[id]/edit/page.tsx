import { eq } from "drizzle-orm"

import { db } from "@/lib/db"
import { forms } from "@/lib/db/schema"
import { getCurrentUser } from "@/lib/session"
import { Editor } from "@/components/editor"

const getForm = async ({ id }: { id: string }) => {
  const form = await db.query.forms.findFirst({
    where: eq(forms.id, id),
    with: {
      fields: {
        orderBy: (fields, { asc }) => [asc(fields.createdAt)],
      },
    },
  })

  if (!form) {
    throw new Error("Form not found")
  }

  return form
}

const EditForm = async ({ params: { id } }: { params: { id: string } }) => {
  const form = await getForm({ id })
  const user = await getCurrentUser()

  if (!user) return null

  return <Editor form={form} user={user} />
}

export default EditForm
