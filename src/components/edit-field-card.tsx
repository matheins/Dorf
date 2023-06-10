"use client"

import { useState, useTransition } from "react"
import { deleteField } from "@/actions/fields"
import { DialogClose } from "@radix-ui/react-dialog"
import { InferModel } from "drizzle-orm"
import { MoreVerticalIcon, Trash2 } from "lucide-react"

import { fields } from "@/lib/db/schema"
import { Card } from "@/components/ui/card"

import { EditFieldSheet } from "./edit-field-sheet"
import { TypographyMuted, TypographySmall } from "./typography"
import { Button } from "./ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import { useToast } from "./ui/use-toast"

type Field = InferModel<typeof fields, "select">

export const EditFieldCard = ({ field }: { field: Field }) => {
  const [dialogOpen, setDialogOpen] = useState(false)
  let [isPending, startTransition] = useTransition()
  const toast = useToast()

  const deleteClicked = () => {
    startTransition(() => deleteField(field.id))
    setDialogOpen(false)

    toast.toast({
      title: "Field deleted",
      description: `Field ${field.label} was deleted.`,
    })
  }

  return (
    <div className="space-4 flex hover:cursor-pointer">
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <EditFieldSheet formId={field.formId} field={field}>
          <Card className="flex w-full items-center justify-between space-x-2 p-4">
            <div className="grow flex-col truncate">
              <TypographySmall>
                {field.label} {field.required ? "(required)" : ""}
              </TypographySmall>
              <TypographyMuted>{field.type}</TypographyMuted>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant={"ghost"} size={"sm"}>
                  <MoreVerticalIcon size={16} strokeWidth={1} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuGroup>
                  <DialogTrigger
                    asChild
                    onClick={(e) => {
                      e.preventDefault()
                      setDialogOpen(true)
                    }}
                  >
                    <DropdownMenuItem className="text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      <span>Delete</span>
                    </DropdownMenuItem>
                  </DialogTrigger>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </Card>
        </EditFieldSheet>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogDescription>
              This will permanently delete this field.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="ghost">Cancel</Button>
            </DialogClose>
            <Button
              variant="destructive"
              onClick={() => startTransition(() => deleteClicked())}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
