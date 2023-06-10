"use server"

import { revalidatePath } from "next/cache"
import { eq } from "drizzle-orm"
import { createInsertSchema } from "drizzle-zod"
import { z } from "zod"

import { db } from "@/lib/db"
import { fields } from "@/lib/db/schema"
import { generateId } from "@/lib/id"

const insertFieldSchema = createInsertSchema(fields).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
})
type InsertField = z.infer<typeof insertFieldSchema>

export async function addField(values: InsertField) {
  const field = insertFieldSchema.parse(values)

  await db.insert(fields).values({
    ...field,
    id: generateId(),
  })

  revalidatePath(`/forms/${field.formId}/edit`)
}

const updateFieldSchema = createInsertSchema(fields).omit({
  createdAt: true,
  updatedAt: true,
})
type UpdateField = z.infer<typeof updateFieldSchema>

export async function updateField(values: UpdateField) {
  const field = updateFieldSchema.parse(values)

  if (!field.id) {
    throw new Error("Field id is required")
  }

  await db.update(fields).set(field).where(eq(fields.id, field.id))

  revalidatePath(`/forms/${field.formId}/edit`)
}

export async function deleteField(id: string) {
  const field = await db.query.fields.findFirst({ where: eq(fields.id, id) })

  if (!field) {
    throw new Error("Field not found")
  }

  await db.delete(fields).where(eq(fields.id, id))

  revalidatePath(`/forms/${field.formId}/edit`)
}
