import { ClassValue, clsx } from "clsx"
import { InferModel } from "drizzle-orm"
import saveAs from "file-saver"
import { parse } from "json2csv"
import { twMerge } from "tailwind-merge"

import { env } from "@/env.mjs"

import { submissions } from "./db/schema"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function absoluteUrl(path: string) {
  return `${env.NEXT_PUBLIC_APP_URL}${path}`
}

type Submission = InferModel<typeof submissions, "select">
export const convertSubmissionsToCsv = (submissions: Submission[]): string => {
  const flattenedData = submissions.map((submission) => {
    const jsonData = JSON.parse(JSON.stringify(submission.data))

    jsonData.createdAt = submission.createdAt

    return jsonData
  })

  const headerSet = new Set<string>()
  const records: any[][] = []

  for (const submission of flattenedData) {
    const fields = Object.keys(submission)
    fields.forEach((field) => headerSet.add(field))

    const record = fields.map((field) => submission[field])
    records.push(record)
  }

  const opts = { fields: Array.from(headerSet) }

  try {
    const csvData = parse(flattenedData, opts)
    return csvData
  } catch (error) {
    console.error("Error converting JSON to CSV:", error)
    throw error
  }
}

export const downloadFile = async (url: string, filename: string) => {
  const data = await fetch(url)
  const blob = await data.blob()
  saveAs(blob, filename)
}
