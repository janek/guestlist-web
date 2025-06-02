import { GuestDetailsDialog } from "@/components/GuestDetailsDialog"
import GuestlistTable from "@/components/GuestlistTable"
import { ScrollArea } from "@/components/ui/scroll-area"
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
  const { data, error } = await supabase.rpc('get_link_with_guests', {
    link_slug: params.slug
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
    permissions: null
  }

  const organisationName = result.organisation

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h4 className="scroll-m-20 text-2xl mb-2 font-semibold tracking-tight text-left">
        {result.event_name}
      </h4>
      {result.event_date && (
        <h5 className="scroll-m-20 text-lg mb-4 font-normal tracking-tight text-left italic">
          {`${new Date(result.event_date).toLocaleDateString("de-DE")}, TXL Airport`}
        </h5>
      )}
      <p className="scroll-m-20 text-md mb-4 font-normal tracking-tight text-left">
        Guestlist for {organisationName}
      </p>
      <p className="scroll-m-20 text-md mb-4 font-normal tracking-tight text-left">
        {result.limit_free > 0 && `Free: ${result.used_free}/${result.limit_free} used`}
        {result.limit_free > 0 && result.limit_half > 0 && ', '}
        {result.limit_half > 0 && `Half: ${result.used_half}/${result.limit_half} used`}
        {(result.limit_free > 0 || result.limit_half > 0) && result.limit_skip > 0 && ', '}
        {result.limit_skip > 0 && `Skip: ${result.used_skip}/${result.limit_skip} used`}
      </p>
      <ScrollArea className="h-[270px] w-[350px] rounded-md border p-4 mb-4">
        <GuestlistTable
          guests={guests}
          link={link}
          shouldShowOrganization={false}
        />
      </ScrollArea>
      <GuestDetailsDialog
        organisation={organisationName}
        link={link}
        currentGuestlist={guests}
        editedFromLinkId={result.id}
      />
    </div>
  )
}
