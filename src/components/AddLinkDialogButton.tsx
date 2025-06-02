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
import { teamInfo } from "@/utils/telegram"

interface AddLinkDialogButtonProps {
  variant: "manual" | "staff";
  title: string;
  description?: string | React.ReactNode;
  staff?: Staff[];
  event: GuestlistEvent;
}

export const AddLinkDialogButton = ({ variant, title, description, staff, event }: AddLinkDialogButtonProps) => {
  const [open, setOpen] = useState(false)
  
  const staffNames = Object.keys(teamInfo).sort()
  const staffCount = staffNames.length

  // Use provided description or generate staff list for staff variant
  const getDescription = () => {
    if (description) {
      return description
    }
    
    if (variant === "staff") {
      return (
        <div>
          <div className="mb-2">
            Links will be sent via Telegram to {staffCount} people:
          </div>
          <div className="grid grid-cols-3 gap-x-2 text-xs mb-5">
            {staffNames.map((name) => (
              <div key={name}>{name}</div>
            ))}
          </div>
        </div>
      )
    }
    
    return null
  }

  const finalDescription = getDescription()
  
  console.log("Event1:", event)
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">{title}</Button>
      </DialogTrigger>
      <DialogContent className="max-w-xs">
        <DialogHeader>
          <DialogTitle className="mb-4">{title}</DialogTitle>
          {finalDescription && (
            typeof finalDescription === 'string' ? (
              <DialogDescription>{finalDescription}</DialogDescription>
            ) : (
              <div className="text-sm text-muted-foreground">{finalDescription}</div>
            )
          )}
          {variant === "manual" ? (
            <AddLinkForm
              eventId={event.id}
              onSubmitFromParent={() => setOpen(false)}
            />
          ) : (
            <>
              <h3 className="text-sm font-medium mb-2">Configuration:</h3>
              <SendStaffLinksForm
                staff={staff}
                event={event}
                onSubmitFromParent={() => setOpen(false)}
              />
            </>
          )}
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
