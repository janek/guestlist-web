"use client"

import { Button } from "@/components/ui/button"

export function CreateEventButton() {
  const handleCreateEvent = () => {
    console.log('Create event clicked')
  }

  return (
    <Button onClick={handleCreateEvent} className="mb-4">
      Create Event
    </Button>
  )
} 