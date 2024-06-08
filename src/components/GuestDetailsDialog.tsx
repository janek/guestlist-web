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
import { AddGuestForm } from "./AddGuestForm"

import { useState } from "react"

type GuestDetailsDialogProps = {
  organisationName: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const GuestDetailsDialog = (props: GuestDetailsDialogProps) => {
  return (
    <Dialog open={props.open} onOpenChange={props.onOpenChange}>
      <DialogContent className="max-w-xs">
        <DialogHeader>
          <DialogTitle className="mb-4">Add guest</DialogTitle>
          {/* <DialogDescription>ABC</DialogDescription> */}
          <AddGuestForm
            onSubmitFromParent={() => console.log("submit")}
            organisationName={props.organisationName}
          />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
