import { OptimisticGuestlistPage } from "@/components/OptimisticGuestlistPage"
import { createClient } from "@/utils/supabase/server"

// Type for the optimized single-query result
type LinkWithGuestsResponse = {
  id: string
  slug: string
  organisation: string
  limit_free: number
  limit_half: number
  limit_skip: number
  event_name: string
  event_date: string
  event_id: string
  guests: Guest[]
  used_free: number
  used_half: number
  used_skip: number
}

export default async function Page({ params }: { params: { slug: string } }) {
  const supabase = createClient()

  // Single optimized query that gets everything in one database call
  const { data, error } = await supabase.rpc("get_link_with_guests", {
    link_slug: params.slug,
  })

  if (error || !data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h4 className="scroll-m-20 text-xl mb-4 font-semibold tracking-tight text-left">
          Invalid link
        </h4>
      </div>
    )
  }

  const result = data[0] as LinkWithGuestsResponse

  // Convert the JSON guests back to proper Guest objects
  const guests: Guest[] = Array.isArray(result.guests) ? result.guests : []

  // Create link object for compatibility with existing components
  const link: Link = {
    id: result.id,
    slug: result.slug,
    organisation: result.organisation,
    limit_free: result.limit_free,
    limit_half: result.limit_half,
    limit_skip: result.limit_skip,
    event_name: result.event_name,
    event_date: result.event_date,
    event_id: result.event_id,
    permissions: null,
  }

  return (
    <OptimisticGuestlistPage
      initialGuests={guests}
      link={link}
      organisationName={result.organisation}
      usedCounts={{
        used_free: result.used_free,
        used_half: result.used_half,
        used_skip: result.used_skip,
      }}
      eventName={result.event_name}
      eventDate={result.event_date}
    />
  )
}
