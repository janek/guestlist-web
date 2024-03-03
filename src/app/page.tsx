import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import GuestlistTable from "@/components/GuestlistTable";
import { AddGuestDialogButton } from "@/components/AddGuestDialogButton";
import { ScrollArea } from "@/components/ui/scroll-area";


export default async function Page() {
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
    },
  );
  const { data: guests } = await supabase.from("guests").select();

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h4 className="scroll-m-20 text-xl mb-4 font-semibold tracking-tight text-left">
        Turbulence
      </h4>
      <ScrollArea className="h-[500px] w-[350px] rounded-md border p-4 mb-4">
        <GuestlistTable guests={guests || []} />
      </ScrollArea>
      <AddGuestDialogButton organisationName="Turbulence"/>
    </div>
  );
}
