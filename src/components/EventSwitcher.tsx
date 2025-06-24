"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CreateEventDialog } from "@/components/CreateEventDialog"
import { Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

interface EventSwitcherProps extends React.HTMLAttributes<HTMLDivElement> {
  events: GuestlistEvent[];
  currentEventId: string | undefined;
}

export function EventSwitcher({ events, currentEventId, ...props }: EventSwitcherProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)

  const SPECIAL_CREATE_VALUE = "__create__"

  const handleEventChange = (eventId: string) => {
    if (eventId === SPECIAL_CREATE_VALUE) {
      setCreateDialogOpen(true)
      return
    }
    router.push(`/?eventId=${eventId}`)
  }

  return (
    <div {...props}>
      <Select
        value={currentEventId}
        onValueChange={handleEventChange}
        open={open}
        onOpenChange={setOpen}
      >
        <SelectTrigger className="w-[280px]">
          <SelectValue placeholder="Select an event" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={SPECIAL_CREATE_VALUE} className="cursor-pointer">
            <div className="flex items-center">
              <Plus className="mr-2 h-4 w-4" />
              Create New Event
            </div>
          </SelectItem>
          {events.map((event) => (
            <SelectItem key={event.id} value={event.id}>
              {event.name} - {new Date(event.date).toLocaleDateString()}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <CreateEventDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onEventCreated={(newEvent) => {
          router.push(`/?eventId=${newEvent.id}`)
        }}
      />
    </div>
  )
}