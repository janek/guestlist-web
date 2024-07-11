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
  editingGuest?: Guest | null
  open?: boolean | null
  onOpenChange?: ((open: boolean) => void) | null
  addGuestButtonHidden?: boolean
  organisation?: string // Deprecated, use info from link
  link: Link
  currentGuestlist: Guest[]
}

// Set default props using destructuring with default values
export const GuestDetailsDialog = ({
  editingGuest: guest = null,
  open = null,
  onOpenChange = null,
  addGuestButtonHidden = false,
  organisation = "no_org_error",
  link,
  currentGuestlist = [],
}: Partial<GuestDetailsDialogProps> = {}) => {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const availableListTypes = (
    link: Link,
    guests: Guest[],
  ): AvailableListTypes => {
    const currentGuests = guests.reduce(
      (acc, guest) => {
        if (guest.type === "free") {
          acc.free += 1
        } else if (guest.type === "half") {
          acc.half += 1
        } else if (guest.type === "skip") {
          acc.skip += 1
        }
        return acc
      },
      { free: 0, half: 0, skip: 0 },
    )

    const availableListTypes: Set<ListType> = new Set()

    if (currentGuests.free < (link.limit_free ?? 0)) {
      availableListTypes.add("free")
    }
    if (currentGuests.half < (link.limit_half ?? 0)) {
      availableListTypes.add("half")
    }
    if (currentGuests.skip < (link.limit_skip ?? 0)) {
      availableListTypes.add("skip")
    }

    return availableListTypes
  }

  const listTypes = link
    ? availableListTypes(link, currentGuestlist)
    : new Set<ListType>(["free", "half", "skip"])

  return (
    <Dialog open={open ?? undefined} onOpenChange={onOpenChange ?? undefined}>
      {isClient &&
        !addGuestButtonHidden &&
        (listTypes.size > 0 ? (
          <DialogTrigger asChild>
            <Button variant="outline">Add guest</Button>
          </DialogTrigger>
        ) : (
          <p className="text-sm italic">
            Your list is full, click on a name to edit or delete it
          </p>
        ))}
      <DialogContent className="max-w-xs">
        <DialogHeader>
          <DialogTitle className="mb-4">
            {guest ? "Edit guest" : "Add guest"}
          </DialogTitle>
          <GuestDetailsForm
            guest={guest}
            organisation={organisation}
            eventId={link?.event_id || ""}
            availableListTypes={listTypes ?? new Set([])}
          />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
