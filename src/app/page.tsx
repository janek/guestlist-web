import { AddLinkDialogButton } from "@/components/AddLinkDialogButton"
import { CreateEventButton } from "@/components/CreateEventButton"
import { DownloadCsvButton } from "@/components/DownloadCsvButton"
import { EventSwitcher } from "@/components/EventSwitcher"
import FullGuestlistClient from "@/components/FullGuestlistClient"
import { GuestDetailsDialog } from "@/components/GuestDetailsDialog"
import LinksTable from "@/components/LinksTable"
import { LogoutButton } from "@/components/LogoutButton"
import { ScrollArea } from "@/components/ui/scroll-area"
import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"

export default async function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const supabase = createClient()

  const { data: user, error } = await supabase.auth.getUser()
  if (error || !user?.user) {
    redirect("/login")
  }

  // Fetch list of allowed events first – small payload
  // AI comment: Consider using user_event_permissions table instead of owner field for:
  // • Semantic correctness (owner ≠ access permissions)
  // • Easier future RLS migration (policies would check same table)
  // • Multi-user event access support
  const { data: allowedEvents } = await supabase
    .from("events")
    .select("id, name, date, owner, pin")
    .eq("owner", user.user.id) // Above comment is regarding this condition
    .order("date", { ascending: false })

  // Check if user has any events first
  if (!allowedEvents || allowedEvents.length === 0) {
    // No events created yet - show create event prompt
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="text-center">
          <p className="text-lg mb-4">No events created yet</p>
          <CreateEventButton />
          <div className="flex items-center gap-4 justify-center">
            <p className="text-sm text-gray-600">
              Logged in as {user.user.email}
            </p>
            <LogoutButton />
          </div>
        </div>
      </div>
    )
  }

  const defaultEventId = process.env.DEFAULT_EVENT_ID
  const requestedEventId =
    (searchParams.eventId as string | undefined) ||
    defaultEventId ||
    allowedEvents[0].id

  // Verify the requested event belongs to this user
  const eventId = allowedEvents?.find(
    (event) => event.id === requestedEventId,
  )?.id
  // TODO: Better error states (and error handling)
  if (!eventId) {
    return (
      <div className="m-4">
        <p className="text-red-500 mb-4">
          No information found or access denied.
        </p>
        <div className="flex items-center gap-4">
          <p className="text-sm text-gray-600">
            Logged in as {user.user.email}
          </p>
          <LogoutButton />
        </div>
      </div>
    )
  }

  // ꧂ One round-trip does the heavy lifting
  const { data: dashboardRows, error: dashboardError } = await supabase.rpc(
    "get_dashboard",
    {
      p_event_id: eventId,
    },
  )

  if (dashboardError || !dashboardRows || dashboardRows.length === 0) {
    return <p className="m-4 text-red-500">Failed to load dashboard.</p>
  }

  const dashboard = dashboardRows[0] as {
    event: GuestlistEvent
    guests: Guest[]
    links: Database["public"]["Tables"]["links"]["Row"][]
    staff: Staff[]
  }

  const { event, guests, links, staff } = dashboard

  const guestCount = guests?.length || 0
  const checkedInCount = guests?.filter((guest) => guest.used).length || 0
  const linkCount = links?.length || 0
  const totalSlots =
    links?.reduce(
      (total, link) =>
        total + (link.limit_free + link.limit_half + link.limit_skip),
      0,
    ) || 0

  return (
    <div className="flex flex-col md:h-screen md:justify-center">
      <div className="flex flex-row items-center justify-center w-full mb-8 mt-8 md:mt-0">
        <h4 className="scroll-m-20 text-xl font-semibold tracking-tight mr-4">
          Event:
        </h4>
        <EventSwitcher
          className="w-[280px]"
          events={allowedEvents || []}
          currentEventId={eventId}
        />
      </div>
      <div className="flex flex-col items-center md:flex-row md:items-start">
        <div className="flex flex-col items-center w-full">
          <h4 className="scroll-m-20 text-xl mb-4 font-semibold tracking-tight text-left">
            Full guestlist
          </h4>
          <ScrollArea className="h-[500px] w-[350px] rounded-md border p-4 mb-4">
            <FullGuestlistClient
              initialGuests={guests || []}
              eventId={eventId}
              shouldShowOrganization
            />
          </ScrollArea>
          <div className="flex hflex space-x-2 mb-4">
            {/* XXX: instead of hardcoded, use real value. Users table has no organisation
              field, so maybe we need a table/view which links users to organisations? */}
            <GuestDetailsDialog
              organisation={"Turbulence"}
              eventId={eventId as string}
            />
            <DownloadCsvButton guests={guests || []} />
          </div>
          <p className="text-xs italic text-gray-400 mb-4">
            {guestCount} guests total, {checkedInCount} checked in
          </p>
        </div>
        <div className="flex flex-col items-center w-full mt-10 md:mt-0">
          <h4 className="scroll-m-20 text-xl mb-4 font-semibold tracking-tight text-left">
            Links
          </h4>
          <ScrollArea className="h-[300px] w-[350px] rounded-md border p-4 mb-4">
            <LinksTable links={links || []} />
          </ScrollArea>
          <div className="flex space-x-4 mb-4">
            <AddLinkDialogButton
              title="Create link"
              variant="manual"
              event={event}
            />
            <AddLinkDialogButton
              title="Send staff links"
              variant="staff"
              staff={staff}
              event={event}
            />
          </div>
          <p className="text-xs italic text-gray-400 mb-4">
            {linkCount} links, {totalSlots} slots total
          </p>
        </div>
      </div>
      <div className="m-4 pt-7 pb-2 flex flex-row text-xs italic text-gray-400 md:fixed md:bottom-0 md:right-0 justify-center">
        <p>Logged in as {user.user.email}.&nbsp;</p>
        <LogoutButton />
      </div>
    </div>
  )
}
