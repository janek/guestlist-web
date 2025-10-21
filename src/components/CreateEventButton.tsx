"use client"

import { CreateEventDialog } from "@/components/CreateEventDialog"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export function CreateEventButton() {
  const router = useRouter()
  const handleEventCreated = (event: GuestlistEvent) => {
    // Ensure the dashboard re-fetches by navigating to the new event
    router.push(`/?eventId=${event.id}`)
  }

  return (
    <CreateEventDialog
      trigger={<Button className="mb-4">Create Event</Button>}
      onEventCreated={handleEventCreated}
    />
  )
}
