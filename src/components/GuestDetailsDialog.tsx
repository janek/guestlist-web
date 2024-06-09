"use client"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useEffect, useState } from "react"
import type { Tables } from "../../lib/database.types"
import { GuestDetailsForm } from "./GuestDetailsForm"

// Define prop types with optionality
type GuestDetailsDialogProps = {
  guest?: Guest | null
  open?: boolean | null
  onOpenChange?: ((open: boolean) => void) | null
  addGuestButtonHidden?: boolean
  organisation?: string
}

// Set default props using destructuring with default values
export const GuestDetailsDialog = ({
  guest = null,
  open = null,
  onOpenChange = null,
  addGuestButtonHidden = false,
  organisation = "no_org_error",
}: Partial<GuestDetailsDialogProps> = {}) => {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])
  return (
    <Dialog open={open ?? undefined} onOpenChange={onOpenChange ?? undefined}>
      {isClient && !addGuestButtonHidden && (
        <DialogTrigger asChild>
          <Button variant="outline">Add guest</Button>
        </DialogTrigger>
      )}
      <DialogContent className="max-w-xs">
        <DialogHeader>
          <DialogTitle className="mb-4">
            {guest ? "Edit guest" : "Add guest"}
          </DialogTitle>
          <GuestDetailsForm guest={guest} organisation={organisation} />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
