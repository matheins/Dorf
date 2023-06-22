import Link from "next/link"
import { notFound } from "next/navigation"
import dayjs from "dayjs"
import { and, eq } from "drizzle-orm"

import { db } from "@/lib/db"
import { webhooks } from "@/lib/db/schema"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { StatusBadge } from "@/components/ui/status-badge"
import { EmptyPlaceholder } from "@/components/empty-placeholder"
import { DashboardHeader } from "@/components/header"
import { Icons } from "@/components/icons"
import { SecretInput } from "@/components/secret-input"
import { DashboardShell } from "@/components/shell"
import { TypographyH4, TypographyInlineCode } from "@/components/typography"

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
      <div>
        <Link
          className={cn(buttonVariants({ variant: "link" }), "-ml-2")}
          href={`/forms/${webhook.formId}/webhooks`}
        >
          <Icons.arrowLeft className="mr-2 h-4 w-4" /> Webhooks
        </Link>
      </div>
      <DashboardHeader
        heading={"Webhook"}
        text={webhook.endpoint}
      ></DashboardHeader>
      <div className="grid gap-4 px-2 py-4 sm:grid-cols-2 lg:grid-cols-4">
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
          <TypographyH4 className="inline-flex items-center">
            Signing secret
            <Popover>
              <PopoverTrigger>
                <Icons.info className="ml-2 h-4 w-4" />
              </PopoverTrigger>
              <PopoverContent>
                <div className="text-sm">
                  The secret is attached as header param{" "}
                  <TypographyInlineCode>x-dorf-secret</TypographyInlineCode>
                </div>
              </PopoverContent>
            </Popover>
          </TypographyH4>
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
