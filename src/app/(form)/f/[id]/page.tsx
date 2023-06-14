import { Metadata } from "next"
import { notFound } from "next/navigation"
import { eq } from "drizzle-orm"

import { env } from "@/env.mjs"
import { db } from "@/lib/db"
import { forms } from "@/lib/db/schema"
import { absoluteUrl } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"
import { FormRenderer } from "@/components/form-renderer"
import { TypographyH1, TypographyLead } from "@/components/typography"

interface FormPageProperties {
  params: {
    id: string
  }
}

const getForm = async ({ id }: { id: string }) => {
  const form = await db.query.forms.findFirst({
    where: eq(forms.id, id),
    with: {
      fields: {
        orderBy: (fields, { asc }) => [asc(fields.createdAt)],
      },
    },
  })

  return form
}

export async function generateMetadata({
  params,
}: FormPageProperties): Promise<Metadata> {
  const form = await getForm({ id: params.id })

  if (!form) {
    return {}
  }

  const url = env.NEXT_PUBLIC_APP_URL

  const ogUrl = new URL(`${url}/api/og`)
  ogUrl.searchParams.set("heading", form.title)
  ogUrl.searchParams.set("type", "Form")

  return {
    title: form.title,
    description: form.description,
    openGraph: {
      title: form.title,
      description: form.description || "",
      type: "article",
      url: absoluteUrl(`f/${form.id}`),
      images: [
        {
          url: ogUrl.toString(),
          width: 1200,
          height: 630,
          alt: form.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: form.title,
      description: form.description || "",
      images: [ogUrl.toString()],
    },
  }
}

const Form = async ({ params }: FormPageProperties) => {
  const { id } = params

  const form = await getForm({ id })

  if (!form?.published || form.archived) {
    notFound()
  }

  return (
    <div>
      <div className="space-y-8">
        <TypographyH1>{form.title}</TypographyH1>
        <TypographyLead>{form.description}</TypographyLead>
      </div>
      <Separator className="mb-8 mt-4" />
      <FormRenderer form={form} />
    </div>
  )
}

export default Form
