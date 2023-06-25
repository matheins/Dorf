"use client"

import { createFeedback } from "@/actions/feedback"
import { zodResolver } from "@hookform/resolvers/zod"
import { VariantProps } from "class-variance-authority"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button, buttonVariants } from "./ui/button"
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { Textarea } from "./ui/textarea"
import { toast } from "./ui/use-toast"

const formSchema = z.object({
  text: z.string().min(1),
})

type FormSchema = z.infer<typeof formSchema>

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

export async function FeedbackButton(props: ButtonProps) {
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      text: "",
    },
  })

  async function onSubmit(data: FormSchema) {
    const ua = navigator.userAgent
    const url = window.location.href

    await createFeedback({
      ...data,
      ua,
      url,
    })

    // form.reset()

    toast({
      title: "Feedback submitted",
      description: "Thanks for your feedback! We really appreciate it 🫶",
    })
  }

  return (
    <Popover>
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
              <Button type="submit" size={"sm"}>
                Submit
              </Button>
            </div>
          </form>
        </Form>
      </PopoverContent>
    </Popover>
  )
}
