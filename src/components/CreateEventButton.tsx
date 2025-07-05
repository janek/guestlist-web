"use client"

import { CreateEventDialog } from "@/components/CreateEventDialog"
import { Button } from "@/components/ui/button"

export function CreateEventButton() {
  const handleEventCreated = (event: GuestlistEvent) => {
    console.log("Event created:", event)
    // TODO: check against the create event sub-button, I think this is a stub and over there it's already working
  }

  return (
    <CreateEventDialog
      trigger={<Button className="mb-4">Create Event</Button>}
      onEventCreated={handleEventCreated}
    />
  )
}
