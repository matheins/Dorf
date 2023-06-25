import { notFound } from "next/navigation"

import { getCurrentUser } from "@/lib/session"
import { CreateFormForm } from "@/components/create-form-form"
import { DashboardHeader } from "@/components/header"
import { DashboardShell } from "@/components/shell"

const CreateForm = async () => {
  const user = await getCurrentUser()

  if (!user) return notFound()

  return (
    <DashboardShell>
      <DashboardHeader heading="Create new form" />
      <div className="grid gap-10">
        <CreateFormForm user={user} />
      </div>
    </DashboardShell>
  )
}

export default CreateForm
