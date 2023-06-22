import Link from "next/link"
import { and, eq } from "drizzle-orm"

import { db } from "@/lib/db"
import { forms, webhooks } from "@/lib/db/schema"
import { DataTable } from "@/components/ui/data-table"
import { EmptyPlaceholder } from "@/components/empty-placeholder"
import { DashboardHeader } from "@/components/header"
import { DashboardShell } from "@/components/shell"

import { CreateWebhookButton } from "./_components/create-webhook-button"
import { columns } from "./columns"

const getWebhooks = async ({ id }: { id: string }) => {
  const res = await db.query.webhooks.findMany({
    where: and(eq(webhooks.formId, id), eq(webhooks.deleted, false)),
  })

  return res
}

const getForm = async ({ id }: { id: string }) => {
  const form = await db.query.forms.findFirst({
    where: eq(forms.id, id),
    columns: {
      title: true,
    },
  })

  if (!form) {
    throw new Error("Form not found")
  }

  return form
}

const Webhooks = async ({ params: { id } }: { params: { id: string } }) => {
  const webhooks = await getWebhooks({ id })
  const { title } = await getForm({ id })

  return (
    <DashboardShell>
      <DashboardHeader
        heading={
          <>
            <span className="text-muted-foreground">...</span>
            <span className="text-muted-foreground px-2">/</span>
            <Link className="text-muted-foreground" href="/forms">
              {title}
            </Link>
            <span className="text-muted-foreground px-2">/</span>
            <span>Webhooks</span>
          </>
        }
      >
        <CreateWebhookButton formId={id} />
      </DashboardHeader>
      <div className="overflow-hidden px-2">
        {webhooks?.length ? (
          <DataTable columns={columns} data={webhooks} />
        ) : (
          <EmptyPlaceholder>
            <EmptyPlaceholder.Icon name="webhook" />
            <EmptyPlaceholder.Title>No webhook created</EmptyPlaceholder.Title>
            <EmptyPlaceholder.Description>
              You don&apos;t have any webhooks yet. Create your first one.
            </EmptyPlaceholder.Description>
            <CreateWebhookButton formId={id} />
          </EmptyPlaceholder>
        )}
      </div>
    </DashboardShell>
  )
}

export default Webhooks
