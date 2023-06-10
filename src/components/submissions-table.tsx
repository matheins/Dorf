import React from "react"
import { ColumnDef } from "@tanstack/react-table"
import { desc, eq, InferModel } from "drizzle-orm"

import { db } from "@/lib/db"
import { submissions } from "@/lib/db/schema"

import { DataTable } from "./ui/data-table"

const getSubmissions = async (formId: string) => {
  const data = await db.query.submissions.findMany({
    where: eq(submissions.formId, formId),
    orderBy: desc(submissions.createdAt),
  })

  return data
}
type Submission = InferModel<typeof submissions>

export const SubmissionsTable = async ({ formId }: { formId: string }) => {
  const submissions = await getSubmissions(formId)

  const columns = () => {
    const allKeys = submissions.reduce<string[]>((keys, submission) => {
      const submissionKeys = Object.keys(
        JSON.parse(JSON.stringify(submission.data))
      )
      return keys.concat(submissionKeys)
    }, [])

    // Create columns for each unique key in the data objects
    const uniqueKeys = [...new Set(allKeys)]
    const dynamicColumns: ColumnDef<Submission>[] = uniqueKeys.map((key) => ({
      header: key,
      accessorKey: `data.${key}`,
    }))

    // Add the title column
    const staticColumns: ColumnDef<Submission>[] = [
      {
        accessorKey: "createdAt",
        header: "Created at",
        // cell: async ({ row }) => {
        //   const form = row.original

        //   return <div>{dayjs(form.createdAt).format("MMM D, YYYY")}</div>
        // },
      },
    ]

    return staticColumns.concat(dynamicColumns)
  }

  return <DataTable columns={columns()} data={submissions} />
}
