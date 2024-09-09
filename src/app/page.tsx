import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import PageContent from "./PageContent"

export default async function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const eventIdParam = searchParams.eventId as string | undefined
  const supabase = createClient()

  const { data: user, error } = await supabase.auth.getUser()
  if (error || !user?.user) {
    redirect("/login")
  }

  const { data: allowedEvents } = await supabase
    .from("events")
    .select("id, name, date, owner")
    .order('date', { ascending: false })

  const defaultEventId = process.env.DEFAULT_EVENT_ID
  const eventId = eventIdParam || defaultEventId || allowedEvents?.[0]?.id

  const { data: event } = await supabase
    .from("events")
    .select()
    .eq("id", eventId)
    .single()

  const { data: guests } = await supabase
    .from("guests")
    .select()
    .eq("event_id", eventId)

  const { data: links } = await supabase
    .from("links")
    .select()
    .eq("event_id", eventId)

  const { data: staff } = await supabase
    .from("staff")
    .select()

  return (
    <PageContent
      user={user.user}
      allowedEvents={allowedEvents || []}
      eventId={eventId}
      event={event}
      guests={guests || []}
      links={links || []}
      staff={staff || []}
    />
  )
}
