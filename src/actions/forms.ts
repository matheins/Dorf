"use server"

import { revalidatePath } from "next/cache"
import { eq } from "drizzle-orm"
import { createInsertSchema } from "drizzle-zod"
import { z } from "zod"

import { db } from "@/lib/db"
import { forms } from "@/lib/db/schema"
import { generateId } from "@/lib/id"

const insertFormSchema = createInsertSchema(forms).pick({
  title: true,
  description: true,
  submitText: true,
})
type InsertForm = z.infer<typeof insertFormSchema>

export async function createForm(values: InsertForm) {
  const form = insertFormSchema.parse(values)
  const id = generateId()
  await db.insert(forms).values({
    ...form,
    id,
  })

  const createdForm = await db.query.forms.findFirst({
    where: eq(forms.id, id),
  })

  revalidatePath("/forms")

  return createdForm
}

const publishFormSchema = createInsertSchema(forms).pick({
  id: true,
  published: true,
})
type PublishForm = z.infer<typeof publishFormSchema>

export async function setFormPublished(values: PublishForm) {
  const form = publishFormSchema.parse(values)

  if (!form.id) {
    throw new Error("Form id is required")
  }

  await db.update(forms).set(form).where(eq(forms.id, form.id))

  const updatedForm = await db.query.forms.findFirst({
    where: eq(forms.id, form.id),
  })

  revalidatePath("/forms")

  return updatedForm
}

const archiveFormSchema = createInsertSchema(forms).pick({
  id: true,
  archived: true,
})
type ArchiveForm = z.infer<typeof archiveFormSchema>

export async function setFormArchived(values: ArchiveForm) {
  const form = archiveFormSchema.parse(values)
  await db.update(forms).set(form).where(eq(forms.id, form.id))

  const updatedForm = await db.query.forms.findFirst({
    where: eq(forms.id, form.id),
  })

  revalidatePath("/forms")

  return updatedForm
}

export async function deleteForm(id: string) {
  await db.delete(forms).where(eq(forms.id, id))
  revalidatePath("/forms")
}
