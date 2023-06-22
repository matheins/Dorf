import { and, eq } from "drizzle-orm"

import { db } from "../db"
import { webhookEvents, webhooks } from "../db/schema"
import { generateId } from "../id"
import { eventArraySchema, EventType } from "./types"

export class Event {
  event: EventType
  constructor(event: EventType) {
    this.event = event
  }

  async emit({
    formId,
    data,
    submissionId,
  }: {
    formId: string
    data: string
    submissionId: string
  }) {
    console.log(`Emitting event ${this.event} for formId ${formId}`)
    await triggerWebhooks({
      formId,
      event: this.event,
      data,
      submissionId,
    })
  }
}

async function triggerWebhooks({
  formId,
  event,
  data,
  submissionId,
}: {
  formId: string
  event: EventType
  data: string
  submissionId: string
}) {
  try {
    const matchingWebhooks = await db.query.webhooks.findMany({
      where: and(
        eq(webhooks.formId, formId),
        eq(webhooks.deleted, false),
        eq(webhooks.enabled, true)
      ),
    })

    console.log(`Found ${matchingWebhooks.length} webhooks.`)
    const now = new Date()

    await Promise.all(
      matchingWebhooks.map(async (webhook) => {
        const events = eventArraySchema.parse(
          JSON.parse(webhook.events as string)
        )
        if (events.includes(event)) {
          const id = generateId()
          await db.insert(webhookEvents).values({
            id: id,
            event: event,
            webhookId: webhook.id,
            submissionId,
          })
          const postRes = await postToEnpoint({
            endpoint: webhook.endpoint,
            event,
            data,
            submissionId,
            formId,
            webhookSecret: webhook.secretKey,
          })

          // update status in db
          await db
            .update(webhookEvents)
            .set({
              statusCode: postRes?.status,
              status: postRes?.status === 200 ? "success" : "attempting",
              lastAttempt: now,
              nextAttempt:
                postRes?.status === 200
                  ? undefined
                  : new Date(now.setMinutes(now.getMinutes() + 5)),
              attemptCount: 1,
            })
            .where(eq(webhookEvents.id, id))
        }
      })
    )
  } catch (err) {
    console.error(err)
  }
}

export async function postToEnpoint({
  endpoint,
  event,
  data,
  formId,
  submissionId,
  webhookSecret,
}: {
  formId: string
  endpoint: string
  event: EventType
  data: string
  submissionId: string
  webhookSecret: string
}) {
  try {
    console.log(`Post to endpoint ${endpoint} for event ${event}`)

    // make post request to webhook endpoint
    const res = await fetch(endpoint, {
      method: "POST",
      body: JSON.stringify({ data, event, formId, submissionId }),
      headers: {
        "Content-Type": "application/json",
        "x-dorf-secret": webhookSecret,
      },
    })

    return {
      status: res.status,
    }
  } catch (err) {
    console.error(err)
  }
}
