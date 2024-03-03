import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import GuestlistTable from "@/components/GuestlistTable";

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
  const { data } = await supabase.from("guests").select();

  return (
    <>
      <div>
        <pre>{JSON.stringify(data, null, 2)}</pre>
        <GuestlistTable />
      </div>
    </>
  );
}
