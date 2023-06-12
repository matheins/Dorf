import { eq } from "drizzle-orm"

import { db } from "@/lib/db"
import { forms } from "@/lib/db/schema"

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

const FormSettings = async ({ params: { id } }: { params: { id: string } }) => {
  const form = await getForm({ id })

  return <div className="py-8">Settings</div>
}

export default FormSettings
