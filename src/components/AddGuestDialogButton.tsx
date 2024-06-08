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

type AddGuestDialogButtonProps = {
  organisationName: string
}

export const AddGuestDialogButton = (props: AddGuestDialogButtonProps) => {
  const [open, setOpen] = useState(false)
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Add guest</Button>
      </DialogTrigger>
      <DialogContent className="max-w-xs">
        <DialogHeader>
          <DialogTitle className="mb-4">Add guest</DialogTitle>
          {/* <DialogDescription>ABC</DialogDescription> */}
          <AddGuestForm
            onSubmitFromParent={() => setOpen(false)}
            organisationName={props.organisationName}
          />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
