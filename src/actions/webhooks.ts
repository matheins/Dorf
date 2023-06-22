"use server"

import { revalidatePath } from "next/cache"
import { eq } from "drizzle-orm"
import { createInsertSchema } from "drizzle-zod"
import { z } from "zod"

import { db } from "@/lib/db"
import { webhooks } from "@/lib/db/schema"
import { generateId } from "@/lib/id"

const enableWebhookSchema = createInsertSchema(webhooks).pick({
  id: true,
  enabled: true,
})
type EnableForm = z.infer<typeof enableWebhookSchema>
export async function setWebhookEnabled(values: EnableForm) {
  const webhook = enableWebhookSchema.parse(values)

  if (!webhook.id) {
    throw new Error("Form id is required")
  }

  await db.update(webhooks).set(webhook).where(eq(webhooks.id, webhook.id))

  const updatedWebhook = await db.query.webhooks.findFirst({
    where: eq(webhooks.id, webhook.id),
  })

  revalidatePath(`/forms/${updatedWebhook?.formId}/webhooks`)

  return updatedWebhook
}

const deleteWebhook = createInsertSchema(webhooks).pick({
  id: true,
  deleted: true,
})
type DeleteForm = z.infer<typeof deleteWebhook>

export async function setWebhookDeleted(values: DeleteForm) {
  const webhook = deleteWebhook.parse(values)
  await db.update(webhooks).set(webhook).where(eq(webhooks.id, webhook.id))

  const updatedWebhook = await db.query.webhooks.findFirst({
    where: eq(webhooks.id, webhook.id),
  })

  revalidatePath(`/forms/${updatedWebhook?.formId}/webhooks`)

  return updatedWebhook
}

const insertWebhook = createInsertSchema(webhooks).pick({
  formId: true,
  endpoint: true,
})
type CreateWebhook = z.infer<typeof insertWebhook>
export async function createWebhook(values: CreateWebhook) {
  const webhook = insertWebhook.parse(values)

  const whsec = "whsec_" + generateId()
  const id = generateId()

  await db.insert(webhooks).values({
    ...webhook,
    id: id,
    secretKey: whsec,
    events: JSON.stringify(["submission.created"]),
  })

  const createdWebhook = await db.query.webhooks.findFirst({
    where: eq(webhooks.id, id),
  })

  revalidatePath(`/forms/${createdWebhook?.formId}/webhooks`)

  return createdWebhook
}

const rotateSecretKey = createInsertSchema(webhooks).pick({
  id: true,
})
type RotateKey = z.infer<typeof rotateSecretKey>
export async function rotateWebhookSecretKey(values: RotateKey) {
  const webhook = rotateSecretKey.parse(values)

  const whsec = "whsec_" + generateId()

  await db
    .update(webhooks)
    .set({ secretKey: whsec })
    .where(eq(webhooks.id, webhook.id))

  const updatedWebhook = await db.query.webhooks.findFirst({
    where: eq(webhooks.id, webhook.id),
  })

  revalidatePath(
    `/forms/${updatedWebhook?.formId}/webhooks/${updatedWebhook?.id}`
  )

  return updatedWebhook
}
