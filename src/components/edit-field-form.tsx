"use client"

import { useEffect, useState } from "react"
import { addField, updateField } from "@/actions/fields"
import { zodResolver } from "@hookform/resolvers/zod"
import { InferModel } from "drizzle-orm"
import { XIcon } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { fields } from "@/lib/db/schema"

import { Icons } from "./icons"
import { Button } from "./ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form"
import { Input } from "./ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select"
import { Switch } from "./ui/switch"
import { useToast } from "./ui/use-toast"

const formSchema = z.object({
  id: z.string().optional(),
  label: z.string().min(2).max(50),
  description: z.string().max(512).optional(),
  type: z.enum(fields.type.enumValues),
  placeholder: z.string().max(50).optional(),
  required: z.boolean(),
  formId: z.string(),
  options: z.string().min(1).max(50).array().optional(),
})

type Field = InferModel<typeof fields, "select">

type Form = z.infer<typeof formSchema>

export const EditFieldForm = ({
  formId,
  field: fieldData,
  onSubmitted,
}: {
  formId: string
  field?: Field
  onSubmitted?: () => void
}) => {
  const { toast } = useToast()
  const form = useForm<Form>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: fieldData?.id || undefined,
      label: fieldData?.label || "",
      placeholder: fieldData?.placeholder || "",
      required: fieldData?.required || false,
      type: fieldData?.type || undefined,
      formId: fieldData?.formId || formId,
      options: fieldData?.options?.split(",") || [],
    },
  })

  async function onSubmit(values: Form) {
    let plainOptions
    if (values.options) {
      plainOptions = values.options.join(",")
    }
    if (values.id) {
      await updateField({ ...values, options: plainOptions, id: values.id! })
    } else {
      await addField({ ...values, options: plainOptions })
    }

    toast({
      title: "Field saved",
      description: "Your field has been saved.",
    })

    if (onSubmitted) {
      onSubmitted()
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="label"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Label</FormLabel>
              <FormControl>
                <Input placeholder="Label" {...field} />
              </FormControl>
              <FormDescription>The fields label.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="placeholder"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Placeholder (optional)</FormLabel>
              <FormControl>
                <Input placeholder="Placeholder" {...field} />
              </FormControl>
              <FormDescription>
                The placeholder text displayed inside the field.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (optional)</FormLabel>
              <FormControl>
                <Input
                  placeholder="Describe what this field is for..."
                  {...field}
                />
              </FormControl>
              <FormDescription>
                A decription helps the user to understand what this field is
                about. This is optional.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select the fields type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="text">Short answer</SelectItem>
                  <SelectItem value="textarea">Long answer</SelectItem>
                  <SelectItem value="number">Number</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="tel">Phone</SelectItem>
                  <SelectItem value="url">URL</SelectItem>
                  <SelectItem value="date">Date</SelectItem>
                  <SelectItem value="time">Time</SelectItem>
                  <SelectItem value="checkbox">Checkboxes</SelectItem>
                  <SelectItem value="radio">Radio buttons</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                The type determines what kind of data the field will accept.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {form.watch("type") === "radio" && (
          <FormField
            control={form.control}
            name={"options"}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Options</FormLabel>
                <FormControl>
                  <OptionsForm
                    options={field.value || []}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormDescription>
                  Enter one option per line. The first option will be selected
                  by default.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <FormField
          control={form.control}
          name="required"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Required?</FormLabel>
                <FormDescription>
                  Is this field required to be filled out?
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit">Save</Button>
      </form>
    </Form>
  )
}

interface OptionsFormProps {
  options: string[]
  onChange: (options: string[]) => void
}

const optionsFormSchema = z.object({ option: z.string().min(1).max(50) })
type OptionsForm = z.infer<typeof optionsFormSchema>

const OptionsForm = ({ onChange, options: initData }: OptionsFormProps) => {
  const form = useForm<OptionsForm>({
    resolver: zodResolver(optionsFormSchema),
  })

  const [options, setOptions] = useState<string[]>(initData || [])

  const onSubmit = async (data: OptionsForm) => {
    // if (!form.formState.isValid) return
    setOptions([...options, data.option])
    form.reset({ option: "" })
  }

  const removeOption = (index: number) => {
    setOptions(options.filter((_, i) => i !== index))
  }

  useEffect(() => {
    onChange(options)
  }, [options])

  return (
    <div className="space-y-2">
      <div className="flex flex-col gap-y-2 divide-y">
        {options?.map((option, index) => (
          <div className="flex flex-row items-center justify-between truncate text-xs font-medium">
            <div>{option}</div>
            <Button onClick={() => removeOption(index)} variant={"ghost"}>
              <XIcon className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
      <div className="space-y-2">
        <FormItem>
          <div className="">
            <Input
              placeholder={`Add option ${options.length + 1}`}
              {...form.register("option")}
            />
          </div>
        </FormItem>

        <Button variant={"secondary"} onClick={form.handleSubmit(onSubmit)}>
          <Icons.add className="mr-2 h-4 w-4" />
          Add option
        </Button>
      </div>
    </div>
  )
}
