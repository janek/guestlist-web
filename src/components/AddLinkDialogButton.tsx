"use client"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog"
import { AddLinkForm } from "./AddLinkForm"

import { useState } from "react"
import { SendStaffLinksForm } from "./SendStaffLinksForm"

interface AddLinkDialogButtonProps {
  eventId: string;
  variant: "manual" | "staff";
  title: string;
  description?: string;
  staff?: Staff[];
}

export const AddLinkDialogButton = ({ eventId, variant, title, description, staff }: AddLinkDialogButtonProps) => {
  const [open, setOpen] = useState(false)
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">{title}</Button>
      </DialogTrigger>
      <DialogContent className="max-w-xs">
        <DialogHeader>
          <DialogTitle className="mb-4">{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
          {variant === "manual" ? (
            <AddLinkForm
              eventId={eventId}
              onSubmitFromParent={() => setOpen(false)}
            />
          ) : (
            <SendStaffLinksForm
              eventId={eventId}
              staff={staff}
              onSubmitFromParent={() => setOpen(false)}
            />
          )}
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
