"use client"

import { useState } from "react"
import { CopyIcon, EyeIcon } from "lucide-react"

import { Icons } from "./icons"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { toast } from "./ui/use-toast"

export function SecretInput({ value }: { value: string }) {
  const [showSecret, setShowSecret] = useState(false)

  function copySecret() {
    navigator.clipboard.writeText(value)
    toast({
      title: "Copied to clipboard",
      description: "Webhook secret has been copied to clipboard",
    })
  }

  return (
    <div className="relative">
      <input
        value={value}
        type={showSecret ? "text" : "password"}
        className="border-input ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring block w-full rounded-md border bg-transparent py-1.5 pl-3 pr-10  text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
      />
      <div className="absolute inset-y-0 right-1 flex items-center">
        <Button
          size={"sm"}
          variant={"ghost"}
          onClick={() => copySecret()}
          className="h-6"
        >
          <CopyIcon className="h-3 w-3" />
        </Button>
        <Button
          size={"sm"}
          variant={"ghost"}
          onClick={() => setShowSecret(!showSecret)}
          className="h-6"
        >
          <EyeIcon className="h-3 w-3" />
        </Button>
      </div>
    </div>
  )
}
