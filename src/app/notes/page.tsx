"use client";

import { createBrowserClient } from "@supabase/ssr";

export default async function Page() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
  const { data, error } = await supabase.from("guests").select("*");
  console.log(data, error);

  return "Hi";
}
