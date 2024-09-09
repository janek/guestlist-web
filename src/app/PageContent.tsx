"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { AddLinkDialogButton } from "@/components/AddLinkDialogButton"
import { DownloadCsvButton } from "@/components/DownloadCsvButton"
import { EventSwitcher } from "@/components/EventSwitcher"
import { GuestDetailsDialog } from "@/components/GuestDetailsDialog"
import GuestlistTable from "@/components/GuestlistTable"
import LinksTable from "@/components/LinksTable"
import { LogoutButton } from "@/components/LogoutButton"
import { ScrollArea } from "@/components/ui/scroll-area"
import { AddEventDialog } from "@/components/AddEventDialog"
import { createClient } from "@/utils/supabase/client"

interface PageContentProps {
  user: any
  allowedEvents: GuestlistEvent[]
  eventId: string | undefined
  event: GuestlistEvent | null
  guests: Guest[]
  links: Link[]
  staff: Staff[]
}

export default function PageContent({
  user,
  allowedEvents,
  eventId,
  event,
  guests,
  links,
  staff,
}: PageContentProps) {
  const router = useRouter()
  const [isAddEventDialogOpen, setIsAddEventDialogOpen] = useState(false)
  const [events, setEvents] = useState(allowedEvents)

  const handleAddEvent = async (eventData: { name: string; date: string }) => {
    const supabase = createClient()
    console.log("Adding event:", eventData, "User ID:", user.id)
    const { data, error } = await supabase
      .from("events")
      .insert([{ name: eventData.name, date: eventData.date, owner: user.id }])
      .select()
    console.log("Supabase response:", { data, error })

    if (error) {
      console.error("Error adding event:", error)
      alert("Failed to add event. Please try again.")
    } else if (data && data.length > 0) {
      const newEvent = data[0] as GuestlistEvent
      setEvents((prevEvents) => [...prevEvents, newEvent])
      router.push(`/?eventId=${newEvent.id}`)
    } else {
      console.error("No data returned after inserting event")
      alert("Failed to add event. Please try again.")
    }
  }

  return (
    <div className="flex flex-col md:h-screen md:justify-center">
      <div className="flex flex-row items-center justify-center w-full mb-8 mt-8 md:mt-0">
        <h4 className="scroll-m-20 text-xl font-semibold tracking-tight mr-4">
          Event:
        </h4>
        <EventSwitcher
          className="w-[280px]"
          events={events}
          currentEventId={eventId}
          onAddEvent={() => setIsAddEventDialogOpen(true)}
        />
      </div>
      <div className="flex flex-col items-center md:flex-row md:items-start">
        <div className="flex flex-col items-center w-full">
          <h4 className="scroll-m-20 text-xl mb-4 font-semibold tracking-tight text-left">
            Full guestlist
          </h4>
          <ScrollArea className="h-[500px] w-[350px] rounded-md border p-4 mb-4">
            <GuestlistTable guests={guests} shouldShowOrganization />
          </ScrollArea>
          <div className="flex hflex space-x-2">
            <GuestDetailsDialog organisation={"Turbulence"} eventId={eventId} />
            <DownloadCsvButton guests={guests} />
          </div>
        </div>
        <div className="flex flex-col items-center w-full mt-10 md:mt-0">
          <h4 className="scroll-m-20 text-xl mb-4 font-semibold tracking-tight text-left">
            Links
          </h4>
          <ScrollArea className="h-[300px] w-[350px] rounded-md border p-4 mb-4">
            <LinksTable links={links} />
          </ScrollArea>
          <div className="flex space-x-4">
            <AddLinkDialogButton
              title="Create link"
              variant="manual"
              event={event as GuestlistEvent}
            />
            <AddLinkDialogButton
              title="Send out staff links"
              description="Links will be sent via telegram"
              variant="staff"
              staff={staff}
              event={event as GuestlistEvent}
            />
          </div>
        </div>
      </div>
      <div className="m-4 pt-7 pb-2 flex flex-row text-xs italic text-gray-400 md:fixed md:bottom-0 md:right-0 justify-center">
        <p>Logged in as {user.email}.&nbsp;</p>
        <LogoutButton />
      </div>
      <AddEventDialog
        isOpen={isAddEventDialogOpen}
        onClose={() => setIsAddEventDialogOpen(false)}
        onSubmit={handleAddEvent}
      />
    </div>
  )
}
