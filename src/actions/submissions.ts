"use server"

import { headers } from "next/headers"
import { createInsertSchema } from "drizzle-zod"
import { z } from "zod"

import { db } from "@/lib/db"
import { submissions } from "@/lib/db/schema"
import { Event } from "@/lib/events"
import { generateId } from "@/lib/id"
import { ratelimit } from "@/lib/ratelimiter"

const createSubmissionSchema = createInsertSchema(submissions).pick({
  formId: true,
  data: true,
})
type CreateSubmission = z.infer<typeof createSubmissionSchema>

export const createSubmission = async (data: CreateSubmission) => {
  const submission = createSubmissionSchema.parse(data)
  const ip = headers().get("x-forwarded-for")

  const { success } = await ratelimit.limit(ip ?? "anonymous")

  if (!success) {
    throw new Error("Too many requests")
  }

  const id = generateId()
  await db.insert(submissions).values({ ...submission, id })

  const event = new Event("submission.created")

  await event.emit({
    formId: submission.formId,
    data: JSON.stringify(submission?.data),
    submissionId: id,
  })
}
