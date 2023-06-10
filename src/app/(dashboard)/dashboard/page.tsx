import Link from "next/link"
import { eq } from "drizzle-orm"

import { db } from "@/lib/db"
import { forms } from "@/lib/db/schema"
import { buttonVariants } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table"
import { EmptyPlaceholder } from "@/components/empty-placeholder"
import { DashboardHeader } from "@/components/header"
import { DashboardShell } from "@/components/shell"

import { columns } from "./columns"

export const runtime = "edge"

const getForms = async () => {
  const data = await db.query.forms.findMany({
    with: {
      fields: true,
      submissions: true,
    },
    where: eq(forms.archived, false),
  })

  return data
}

const Forms = async () => {
  const forms = await getForms()
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Your forms"
        text="Create and manage your forms."
      >
        <Link href={"/forms/create"} className={buttonVariants()}>
          Create form
        </Link>
      </DashboardHeader>
      <div className="px-2">
        {forms?.length ? (
          <DataTable columns={columns} data={forms} searchColumn="title" />
        ) : (
          <EmptyPlaceholder>
            <EmptyPlaceholder.Icon name="post" />
            <EmptyPlaceholder.Title>No form created</EmptyPlaceholder.Title>
            <EmptyPlaceholder.Description>
              You don&apos;t have any forms yet. Create your first one.
            </EmptyPlaceholder.Description>
            <Link href={"/forms/create"} className={buttonVariants()}>
              Create form
            </Link>
          </EmptyPlaceholder>
        )}
      </div>
    </DashboardShell>
  )
}

export default Forms
