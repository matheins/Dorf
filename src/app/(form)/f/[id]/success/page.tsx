import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { buttonVariants } from "@/components/ui/button"
import { TypographyH1, TypographyLead } from "@/components/typography"

const FormSuccess = async ({ params }: { params: { id: string } }) => {
  return (
    <div className="flex h-[80vh] flex-col items-center justify-center">
      <div className="space-y-8 text-center">
        <TypographyH1>Success</TypographyH1>
        <TypographyLead>Form submitted successfully</TypographyLead>
        <Link href="/" className={buttonVariants({ variant: "ghost" })}>
          Start building your own <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </div>
    </div>
  )
}

export default FormSuccess
