import Link from "next/link"
import { notFound } from "next/navigation"
import dayjs from "dayjs"
import { and, eq } from "drizzle-orm"

import { db } from "@/lib/db"
import { webhooks } from "@/lib/db/schema"
import { Badge } from "@/components/ui/badge"
import { DataTable } from "@/components/ui/data-table"
import { StatusBadge } from "@/components/ui/status-badge"
import { EmptyPlaceholder } from "@/components/empty-placeholder"
import { DashboardHeader } from "@/components/header"
import { SecretInput } from "@/components/secret-input"
import { DashboardShell } from "@/components/shell"
import { TypographyH4 } from "@/components/typography"

import { columns } from "./columns"

const getWebhook = async ({ id }: { id: string }) => {
  const res = await db.query.webhooks.findFirst({
    where: and(eq(webhooks.id, id), eq(webhooks.deleted, false)),
    with: {
      form: true,
      webhookEvents: {
        orderBy: (webhookEvents, { desc }) => [desc(webhookEvents.createdAt)],
      },
    },
  })

  if (!res) {
    notFound()
  }

  return res
}

const Webhook = async ({
  params: { webhookId },
}: {
  params: { webhookId: string }
}) => {
  const webhook = await getWebhook({ id: webhookId })

  return (
    <DashboardShell>
      <DashboardHeader
        heading={
          <>
            <span className="text-muted-foreground">...</span>
            <span className="text-muted-foreground px-2">/</span>
            <Link
              href={`/forms/${webhook.formId}/webhooks`}
              className="text-muted-foreground"
            >
              Webhooks
            </Link>
            <span className="text-muted-foreground px-2">/</span>
            <span>{webhook.endpoint}</span>
          </>
        }
      ></DashboardHeader>
      <div className="grid grid-cols-2 gap-4 py-4 lg:grid-cols-4">
        <div className="space-y-2">
          <TypographyH4>Created</TypographyH4>
          <div>{dayjs(webhook.createdAt).format("MMM D, YYYY")}</div>
        </div>
        <div className="space-y-2">
          <TypographyH4>Status</TypographyH4>
          <StatusBadge variant={webhook.enabled ? "success" : "error"}>
            {webhook.enabled ? "Enabled" : "Disabled"}
          </StatusBadge>
        </div>
        <div className="space-y-2">
          <TypographyH4>Listening for</TypographyH4>
          <Badge>submission.created</Badge>
        </div>
        <div className="space-y-2">
          <TypographyH4>Signing secret</TypographyH4>
          <SecretInput value={webhook.secretKey} />
        </div>
      </div>
      <div className="overflow-hidden px-2">
        {webhook.webhookEvents?.length ? (
          <DataTable columns={columns} data={webhook.webhookEvents} />
        ) : (
          <EmptyPlaceholder>
            <EmptyPlaceholder.Icon name="activity" />
            <EmptyPlaceholder.Title>No activity</EmptyPlaceholder.Title>
            <EmptyPlaceholder.Description>
              You don&apos;t have any webhook events yet.
            </EmptyPlaceholder.Description>
          </EmptyPlaceholder>
        )}
      </div>
    </DashboardShell>
  )
}

export default Webhook
