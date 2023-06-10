import { Ratelimit } from "@upstash/ratelimit" // for deno: see above
import { kv } from "@vercel/kv"

// Create a new ratelimiter, that allows 10 requests per 10 seconds
export const ratelimit = new Ratelimit({
  redis: kv,
  limiter: Ratelimit.slidingWindow(10, "10 s"),
})
