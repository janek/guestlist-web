import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import GuestlistTable from "@/components/GuestlistTable";
import { AddGuestDialogButton } from "@/components/AddGuestDialogButton";

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
    <>
      <div className="flex justify-center items-center h-screen">
        <div className="overflow-auto max-w-md max-h-96">
          <GuestlistTable guests={guests || []} />
          <AddGuestDialogButton />
        </div>
      </div>
    </>
  );
}
