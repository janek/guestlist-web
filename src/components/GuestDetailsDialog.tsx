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
  guest?: Tables<"guests"> | null
  open?: boolean | null
  onOpenChange?: ((open: boolean) => void) | null
  addGuestButtonHidden?: boolean
}

// Set default props using destructuring with default values
export const GuestDetailsDialog = ({
  guest = null,
  open = null,
  onOpenChange = null,
  addGuestButtonHidden = false,
}: Partial<GuestDetailsDialogProps> = {}) => {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])
  return (
    <Dialog open={open ?? undefined} onOpenChange={onOpenChange ?? undefined}>
      {isClient && !addGuestButtonHidden && (
        <DialogTrigger>
          <Button>Add guest</Button>
        </DialogTrigger>
      )}
      <DialogContent className="max-w-xs">
        <DialogHeader>
          <DialogTitle className="mb-4">
            {guest ? "Edit guest" : "Add guest"}
          </DialogTitle>
          <GuestDetailsForm
            onSubmitFromParent={() => console.log("submit")}
            guest={guest}
          />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
