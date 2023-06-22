import Link from "next/link"
import { and, eq } from "drizzle-orm"

import { db } from "@/lib/db"
import { forms, webhooks } from "@/lib/db/schema"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table"
import { EmptyPlaceholder } from "@/components/empty-placeholder"
import { DashboardHeader } from "@/components/header"
import { Icons } from "@/components/icons"
import { DashboardShell } from "@/components/shell"

import { FormNav } from "../_components/form-nav"
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
      <div>
        <Link
          className={cn(buttonVariants({ variant: "link" }), "-ml-2")}
          href={"/forms"}
        >
          <Icons.arrowLeft className="mr-2 h-4 w-4" />
          All forms
        </Link>
      </div>
      <DashboardHeader
        heading={title}
        text="Create webhooks to connect with other applications and keep track of your submissions."
      >
        <CreateWebhookButton formId={id} />
      </DashboardHeader>
      <FormNav formId={id} />
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
