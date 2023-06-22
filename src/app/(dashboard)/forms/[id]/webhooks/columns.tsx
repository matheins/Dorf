"use client"

import Link from "next/link"
import { setWebhookDeleted, setWebhookEnabled } from "@/actions/webhooks"
import { ColumnDef } from "@tanstack/react-table"
import dayjs from "dayjs"
import { InferModel } from "drizzle-orm"
import {
  CircleIcon,
  EyeIcon,
  EyeOffIcon,
  MoreHorizontal,
  Trash2,
} from "lucide-react"

import { webhooks } from "@/lib/db/schema"
import { cn } from "@/lib/utils"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button, buttonVariants } from "@/components/ui/button"
import { DataTableColumnHeader } from "@/components/ui/data-column-header"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "@/components/ui/use-toast"

type Webhook = InferModel<typeof webhooks, "select">

const triggerWebhookEnabled = async ({
  webhookId,
  enabled,
}: {
  webhookId: string
  enabled: boolean
}) => {
  await setWebhookEnabled({
    id: webhookId,
    enabled,
  })
  toast({
    title: `Webhook ${enabled ? "enabled" : "disabled"}`,
    description: `Webjook has been ${enabled ? "enabled" : "disabled"}`,
  })
}

const deleteWebhook = async ({
  webhookId,
  deleted,
}: {
  webhookId: string
  deleted: boolean
}) => {
  await setWebhookDeleted({
    id: webhookId,
    deleted: deleted,
  })
  toast({
    title: `Webhook deleted`,
    description: `Webhook has been deleted permanently`,
  })
}

export const columns: ColumnDef<Webhook>[] = [
  {
    accessorKey: "endpoint",
    header: "Endpoint",
    cell: ({ row }) => {
      const webhook = row.original

      return (
        <Link
          href={`/forms/${webhook.formId}/webhooks/${webhook.id}`}
          className="decoration-muted-foreground truncate underline decoration-dashed underline-offset-4"
        >
          {webhook.endpoint}
        </Link>
      )
    },
  },
  {
    accessorKey: "enabled",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const webhook = row.original

      return (
        <div className="inline-flex items-center">
          <CircleIcon
            className={cn(
              "mr-2 h-2 w-2 text-transparent",
              webhook.enabled ? "fill-green-600" : "fill-red-600"
            )}
          />
          <span>{webhook.enabled ? "Enabled" : "Disabled"}</span>
        </div>
      )
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created at" />
    ),
    cell: ({ row }) => {
      const form = row.original

      return <div>{dayjs(form.createdAt).format("MMM D, YYYY")}</div>
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const webhook = row.original

      return (
        <AlertDialog>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuGroup>
                <DropdownMenuItem
                  onClick={() => {
                    triggerWebhookEnabled({
                      webhookId: webhook.id,
                      enabled: !webhook.enabled,
                    })
                  }}
                >
                  {!webhook.enabled ? (
                    <>
                      <EyeIcon className="mr-2 h-4 w-4" />
                      <span>Enable</span>
                    </>
                  ) : (
                    <>
                      <EyeOffIcon className="mr-2 h-4 w-4" />
                      <span>Disable</span>
                    </>
                  )}
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <AlertDialogTrigger asChild>
                <DropdownMenuItem className="text-destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  <span>Delete webhook</span>
                </DropdownMenuItem>
              </AlertDialogTrigger>
            </DropdownMenuContent>
          </DropdownMenu>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                You are going to delete this webhook permanently.
              </AlertDialogDescription>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className={buttonVariants({ variant: "destructive" })}
                  onClick={() =>
                    deleteWebhook({ deleted: true, webhookId: webhook.id })
                  }
                >
                  Delete webhook
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogHeader>
          </AlertDialogContent>
        </AlertDialog>
      )
    },
  },
]
