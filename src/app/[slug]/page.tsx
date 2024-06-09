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
  const organisationName = link.organisation as string // XXX: Use a joined view instead
  const { data: guests } = await supabase
    .from("guests")
    .select()
    .eq("organisation", organisationName)

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h4 className="scroll-m-20 text-2xl mb-2 font-semibold tracking-tight text-left">
        {link.event_name}
      </h4>
      {link.event_date && (
        <h5 className="scroll-m-20 text-lg mb-4 font-normal tracking-tight text-left italic">
          {`${new Date(link.event_date).toLocaleDateString("de-DE")} ${link.event_date.includes("T") ? new Date(link.event_date).toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" }) : ""}, TXL Airport`}
        </h5>
      )}
      <p className="scroll-m-20 text-md mb-4 font-normal tracking-tight text-left">
        Guestlist for {organisationName}
      </p>
      <p className="scroll-m-20 text-md mb-4 font-normal tracking-tight text-left">
        Free: {link.limit_free ?? "N/A"}, Half: {link.limit_half ?? "N/A"},
        Skip: {link.limit_skip ?? "N/A"}
      </p>
      {/* {guests && guests.length > 0 && ( */}
      <ScrollArea className="h-[350px] w-[350px] rounded-md border p-4 mb-4">
        <GuestlistTable
          guests={guests || []}
          link={link}
          shouldShowOrganization={false}
        />
      </ScrollArea>
      {/* )} */}
      <GuestDetailsDialog
        organisation={organisationName}
        link={link}
        currentGuestlist={guests}
      />
    </div>
  )
}
