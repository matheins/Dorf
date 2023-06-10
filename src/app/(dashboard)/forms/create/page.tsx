import { CreateFormForm } from "@/components/create-form-form"
import { DashboardHeader } from "@/components/header"
import { DashboardShell } from "@/components/shell"

export const runtime = "edge"

const CreateForm = async () => {
  return (
    <DashboardShell>
      <DashboardHeader heading="Create new form" />
      <div className="grid gap-10">
        <CreateFormForm />
      </div>
    </DashboardShell>
  )
}

export default CreateForm
