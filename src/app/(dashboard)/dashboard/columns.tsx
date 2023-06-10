"use client"

import Link from "next/link"
import { setFormArchived, setFormPublished } from "@/actions/forms"
import { ColumnDef } from "@tanstack/react-table"
import dayjs from "dayjs"
import { InferModel } from "drizzle-orm"
import {
  CircleIcon,
  CopyIcon,
  ExternalLinkIcon,
  EyeIcon,
  EyeOffIcon,
  InboxIcon,
  MoreHorizontal,
  PencilIcon,
  Trash2,
} from "lucide-react"

import { siteConfig } from "@/config/site"
import { fields, forms, submissions } from "@/lib/db/schema"
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

type Form = InferModel<typeof forms, "select">
type Field = InferModel<typeof fields, "select">
type Submission = InferModel<typeof submissions, "select">

type FormWithFields = Form & {
  fields: Field[]
  submissions: Submission[]
}

const setPublishForm = async ({
  formId,
  publish,
}: {
  formId: string
  publish: boolean
}) => {
  await setFormPublished({
    id: formId,
    published: publish,
  })
  toast({
    title: `Form ${publish ? "published" : "unpublished"}`,
    description: `Form has been ${publish ? "published" : "unpublished"}`,
  })
}

const setArchiveForm = async ({
  formId,
  archived,
}: {
  formId: string
  archived: boolean
}) => {
  await setFormArchived({
    id: formId,
    archived: archived,
  })
  toast({
    title: `Form ${archived ? "archived" : "unarchived"}`,
    description: `Form has been ${archived ? "archived" : "unarchived"}`,
  })
}

const copyUrl = async ({ url }: { url: string }) => {
  navigator.clipboard.writeText(url)
  toast({
    title: "Copied to clipboard",
    description: "Form URL has been copied to clipboard",
  })
}

export const columns: ColumnDef<FormWithFields>[] = [
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => {
      const form = row.original

      return (
        <Link
          href={`/forms/${form.id}`}
          className="decoration-muted-foreground truncate underline decoration-dashed underline-offset-4"
        >
          {form.title}
        </Link>
      )
    },
  },
  {
    accessorKey: "published",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Published" />
    ),
    cell: ({ row }) => {
      const form = row.original

      return (
        <div className="inline-flex items-center">
          <CircleIcon
            className={cn(
              "mr-2 h-2 w-2 text-transparent",
              form.published ? "fill-green-600" : "fill-yellow-600"
            )}
          />
          <span>{form.published ? "Public" : "Draft"}</span>
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
    id: "submissions",
    accessorKey: "submissions.length",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Submissions" />
    ),
    cell: ({ row }) => {
      const form = row.original

      return <div>{form.submissions.length}</div>
    },
  },
  {
    id: "fields",
    accessorKey: "fields.length",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Fields" />
    ),
    cell: ({ row }) => {
      const form = row.original

      return <div>{form.fields.length}</div>
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const form = row.original

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
                    setPublishForm({
                      formId: form.id,
                      publish: !form.published,
                    })
                  }}
                >
                  {!form.published ? (
                    <>
                      <EyeIcon className="mr-2 h-4 w-4" />
                      <span>Publish</span>
                    </>
                  ) : (
                    <>
                      <EyeOffIcon className="mr-2 h-4 w-4" />
                      <span>Unpublish</span>
                    </>
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    copyUrl({ url: `${siteConfig.url}/f/${form.id}` })
                  }
                >
                  <CopyIcon className="mr-2 h-4 w-4" />
                  <span>Copy link</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem disabled={!form.published} asChild>
                  <Link href={`/f/${form.id}`} target="_blank">
                    <ExternalLinkIcon className="mr-2 h-4 w-4" />
                    <span>Preview form</span>
                  </Link>
                </DropdownMenuItem>
                <Link href={`/forms/${form.id}/edit`}>
                  <DropdownMenuItem>
                    <PencilIcon className="mr-2 h-4 w-4" />
                    <span>Edit form</span>
                  </DropdownMenuItem>
                </Link>
                <Link href={`/forms/${form.id}`}>
                  <DropdownMenuItem>
                    <InboxIcon className="mr-2 h-4 w-4" />
                    <span> View submissions</span>
                  </DropdownMenuItem>
                </Link>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <AlertDialogTrigger asChild>
                <DropdownMenuItem className="text-destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  <span>Archive form</span>
                </DropdownMenuItem>
              </AlertDialogTrigger>
            </DropdownMenuContent>
          </DropdownMenu>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                You are going to archive this form. Its <b>not</b> deleted
                permanently though. You can restore it whenever you want.
              </AlertDialogDescription>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className={buttonVariants({ variant: "destructive" })}
                  onClick={() =>
                    setArchiveForm({ archived: true, formId: form.id })
                  }
                >
                  Archive form
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogHeader>
          </AlertDialogContent>
        </AlertDialog>
      )
    },
  },
]
