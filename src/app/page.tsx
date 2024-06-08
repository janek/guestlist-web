import GuestlistTable from "@/components/GuestlistTable";
import { AddGuestDialogButton } from "@/components/AddGuestDialogButton";
import { ScrollArea } from "@/components/ui/scroll-area";
import LinksTable from "@/components/LinksTable";
import { AddLinkDialogButton } from "@/components/AddLinkDialogButton";
import { DownloadCsvButton } from "@/components/DownloadCsvButton";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { LogoutButton } from "@/components/LogoutButton";

export default async function Page() {
  const supabase = createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/login");
  }

  const { data: guests } = await supabase.from("guests").select();
  const { data: links } = await supabase.from("links").select();

  return (
    <div>
      <div className="flex flex-col items-center justify-center md:flex-row">
        <div className="flex flex-col items-center w-full">
          <h4 className="scroll-m-20 text-xl mb-4 font-semibold tracking-tight text-left">
            Complete guestlist
          </h4>
          <ScrollArea className="h-[500px] w-[350px] rounded-md border p-4 mb-4">
            <GuestlistTable guests={guests || []} shouldShowOrganization />
          </ScrollArea>
          <div className="flex hflex space-x-2">
            <AddGuestDialogButton organisationName="Turbulence" />
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
          <AddLinkDialogButton />
        </div>
      </div>
      <div className="m-4 pt-7 pb-2 flex flex-row text-xs italic text-gray-400 md:fixed md:bottom-0 md:right-0 justify-center">
        <p>Logged in as {data.user.email}.&nbsp;</p>
        <LogoutButton />
      </div>
    </div>
  );
}
