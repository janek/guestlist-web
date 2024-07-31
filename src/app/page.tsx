import { AddLinkDialogButton } from "@/components/AddLinkDialogButton"
import { DownloadCsvButton } from "@/components/DownloadCsvButton"
import { GuestDetailsDialog } from "@/components/GuestDetailsDialog"
import GuestlistTable from "@/components/GuestlistTable"
import LinksTable from "@/components/LinksTable"
import { LogoutButton } from "@/components/LogoutButton"
import { ScrollArea } from "@/components/ui/scroll-area"
import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"

export default async function Page() {
  const supabase = createClient()

  const { data: user, error } = await supabase.auth.getUser()
  if (error || !user?.user) {
    redirect("/login")
  }

  const { data: allowedEvents } = await supabase
    .from("user_event_permissions")
    .select("event_id")
    .eq("user_id", user.user.id)

  const eventId = process.env.DEFAULT_EVENT_ID!

  console.log("Event ID:", eventId)

  // XXX: below we seem to have 3 requests to the DB, they should probably be one
  const { data: event, error: eventError } = await supabase
    .from("events")
    .select()
    .eq("id", eventId)

  const { data: guests, error: guestsError } = await supabase
    .from("guests")
    .select()
    .eq("event_id", eventId)

  const { data: links, error: linksError } = await supabase
    .from("links")
    .select()
    .eq("event_id", eventId)

  const { data: staff, error: staffError } = await supabase
    .from("staff")
    .select()

  // TODO: Get staff only for current account
  // .eq("belongs_to_account", currentUserId)

  return (
    <div className="flex flex-col md:h-screen md:justify-center">
      <div className="flex flex-col items-center md:flex-row md:items-start">
        <div className="flex flex-col items-center w-full">
          <h4 className="scroll-m-20 text-xl mb-4 font-semibold tracking-tight text-left">
            Full guestlist
          </h4>
          <ScrollArea className="h-[500px] w-[350px] rounded-md border p-4 mb-4">
            <GuestlistTable guests={guests || []} shouldShowOrganization />
          </ScrollArea>
          <div className="flex hflex space-x-2">
            {/* XXX: instead of hardcoded, use real value. Users table has no organisation
              field, so maybe we need a table/view which links users to organisations? */}
            <GuestDetailsDialog organisation={"entropie"} eventId={eventId} />
            <DownloadCsvButton guests={guests || []} />
          </div>
        </div>
        <div className="flex flex-col items-center w-full mt-10 md:mt-0">
          <h4 className="scroll-m-20 text-xl mb-4 font-semibold tracking-tight text-left">
            Links
          </h4>
          <ScrollArea className="h-[300px] w-[350px] rounded-md border p-4 mb-4">
            <LinksTable links={links || []} />
          </ScrollArea>
          {/* <p className="text-sm text-gray-400 italic">
            Link creation from database only at the moment
          </p> */}
          <div className="flex space-x-4">
            <AddLinkDialogButton
              title="Create link"
              variant="manual"
              eventId={eventId}
            />
            <AddLinkDialogButton
              title="Send out staff links"
              description="Links will be sent via telegram"
              variant="staff"
              eventId={eventId}
              staff={staff as Staff[]}
            />
          </div>
        </div>
      </div>
      <div className="m-4 pt-7 pb-2 flex flex-row text-xs italic text-gray-400 md:fixed md:bottom-0 md:right-0 justify-center">
        <p>Logged in as {user.user.email}.&nbsp;</p>
        <LogoutButton />
      </div>
    </div>
  )
}
