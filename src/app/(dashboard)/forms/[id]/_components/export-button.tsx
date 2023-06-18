"use client"

import React from "react"
import { DownloadIcon, Loader2Icon } from "lucide-react"

import { downloadFile } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export default function ExportButton({ formId }: { formId: string }) {
  const [isLoading, setLoading] = React.useState(false)
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    await downloadFile(
      `/api/forms/${formId}/submissions/export?format=csv`,
      "submissions.csv"
    )
    setLoading(false)
  }
  return (
    <form onSubmit={handleSubmit}>
      <Button type="submit" variant={"secondary"} disabled={isLoading}>
        {isLoading ? (
          <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <DownloadIcon className="mr-2 h-4 w-4" />
        )}
        Export CSV
      </Button>
    </form>
  )
}
