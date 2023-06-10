import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { buttonVariants } from "@/components/ui/button"
import { TypographyH1, TypographyLead } from "@/components/typography"

const FormSuccess = async ({ params }: { params: { id: string } }) => {
  return (
    <div className="h-[80vh] items-center justify-center flex flex-col">
      <div className="space-y-8 text-center">
        <TypographyH1>Success</TypographyH1>
        <TypographyLead>Form submitted successfully</TypographyLead>
        <Link href="/" className={buttonVariants({ variant: "ghost" })}>
          Start building your own <ArrowRight className="h-4 w-4 ml-2" />
        </Link>
      </div>
    </div>
  )
}

export default FormSuccess
