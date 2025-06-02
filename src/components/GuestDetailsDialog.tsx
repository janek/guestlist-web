"use client"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import type { Tables } from "../../lib/database.types"
import { GuestDetailsForm } from "./GuestDetailsForm"

// Define prop types with optionality
type GuestDetailsDialogProps = {
  editingGuest?: Guest | null
  open?: boolean | null
  editedFromLinkId: string | null
  onOpenChange?: ((open: boolean) => void) | null
  addGuestButtonHidden?: boolean
  eventId: string
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
  editedFromLinkId = null,
  organisation = "no_org_error",
  eventId,
  link,
  currentGuestlist = [],
}: Partial<GuestDetailsDialogProps> = {}) => {
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

  // Always render something to prevent layout shift - no hydration check needed
  const renderTrigger = () => {
    if (addGuestButtonHidden) {
      return null
    }

    if (listTypes.size > 0) {
      return (
        <DialogTrigger asChild>
          <Button variant="outline">Add guest</Button>
        </DialogTrigger>
      )
    }

    return (
      <p className="text-sm italic">
        Your list is full, click on a name to edit or delete it
      </p>
    )
  }

  return (
    <Dialog open={open ?? undefined} onOpenChange={onOpenChange ?? undefined}>
      {renderTrigger()}
      <DialogContent className="max-w-xs">
        <DialogHeader>
          <DialogTitle className="mb-4">
            {guest ? "Edit guest" : "Add guest"}
          </DialogTitle>
          <GuestDetailsForm
            guest={guest}
            organisation={organisation}
            editedFromLinkId={editedFromLinkId}
            eventId={eventId || link?.event_id || null}
            availableListTypes={listTypes ?? new Set([])}
          />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
