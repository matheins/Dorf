"use server"

import { createInsertSchema } from "drizzle-zod"
import { z } from "zod"

import { db } from "@/lib/db"
import { feedbacks } from "@/lib/db/schema"
import { generateId } from "@/lib/id"
import { getCurrentUser } from "@/lib/session"

const insertFeedbackSchema = createInsertSchema(feedbacks).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
})
type InsertFeedback = z.infer<typeof insertFeedbackSchema>

export async function createFeedback(values: InsertFeedback) {
  const user = await getCurrentUser()

  const feedback = insertFeedbackSchema.parse(values)

  await db.insert(feedbacks).values({ ...feedback, id: generateId() })
}
