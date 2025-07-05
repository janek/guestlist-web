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
import { Checkbox } from "@/components/ui/checkbox"
import { AddLinkForm } from "./AddLinkForm"

import { teamInfo } from "@/utils/telegram/constants"
import { useState } from "react"
import { SendStaffLinksForm } from "./SendStaffLinksForm"

interface AddLinkDialogButtonProps {
  variant: "manual" | "staff"
  title: string
  description?: string | React.ReactNode
  staff?: Staff[]
  event: GuestlistEvent
}

export const AddLinkDialogButton = ({
  variant,
  title,
  description,
  staff,
  event,
}: AddLinkDialogButtonProps) => {
  const [open, setOpen] = useState(false)
  
  const staffNames = Object.keys(teamInfo).sort()
  const [selectedStaff, setSelectedStaff] = useState<string[]>(staffNames) // Start with all selected

  const handleStaffToggle = (staffName: string, checked: boolean) => {
    if (checked) {
      setSelectedStaff(prev => [...prev, staffName])
    } else {
      setSelectedStaff(prev => prev.filter(name => name !== staffName))
    }
  }

  const handleSelectAll = (checked: boolean) => {
    setSelectedStaff(checked ? staffNames : [])
  }

  // Use provided description or generate staff list for staff variant
  const getDescription = () => {
    if (description) {
      return description
    }

    if (variant === "staff") {
      return (
        <div>
          <div className="mb-2 flex items-center justify-between">
            <span>Select staff to send links to:</span>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="select-all"
                checked={selectedStaff.length === staffNames.length}
                onCheckedChange={handleSelectAll}
              />
              <label htmlFor="select-all" className="text-xs text-muted-foreground">
                All ({staffNames.length})
              </label>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs mb-5 max-h-48 overflow-y-auto">
            {staffNames.map((name) => (
              <div key={name} className="flex items-center space-x-2">
                <Checkbox
                  id={`staff-${name}`}
                  checked={selectedStaff.includes(name)}
                  onCheckedChange={(checked) => handleStaffToggle(name, !!checked)}
                />
                <label htmlFor={`staff-${name}`} className="cursor-pointer">
                  {name}
                </label>
              </div>
            ))}
          </div>
          <div className="text-xs text-muted-foreground">
            {selectedStaff.length} of {staffNames.length} selected
          </div>
        </div>
      )
    }

    return null
  }
  const finalDescription = getDescription()

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">{title}</Button>
      </DialogTrigger>
      <DialogContent className="max-w-xs">
        <DialogHeader>
          <DialogTitle className="mb-4">{title}</DialogTitle>
          {finalDescription &&
            (typeof finalDescription === "string" ? (
              <DialogDescription>{finalDescription}</DialogDescription>
            ) : (
              <div className="text-sm text-muted-foreground">
                {finalDescription}
              </div>
            ))}
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
                selectedStaff={selectedStaff}
                onSubmitFromParent={() => setOpen(false)}
              />
            </>
          )}
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
