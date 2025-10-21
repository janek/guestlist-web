"use server"

import { createClient } from "@/utils/supabase/server"
import { Bot } from "grammy"
import { teamInfo } from "./constants"

export async function sendOutStaffLinks(
  limit_free: number,
  limit_half: number,
  limit_skip: number,
  baseUrl: string,
  event: GuestlistEvent,
  selectedStaff: string[],
) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN
  const adminId = process.env.TELEGRAM_ADMIN_ID
  console.log("[sendOutStaffLinks] env presence:", {
    TELEGRAM_BOT_TOKEN: !!botToken,
    TELEGRAM_ADMIN_ID: !!adminId,
  })

  if (!botToken || !adminId) {
    console.error("[sendOutStaffLinks] Missing required env vars – aborting")
    throw new Error("Missing Telegram configuration on server")
  }

  const bot = new Bot(botToken)
  const supabase = createClient()

  const undeliveredLinks: Array<{
    name: string
    id: string | number
    error: string
  }> = []

  // Filter teamInfo to only include selected staff
  const selectedTeamInfo = Object.fromEntries(
    Object.entries(teamInfo).filter(([name]) => selectedStaff.includes(name)),
  )

  for (const [name, id] of Object.entries(selectedTeamInfo)) {
    console.log("[sendOutStaffLinks] inserting link for", { name, id })
    const { data, error } = await supabase
      .from("links")
      .insert([
        {
          organisation: `${name} (Turbulence)`,
          event_id: event.id,
          limit_free: limit_free || 0,
          limit_half: limit_half || 0,
          limit_skip: limit_skip || 0,
          telegram_user_id: id,
        },
      ])
      .select()

    if (error) {
      console.error("[sendOutStaffLinks] Supabase insert error:", error)
      throw error
    }

    if (data) {
      console.log("[sendOutStaffLinks] Supabase insert success – slug:", data[0].slug)
      const slug = data[0].slug as string
      const url = `${baseUrl}/${slug}`
      try {
        await bot.api.sendMessage(
          id,
          `Hi ${name}! Your guestlist link for <i>${event.name}</i> is:\n\n<a href="${url}">${url}</a>\n<i>(${limit_free} free, ${limit_half} half, ${limit_skip} skip)</i>.\n\n<b>Please use the link (and not the bot) to put on names</b>`,
          { parse_mode: "HTML" },
        )
      } catch (err) {
        console.error(`Failed to send message to ${name}:`, err)
        undeliveredLinks.push({
          name,
          id,
          error: err instanceof Error ? err.message : String(err),
        })
      }
    }
  }

  if (undeliveredLinks.length > 0) {
    const undeliveredMessage = undeliveredLinks
      .map(({ name, id, error }) => `${name} (ID: ${id}) - Error: ${error}`)
      .join("\n")
    await bot.api.sendMessage(
      adminId,
      `These staff links could not be delivered:\n${undeliveredMessage}`,
    )
  }
} 