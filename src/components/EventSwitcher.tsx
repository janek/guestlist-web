"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"
import { AddEventButton } from "./AddEventButton"

interface EventSwitcherProps extends React.HTMLAttributes<HTMLDivElement> {
  events: GuestlistEvent[];
  currentEventId: string | undefined;
  onAddEvent: () => void;
}

export function EventSwitcher({ events, currentEventId, onAddEvent, ...props }: EventSwitcherProps) {
  const router = useRouter()

  const handleEventChange = (eventId: string) => {
    router.push(`/?eventId=${eventId}`)
  }

  return (
    <div className="flex items-center space-x-2" {...props}>
      <Select defaultValue={currentEventId || undefined} onValueChange={handleEventChange}>
        <SelectTrigger className="w-[280px]">
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
      <AddEventButton onClick={onAddEvent} />
    </div>
  )
}
