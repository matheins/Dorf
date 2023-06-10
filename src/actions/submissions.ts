"use server"

import { headers } from "next/headers"
import { createInsertSchema } from "drizzle-zod"
import { z } from "zod"

import { db } from "@/lib/db"
import { submissions } from "@/lib/db/schema"
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

  await db.insert(submissions).values({ ...submission, id: generateId() })
}
