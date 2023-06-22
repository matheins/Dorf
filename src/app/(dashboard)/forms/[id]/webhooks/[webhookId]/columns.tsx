"use client"

import { ColumnDef } from "@tanstack/react-table"
import dayjs from "dayjs"
import { InferModel } from "drizzle-orm"

import { webhookEvents } from "@/lib/db/schema"
import { DataTableColumnHeader } from "@/components/ui/data-column-header"
import { StatusBadge } from "@/components/ui/status-badge"

type WebhookEvent = InferModel<typeof webhookEvents, "select">

export const columns: ColumnDef<WebhookEvent>[] = [
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const event = row.original

      return (
        <StatusBadge
          className="capitalize"
          variant={
            event.status === "success"
              ? "success"
              : event.status === "failed"
              ? "error"
              : "default"
          }
        >
          {event.status}
        </StatusBadge>
      )
    },
  },
  {
    accessorKey: "event",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Event type" />
    ),
    cell: ({ row }) => {
      const event = row.original

      return <div>{event.event}</div>
    },
  },
  {
    accessorKey: "submissionId",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Submission ID" />
    ),
    cell: ({ row }) => {
      const event = row.original

      return <div>{event.submissionId}</div>
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created at" />
    ),
    cell: ({ row }) => {
      const form = row.original

      return <div>{dayjs(form.createdAt).format("MMM D, YYYY - hh:mm")}</div>
    },
  },
  {
    accessorKey: "statusCode",
    header: "Status Code",
    cell: ({ row }) => {
      const event = row.original

      return (
        <StatusBadge
          className="capitalize"
          variant={event.statusCode === 200 ? "success" : "error"}
        >
          {event.statusCode}
        </StatusBadge>
      )
    },
  },
  {
    accessorKey: "attemptCount",
    header: "Attempts",
  },
]
