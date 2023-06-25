"use client"

import React from "react"
import { createFeedback } from "@/actions/feedback"
import { zodResolver } from "@hookform/resolvers/zod"
import { VariantProps } from "class-variance-authority"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Icons } from "./icons"
import { Button, buttonVariants } from "./ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { Textarea } from "./ui/textarea"
import { toast } from "./ui/use-toast"

const formSchema = z.object({
  text: z.string().min(1).max(512),
})

type FormSchema = z.infer<typeof formSchema>

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  userId?: string
}

export function FeedbackButton(props: ButtonProps) {
  //   const session = useSession()
  const [isOpen, setIsOpen] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      text: "",
    },
  })

  async function onSubmit(data: FormSchema) {
    const ua = navigator.userAgent
    const url = window.location.href
    setIsLoading(true)
    await createFeedback({
      ...data,
      ua,
      url,
      userId: props.userId,
    })

    setIsOpen(false)
    setIsLoading(false)

    form.reset()

    toast({
      title: "Feedback submitted",
      description: "Thanks for your feedback 🫶",
    })
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant={"outline"} {...props}>
          Feedback
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="text"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (optional)</FormLabel>

                  <FormControl>
                    <Textarea
                      placeholder="Leave some feedback..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex">
              <Button type="submit" size={"sm"} disabled={isLoading}>
                {isLoading && (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                )}
                Submit
              </Button>
            </div>
          </form>
        </Form>
      </PopoverContent>
    </Popover>
  )
}
