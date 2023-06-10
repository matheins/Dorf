import { DashboardHeader } from "@/components/header"
import { DashboardShell } from "@/components/shell"

const Settings = async () => {
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Your forms"
        text="Create and manage your forms."
      ></DashboardHeader>
      <p>placeholder</p>
    </DashboardShell>
  )
}

export default Settings
