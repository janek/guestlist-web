import { createClient } from "@/utils/supabase/server"
import GuestCountClient from './GuestCountClient'

export default async function GuestCountPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const eventIdParam = searchParams.eventId as string | undefined
  const supabase = createClient()

  const { data: user, error } = await supabase.auth.getUser()
  if (error || !user?.user) {
    return <div className="container mx-auto p-4"><p className="text-lg">Please log in</p></div>
  }

  // AI comment: Consider using user_event_permissions table instead of owner field for:
  // • Semantic correctness (owner ≠ access permissions)
  // • Easier future RLS migration (policies would check same table)
  // • Multi-user event access support
  const { data: allowedEvents } = await supabase
    .from("events")
    .select("id, name, date")
    .eq('owner', user.user.id)
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
