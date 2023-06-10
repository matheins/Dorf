"use client"

import React from "react"
import Link from "next/link"
import { ColumnDef } from "@tanstack/react-table"
import dayjs from "dayjs"
import { InferModel } from "drizzle-orm"
import {
  CopyIcon,
  ExternalLinkIcon,
  InboxIcon,
  MoreHorizontal,
  PencilIcon,
} from "lucide-react"

import { siteConfig } from "@/config/site"
import { submissions } from "@/lib/db/schema"
import { Button } from "@/components/ui/button"
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

type Submission = InferModel<typeof submissions, "select">

export const columns = ({ submissions }: { submissions: Submission[] }) => {
  const allKeys = submissions.reduce<string[]>((keys, submission) => {
    const submissionKeys = Object.keys(
      JSON.parse(JSON.stringify(submission.data))
    )
    return keys.concat(submissionKeys)
  }, [])

  const uniqueKeys = [...new Set(allKeys)]
  const dynamicColumns: ColumnDef<Submission>[] = uniqueKeys.map((key) => ({
    header: key,
    accessorKey: `data.${key}`,
  }))

  const staticColumns: ColumnDef<Submission>[] = [
    {
      accessorKey: "createdAt",
      header: "Created at",
      // header: ({ column }) => (
      //   <DataTableColumnHeader column={column} title="Created at" />
      // ),
      // cell: ({ row }) => {
      //   const form = row.original

      //   return <div>{dayjs(form.createdAt).format("MMM D, YYYY")}</div>
      // },
    },
  ]

  return staticColumns.concat(dynamicColumns)

  // [
  //   {
  //     accessorKey: "createdAt",
  //     header: ({ column }) => (
  //       <DataTableColumnHeader column={column} title="Created at" />
  //     ),
  //     cell: ({ row }) => {
  //       const form = row.original

  //       return <div>{dayjs(form.createdAt).format("MMM D, YYYY")}</div>
  //     },
  //   },
  // {
  //   accessorKey: "data",
  //   header: "Data",
  //   // cell: ({ row }) => {
  //   //   const form = row.original

  //   //   return <div>{dayjs(form.createdAt).format("MMM D, YYYY")}</div>
  //   // },
  // },
  // iterate ofer all keys in submission.data
  // if key is in submission.data, add it to the columns
  // ...[
  //   ...new Set(
  //     submissions.flatMap((s) =>
  //       Object.keys(JSON.parse(JSON.stringify(s.data)))
  //     )
  //   ),
  // ].map((key) => ({
  //   accessorKey: `data.${key}`,
  //   // @ts-ignore-next-line
  //   header: key,
  //   // @ts-ignore-next-line
  //   cell: ({ row }) => {
  //     const form = row.original

  //     return <div>{form.data[key]}</div>
  //   },
  // })),

  // {
  //   id: "actions",
  //   cell: ({ row }) => {
  //     const form = row.original

  //     return (
  //       <DropdownMenu>
  //         <DropdownMenuTrigger asChild>
  //           <Button variant="ghost" className="h-8 w-8 p-0">
  //             <span className="sr-only">Open menu</span>
  //             <MoreHorizontal className="h-4 w-4" />
  //           </Button>
  //         </DropdownMenuTrigger>
  //         <DropdownMenuContent align="end">
  //           <DropdownMenuLabel>Actions</DropdownMenuLabel>
  //           <DropdownMenuGroup>
  //             <DropdownMenuItem
  //               onClick={() =>
  //                 navigator.clipboard.writeText(
  //                   `${siteConfig.url}/f/${form.id}`
  //                 )
  //               }
  //             >
  //               <CopyIcon className="w-4 h-4 mr-2" />
  //               <span>Copy link</span>
  //             </DropdownMenuItem>
  //             <DropdownMenuSeparator />
  //             <Link href={`/f/${form.id}`} target="_blank">
  //               <DropdownMenuItem>
  //                 <ExternalLinkIcon className="w-4 h-4 mr-2" />
  //                 <span>Preview form</span>
  //               </DropdownMenuItem>
  //             </Link>
  //             <Link href={`/forms/${form.id}/edit`}>
  //               <DropdownMenuItem>
  //                 <PencilIcon className="w-4 h-4 mr-2" />
  //                 <span>Edit form</span>
  //               </DropdownMenuItem>
  //             </Link>
  //             <Link href={`/forms/${form.id}`}>
  //               <DropdownMenuItem>
  //                 <InboxIcon className="w-4 h-4 mr-2" />
  //                 <span> View submissions</span>
  //               </DropdownMenuItem>
  //             </Link>
  //           </DropdownMenuGroup>
  //         </DropdownMenuContent>
  //       </DropdownMenu>
  //     )
  //   },
  // },
  // ]
}
