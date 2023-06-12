"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createSubmission } from "@/actions/submissions"
import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { InferModel } from "drizzle-orm"
import { AtSignIcon, CalendarIcon } from "lucide-react"
import { useForm } from "react-hook-form"
import validator from "validator"
import { z } from "zod"

import { fields, forms } from "@/lib/db/schema"
import { cn } from "@/lib/utils"

import { Icons } from "./icons"
import { Button } from "./ui/button"
import { Calendar } from "./ui/calendar"
import { Checkbox } from "./ui/checkbox"
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
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select"
import { Textarea } from "./ui/textarea"

type Form = InferModel<typeof forms, "select">
type Field = InferModel<typeof fields, "select">

type FormWithFields = Form & {
  fields: Field[]
}

interface FormRendererProps {
  form: FormWithFields
  preview?: boolean
}

const fieldTypeSchema = z.enum(fields.type.enumValues)
type FieldType = z.infer<typeof fieldTypeSchema>

// build validtion schema from form fields using zod. i.e. if field.type === "email" then add z.string().email() to schema. If its required then add .required()
const generateZodSchema = (fieldType: FieldType) => {
  switch (fieldType) {
    case "text":
      return z.string()
    case "number":
      return z.number()
    case "email":
      return z.string().email()
    case "textarea":
      return z.string().max(512)
    case "checkbox":
      return z.boolean()
    case "url":
      return z.string().url()
    case "tel":
      return z.string().refine(validator.isMobilePhone)
    case "date":
      return z.date()

    // Add more field types and their corresponding schema definitions here
    default:
      // Default to treating unknown field types as strings
      return z.string()
  }
}

const generateFormSchema = (formData: FormWithFields) => {
  const fieldSchemas = formData.fields.map((field) => {
    const fieldSchema = generateZodSchema(field.type)

    // Apply additional validations based on field configuration if needed
    console.log("required", field.required)

    if (!field.required) {
      fieldSchema.and(z.string().optional())
    }

    console.log("fieldSchema", fieldSchema._def)

    return {
      [field.label]: fieldSchema,
    }
  })

  return z.object({
    // Dynamically generate Zod object schema based on the fields
    ...fieldSchemas.reduce((acc, fieldSchema, index) => {
      return {
        ...acc,
        ...fieldSchema,
      }
    }, {}),
  })
}

export const FormRenderer = ({
  form: formData,
  preview,
}: FormRendererProps) => {
  const formSchema = generateFormSchema(formData)
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  console.log("schema", formSchema.shape)

  async function onSubmit(values: unknown) {
    console.log("values", values)

    setIsSubmitting(true)
    if (!preview) {
      await createSubmission({
        formId: formData.id,
        data: JSON.parse(JSON.stringify(values)),
      })
      router.push(`/f/${formData.id}/success`)
      setIsSubmitting(false)
    } else {
      // preview timout of 2 secs
      setTimeout(() => {
        alert("Preview mode")
        setIsSubmitting(false)
      }, 1000)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {formData.fields.map((fieldItem) => {
          switch (fieldItem.type) {
            case "text":
              return (
                <FormField
                  key={fieldItem.id}
                  control={form.control}
                  name={fieldItem.label}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{fieldItem.label}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={fieldItem.placeholder || undefined}
                          required={fieldItem.required || false}
                          {...field}
                          value={field.value as string}
                        />
                      </FormControl>
                      {fieldItem.description && (
                        <FormDescription>
                          {fieldItem.description}
                        </FormDescription>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )
            case "textarea":
              return (
                <FormField
                  key={fieldItem.id}
                  control={form.control}
                  name={fieldItem.label}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{fieldItem.label}</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          value={field.value as string}
                          required={fieldItem.required}
                        />
                      </FormControl>
                      {fieldItem.description && (
                        <FormDescription>
                          {fieldItem.description}
                        </FormDescription>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )
            case "email":
              return (
                <FormField
                  key={fieldItem.id}
                  control={form.control}
                  name={fieldItem.label}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{fieldItem.label}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={fieldItem.placeholder || undefined}
                          required={fieldItem.required || false}
                          {...field}
                          value={field.value as string}
                          type="email"
                          icon={"atSign"}
                        />
                      </FormControl>
                      {fieldItem.description && (
                        <FormDescription>
                          {fieldItem.description}
                        </FormDescription>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )
            case "checkbox":
              return (
                <FormField
                  key={fieldItem.id}
                  control={form.control}
                  name={fieldItem.label}
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 pl-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value as boolean}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>{fieldItem.label}</FormLabel>
                        <FormDescription>
                          {fieldItem.description}
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              )
            case "number":
              return (
                <FormField
                  key={fieldItem.id}
                  control={form.control}
                  name={fieldItem.label}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{fieldItem.label}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={fieldItem.placeholder || undefined}
                          {...field}
                          required={fieldItem.required || false}
                          value={field.value as string}
                          icon="hash"
                          type="number"
                        />
                      </FormControl>
                      {fieldItem.description && (
                        <FormDescription>
                          {fieldItem.description}
                        </FormDescription>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )
            case "url":
              return (
                <FormField
                  key={fieldItem.id}
                  control={form.control}
                  name={fieldItem.label}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{fieldItem.label}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={fieldItem.placeholder || undefined}
                          required={fieldItem.required || false}
                          {...field}
                          icon="link"
                          value={field.value as string}
                          type="url"
                        />
                      </FormControl>
                      {fieldItem.description && (
                        <FormDescription>
                          {fieldItem.description}
                        </FormDescription>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )
            case "tel":
              return (
                <FormField
                  key={fieldItem.id}
                  control={form.control}
                  name={fieldItem.label}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{fieldItem.label}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={fieldItem.placeholder || undefined}
                          required={fieldItem.required || false}
                          {...field}
                          icon="phone"
                          value={field.value as string}
                          type="tel"
                        />
                      </FormControl>
                      {fieldItem.description && (
                        <FormDescription>
                          {fieldItem.description}
                        </FormDescription>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )
            case "date":
              return (
                <FormField
                  key={fieldItem.id}
                  control={form.control}
                  name={fieldItem.label}
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>{fieldItem.label}</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "justify-start pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4 opacity-50" />
                              {field.value ? (
                                format(field.value as Date, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value as Date}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date > new Date() || date < new Date("1900-01-01")
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormDescription>{fieldItem.description}</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )

            case "radio":
              return (
                <FormField
                  key={fieldItem.id}
                  control={form.control}
                  name={fieldItem.label}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{fieldItem.label}</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value as string}
                      >
                        <FormControl>
                          <SelectTrigger required={fieldItem.required}>
                            <SelectValue placeholder={fieldItem.placeholder} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {fieldItem.options
                            ?.split(",")
                            .map((option, index) => (
                              <SelectItem key={index} value={option}>
                                {option}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>{fieldItem.description}</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )
            case "time":
              return (
                <FormField
                  key={fieldItem.id}
                  control={form.control}
                  name={fieldItem.label}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{fieldItem.label}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={fieldItem.placeholder || undefined}
                          required={fieldItem.required || false}
                          {...field}
                          icon="clock"
                          value={field.value as string}
                          type="time"
                        />
                      </FormControl>
                      {fieldItem.description && (
                        <FormDescription>
                          {fieldItem.description}
                        </FormDescription>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )
          }
        })}
        <Button disabled={isSubmitting} type="submit">
          {isSubmitting ? (
            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
          ) : null}
          {formData.submitText}
        </Button>
      </form>
    </Form>
  )
}
