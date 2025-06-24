"use client"

import { CreateEventDialog } from "@/components/CreateEventDialog"
import { Button } from "@/components/ui/button"

export function CreateEventButton() {
  const handleEventCreated = (event: GuestlistEvent) => {
    console.log("Event created:", event)
    // TODO: Redirect to new event or refresh page
  }

  return (
    <CreateEventDialog
      trigger={
        <Button className="mb-4">
          Create Event
        </Button>
      }
      onEventCreated={handleEventCreated}
    />
  )
} 