import { GuestDetailsDialog } from "@/components/GuestDetailsDialog"
import GuestlistTable from "@/components/GuestlistTable"
import { ScrollArea } from "@/components/ui/scroll-area"
import { createClient } from "@/utils/supabase/server"

export default async function Page({ params }: { params: { slug: string } }) {
  const supabase = createClient()

  const { data: links } = await supabase
    .from("links_with_event_details")
    .select()
    .eq("slug", params.slug)
    .returns<Link[]>()

  if (!links || links.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h4 className="scroll-m-20 text-xl mb-4 font-semibold tracking-tight text-left">
          Invalid link
        </h4>
      </div>
    )
  }

  const link = links[0] as Link

  // TODO: this should be a joined table, probably, for performance reasons - see egghead course
  // https://egghead.io/courses/build-a-twitter-clone-with-the-next-js-app-router-and-supabase-19bebadb
  const linkId = link.id
  const { data: guests } = await supabase
    .from("guests")
    .select()
    .eq("link_id", linkId)
    .returns<Guest[]>()

  const organisationName = link.organisation as string

  const usedFree = guests?.filter(guest => guest.type === 'free').length || 0
  const usedHalf = guests?.filter(guest => guest.type === 'half').length || 0
  const usedSkip = guests?.filter(guest => guest.type === 'skip').length || 0

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h4 className="scroll-m-20 text-2xl mb-2 font-semibold tracking-tight text-left">
        {link.event_name}
      </h4>
      {link.event_date && (
        <h5 className="scroll-m-20 text-lg mb-4 font-normal tracking-tight text-left italic">
          {`${new Date(link.event_date).toLocaleDateString("de-DE")}, TXL Airport`}
        </h5>
      )}
      <p className="scroll-m-20 text-md mb-4 font-normal tracking-tight text-left">
        Guestlist for {organisationName}
      </p>
      <p className="scroll-m-20 text-md mb-4 font-normal tracking-tight text-left">
        {link.limit_free > 0 && `Free: ${usedFree}/${link.limit_free} used`}
        {link.limit_free > 0 && link.limit_half > 0 && ', '}
        {link.limit_half > 0 && `Half: ${usedHalf}/${link.limit_half} used`}
        {(link.limit_free > 0 || link.limit_half > 0) && link.limit_skip > 0 && ', '}
        {link.limit_skip > 0 && `Skip: ${usedSkip}/${link.limit_skip} used`}
      </p>
      <ScrollArea className="h-[270px] w-[350px] rounded-md border p-4 mb-4">
        <GuestlistTable
          guests={guests || []}
          link={link}
          shouldShowOrganization={false}
        />
      </ScrollArea>
      <GuestDetailsDialog
        organisation={organisationName}
        link={link}
        currentGuestlist={guests || []}
        editedFromLinkId={link.id}
      />
    </div>
  )
}
