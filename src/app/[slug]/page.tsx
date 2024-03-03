import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import GuestlistTable from "@/components/GuestlistTable";
import { AddGuestDialogButton } from "@/components/AddGuestDialogButton";
import { ScrollArea } from "@/components/ui/scroll-area";


export default async function Page({ params }: { params: { slug: string } }) {
  const cookieStore = cookies();
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  const { data: links } = await supabase
    .from("links")
    .select()
    .eq("url_code", params.slug);

  if (!links || links.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h4 className="scroll-m-20 text-xl mb-4 font-semibold tracking-tight text-left">
          Invalid link
        </h4>
      </div>
    );
  }

  // TODO: this should be a joined table, probably, for performance readsons - see egghead course
  const organisationName = links[0].organisation!; // XXX: type
  const { data: guests } = await supabase
    .from("guests")
    .select()
    .eq("organisation", organisationName);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h4 className="scroll-m-20 text-xl mb-4 font-semibold tracking-tight text-left">
        List for {organisationName}
      </h4>
      <ScrollArea className="h-[500px] w-[350px] rounded-md border p-4 mb-4">
        <GuestlistTable guests={guests || []} shouldShowOrganization={false}/>
      </ScrollArea>
      <AddGuestDialogButton organisationName={organisationName} />
    </div>
  );
}
