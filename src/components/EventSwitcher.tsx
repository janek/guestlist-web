"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"

type Event = {
  id: string
  name: string
  date: string
}

export function EventSwitcher({ events, currentEventId }: { events: Event[], currentEventId: string | undefined }) {
  const router = useRouter()

  const handleEventChange = (eventId: string) => {
    router.push(`/?eventId=${eventId}`)
  }

  return (
    <Select defaultValue={currentEventId || undefined} onValueChange={handleEventChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select an event" />
      </SelectTrigger>
      <SelectContent>
        {events.map((event) => (
          <SelectItem key={event.id} value={event.id}>
            {event.name} - {new Date(event.date).toLocaleDateString()}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
