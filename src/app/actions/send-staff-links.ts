"use server"

import { sendOutStaffLinks } from "@/utils/telegram"
import { headers } from "next/headers"

export async function sendStaffLinks(
  limit_free: number,
  limit_half: number,
  limit_skip: number,
  event: GuestlistEvent,
) {
  const headersList = headers()
  const host = headersList.get("host")
  const protocol = process.env.NODE_ENV === "production" ? "https" : "http"
  const baseUrl = `${protocol}://${host}`

  await sendOutStaffLinks(limit_free, limit_half, limit_skip, baseUrl, event)
}
