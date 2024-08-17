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
  variant: "manual" | "staff";
  title: string;
  description?: string;
  staff?: Staff[];
  event: GuestlistEvent;
}

export const AddLinkDialogButton = ({ variant, title, description, staff, event }: AddLinkDialogButtonProps) => {
  const [open, setOpen] = useState(false)
  console.log("Event1:", event)
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
              eventId={event.id}
              onSubmitFromParent={() => setOpen(false)}
            />
          ) : (
            <SendStaffLinksForm
              staff={staff}
              event={event}
              onSubmitFromParent={() => setOpen(false)}
            />
          )}
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
