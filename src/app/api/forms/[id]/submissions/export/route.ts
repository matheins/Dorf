import { NextRequest, NextResponse } from "next/server"
import { eq } from "drizzle-orm"
import { getToken } from "next-auth/jwt"

import { db } from "@/lib/db"
import { forms, submissions, users } from "@/lib/db/schema"
import { convertSubmissionsToCsv } from "@/lib/utils"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { searchParams } = new URL(request.url)

  const { id } = params
  const format = searchParams.get("format")
  const token = await getToken({ req: request })

  // check if user is logged in
  if (!token) {
    return NextResponse.json({ error: "Not authorized" }, { status: 401 })
  }

  // query form
  const form = await db.query.forms.findFirst({
    where: eq(forms.id, id),
  })

  if (!form) {
    return NextResponse.json({ error: "Form not found" }, { status: 404 })
  }

  // check if user is form owner
  const isFormOwner = token.id === form.userId

  if (!isFormOwner) {
    return NextResponse.json({ error: "Not authorized" }, { status: 401 })
  }

  // query submissions
  const data = await db.query.submissions.findMany({
    where: eq(submissions.formId, form.id),
  })

  if (!data) {
    return NextResponse.json({ error: "Submission not found" }, { status: 404 })
  }

  if (format === "csv") {
    const csv = convertSubmissionsToCsv(data)

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="${id}.csv"`,
      },
    })
  }

  return NextResponse.json(
    { error: "Invalid or missing value for param: format" },
    { status: 400 }
  )
}
