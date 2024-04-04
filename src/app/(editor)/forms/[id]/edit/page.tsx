import { notFound } from "next/navigation"
import { and, eq } from "drizzle-orm"

import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { forms } from "@/lib/db/schema"
import { getCurrentUser } from "@/lib/session"
import { Editor } from "@/components/editor"

const getForm = async ({ id }: { id: string }) => {
  const session = await auth()
  if (!session) return undefined

  const form = await db.query.forms.findFirst({
    where: and(eq(forms.id, id), eq(forms.userId, session.user.id)),
    with: {
      fields: {
        orderBy: (fields, { asc }) => [asc(fields.createdAt)],
      },
    },
  })

  if (!form) return undefined

  return form
}

const EditForm = async ({ params: { id } }: { params: { id: string } }) => {
  const form = await getForm({ id })
  const user = await getCurrentUser()

  if (!form) notFound()
  if (!user) return null

  return <Editor form={form} user={user} />
}

export default EditForm
