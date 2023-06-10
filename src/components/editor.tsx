"use client"

import Link from "next/link"
import { setFormPublished } from "@/actions/forms"
import { InferModel } from "drizzle-orm"
import { CircleIcon, PlusCircleIcon, ShareIcon } from "lucide-react"
import { Form } from "react-hook-form"
import { useHotkeys } from "react-hotkeys-hook"

import { siteConfig } from "@/config/site"
import { fields, forms } from "@/lib/db/schema"
import { cn } from "@/lib/utils"

import { EditFieldCard } from "./edit-field-card"
import { EditFieldSheet } from "./edit-field-sheet"
import { FormRenderer } from "./form-renderer"
import { Icons } from "./icons"
import { Button, buttonVariants } from "./ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { toast } from "./ui/use-toast"

type Form = InferModel<typeof forms, "select">
type Field = InferModel<typeof fields, "select">

type FormWithFields = Form & {
  fields: Field[]
}

const setPublishForm = async ({
  formId,
  publish,
}: {
  formId: number
  publish: boolean
}) => {
  await setFormPublished({
    id: formId,
    published: publish,
  })
  toast({
    title: `Form ${publish ? "published" : "unpublished"}`,
    description: `Form has been ${publish ? "published" : "unpublished"}`,
  })
}

const copyLinkToClipboard = async ({ formId }: { formId: number }) => {
  const url = `${siteConfig.url}/f/${formId}`
  await navigator.clipboard.writeText(url)
  toast({
    title: "Copied to clipboard",
    description: "Link has been copied to clipboard",
  })
}

export const Editor = ({ form }: { form: FormWithFields }) => {
  useHotkeys("mod+c", () => {
    if (!form.published) return
    copyLinkToClipboard({ formId: form.id })
  })
  return (
    <div className="grid w-full gap-10">
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center space-x-10">
          <Link
            href="/dashboard"
            className={cn(buttonVariants({ variant: "ghost" }))}
          >
            <>
              <Icons.chevronLeft className="mr-2 h-4 w-4" />
              Back
            </>
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <CircleIcon
                  className={cn(
                    "h-2 w-2 mr-2 text-transparent",
                    form.published ? "fill-green-600" : "fill-yellow-600"
                  )}
                />

                {form.published ? "Published" : "Draft"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuRadioGroup
                value={String(form.published)}
                onValueChange={(value) =>
                  setPublishForm({
                    formId: form.id,
                    publish: value == "true" ? true : false,
                  })
                }
              >
                <DropdownMenuRadioItem value="true">
                  Published
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="false">
                  Draft
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button disabled={!form.published}>
              Share <ShareIcon className="w-4 h-4 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuGroup>
              <DropdownMenuItem
                onClick={() => {
                  copyLinkToClipboard({ formId: form.id })
                }}
              >
                <Icons.copy className="h-4 w-4 mr-2" />
                <span>Copy link</span>
                <DropdownMenuShortcut>⌘C</DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <Tabs defaultValue="editor" className="container max-w-3xl">
        <TabsList className="grid grid-cols-2 w-[400px] mx-auto mb-8">
          <TabsTrigger value="editor">Editor</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>
        <TabsContent value="editor" className="mx-auto space-y-4">
          {form.fields.map((fieldItem) => (
            <EditFieldCard key={fieldItem.id} field={fieldItem} />
          ))}

          <EditFieldSheet formId={form.id}>
            <Button variant={"ghost"} className="mx-auto flex">
              <PlusCircleIcon className={"h-4 w-4 mr-2"} />
              Add field
            </Button>
          </EditFieldSheet>
        </TabsContent>
        <TabsContent value="preview">
          <FormRenderer preview form={form} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
