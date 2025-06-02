import { createClient } from "@/utils/supabase/server"
import GuestCountClient from './GuestCountClient'

export default async function GuestCountPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const eventIdParam = searchParams.eventId as string | undefined
  const supabase = createClient()

  const { data: allowedEvents } = await supabase
    .from("events")
    .select("id, name, date")
    .order('date', { ascending: false })

  const defaultEventId = process.env.DEFAULT_EVENT_ID
  const eventId = eventIdParam || defaultEventId || allowedEvents?.[0]?.id

  if (!eventId) {
    return (
      <div className="container mx-auto p-4">
        <p className="text-lg">No event found</p>
      </div>
    )
  }

  return <GuestCountClient eventId={eventId} />
}
