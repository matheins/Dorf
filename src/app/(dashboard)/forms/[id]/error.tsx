"use client"

import Link from "next/link"

import { buttonVariants } from "@/components/ui/button"

const Error = () => {
  return (
    <div>
      <h1>Error</h1>
      <Link className={buttonVariants()} href="/">
        Home
      </Link>
    </div>
  )
}

export default Error
