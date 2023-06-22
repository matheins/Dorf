import { headers } from "next/headers"
import { Receiver } from "@upstash/qstash"
import { and, eq, lte } from "drizzle-orm"

import { env } from "@/env.mjs"
import { db } from "@/lib/db"
import { webhookEvents } from "@/lib/db/schema"
import { postToEnpoint } from "@/lib/events"
import { EventType } from "@/lib/events/types"

const r = new Receiver({
  currentSigningKey: env.QSTASH_CURRENT_SIGNING_KEY || "",
  nextSigningKey: env.QSTASH_NEXT_SIGNING_KEY || "",
})

export async function POST(request: Request) {
  const headersList = headers()
  const signature = headersList.get("upstash-signature") as string

  const body = await request.text()

  let isValid: boolean
  try {
    isValid = await r.verify({
      signature,
      body: body,
    })

    if (!isValid) throw new Error("invalid signature")
  } catch (error) {
    if (error instanceof Error) {
      // ✅ TypeScript knows err is Error
      return new Response(`Webhook Error: ${error.message as string}`, {
        status: 400,
      })
    } else {
      console.error(error)
      return new Response("Unexpected error", { status: 500 })
    }
  }

  await retryEvents()

  return new Response(null, { status: 200 })
}
async function retryEvents() {
  const now = new Date()
  const eventsToProcess = await db.query.webhookEvents.findMany({
    where: and(
      lte(webhookEvents.nextAttempt, now),
      eq(webhookEvents.status, "attempting")
    ),
    with: {
      webhook: true,
      submission: true,
    },
  })
  console.log(`Retry of ${eventsToProcess.length} events started`)

  const results = await Promise.all(
    eventsToProcess.map(async (event) => {
      const postRes = await postToEnpoint({
        formId: event.webhook.formId,
        endpoint: event.webhook.endpoint,
        event: event.event as EventType,
        data: event.submission.data as string,
        webhookSecret: event.webhook.secretKey,
        submissionId: event.submissionId,
      })
      if (postRes?.status === 200) {
        await db
          .update(webhookEvents)
          .set({
            statusCode: postRes.status,
            status: "success",
            attemptCount:
              event?.attemptCount && event.attemptCount >= 1
                ? event.attemptCount + 1
                : 1,
            nextAttempt: null,
            lastAttempt: now,
          })
          .where(eq(webhookEvents.id, event.id))

        return { success: true }
      }

      const { status, nextAttempt } = generateRetryInfo({
        attemptCount: event.attemptCount || 1,
        lastAttempt: event.lastAttempt || now,
      })

      console.log("generared info")
      console.log(
        "attempt",
        event?.attemptCount && event.attemptCount >= 1
          ? event.attemptCount + 1
          : 1
      )

      await db
        .update(webhookEvents)
        .set({
          statusCode: postRes?.status,
          status: status,
          lastAttempt: now,
          attemptCount:
            event?.attemptCount && event.attemptCount >= 1
              ? event.attemptCount + 1
              : 1,
          nextAttempt: nextAttempt,
        })
        .where(eq(webhookEvents.id, event.id))
    })
  )

  console.log(
    `Processed ${results.length} events. Successfully submitted ${
      results.filter((result) => result?.success).length
    } events.`
  )
}

function generateRetryInfo({
  attemptCount,
  lastAttempt,
}: {
  attemptCount: number
  lastAttempt: Date
}) {
  // we do 5 retries: 5min (attempt 2), 30min (attempt 3), 2 hours (attempt 4), 5 hours (attempt 6), 10 hours (attempt 7)
  let nextAttempt: Date | null = null
  let status: "failed" | "attempting" = "attempting"

  switch (attemptCount) {
    case 1: {
      nextAttempt = new Date(
        lastAttempt.setMinutes(lastAttempt.getMinutes() + 30)
      )
      status = "attempting"
      break
    }
    case 2: {
      nextAttempt = new Date(lastAttempt.setHours(lastAttempt.getHours() + 2))
      status = "attempting"
      break
    }
    case 3: {
      nextAttempt = new Date(lastAttempt.setHours(lastAttempt.getHours() + 5))
      status = "attempting"
      break
    }
    case 4: {
      nextAttempt = new Date(lastAttempt.setHours(lastAttempt.getHours() + 10))
      status = "attempting"
      break
    }
    case 5: {
      nextAttempt = null
      status = "failed"
      break
    }
    default: {
      nextAttempt = null
      status = "failed"
      break
    }
  }

  return {
    status,
    nextAttempt,
  }
}
