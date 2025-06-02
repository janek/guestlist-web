"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type { Tables } from "../../lib/database.types"
import { LinkDetailsForm } from "./LinkDetailsForm"

type LinkDetailsDialogProps = {
  link: Tables<"links"> | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const LinkDetailsDialog = ({
  link,
  open,
  onOpenChange,
}: LinkDetailsDialogProps) => {
  if (!link) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xs">
        <DialogHeader>
          <DialogTitle className="mb-4">Edit Link</DialogTitle>
          <LinkDetailsForm link={link} />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
} 