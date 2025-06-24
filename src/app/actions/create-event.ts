"use server"

import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"

export async function createEvent(name: string, date: Date, pin: number) {
  const supabase = createClient()
  
  const { data: user, error: userError } = await supabase.auth.getUser()
  if (userError || !user?.user) {
    throw new Error("Not authenticated")
  }

  const { data, error } = await supabase
    .from("events")
    .insert({
      name,
      date: date.toISOString(),
      owner: user.user.id,
      pin: pin,
    })
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to create event: ${error.message}`)
  }

  // Redirect to the new event
  redirect(`/?eventId=${data.id}`)
}