"use client"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { AddLinkForm } from "./AddLinkForm"

import { useState } from "react"

interface AddLinkDialogButtonProps {
  eventId: string;
}

export const AddLinkDialogButton = ({ eventId }: AddLinkDialogButtonProps) => {
  const [open, setOpen] = useState(false)
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Create link</Button>
      </DialogTrigger>
      <DialogContent className="max-w-xs">
        <DialogHeader>
          <DialogTitle className="mb-4">Create link</DialogTitle>
          {/* <DialogDescription>ABC</DialogDescription> */}
          <AddLinkForm eventId={eventId} onSubmitFromParent={() => setOpen(false)} />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
