"use client"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import type { Tables } from "../../lib/database.types"
import { GuestDetailsForm } from "./GuestDetailsForm"

import type { useState } from "react"

type GuestDetailsDialogProps = {
  guest: Tables<"guests"> | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const GuestDetailsDialog = (props: GuestDetailsDialogProps) => {
  return (
    <Dialog open={props.open} onOpenChange={props.onOpenChange}>
      <DialogContent className="max-w-xs">
        <DialogHeader>
          {/* <DialogTitle className="mb-4">Add guest</DialogTitle> */}
          {/* <DialogDescription>ABC</DialogDescription> */}
          <GuestDetailsForm
            onSubmitFromParent={() => console.log("submit")}
            guest={props.guest}
          />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
