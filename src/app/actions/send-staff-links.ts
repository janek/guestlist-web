"use server"

import { sendOutStaffLinks } from "@/utils/telegram/server"
import { headers } from "next/headers"

export async function sendStaffLinks(
  limit_free: number,
  limit_half: number,
  limit_skip: number,
  event: GuestlistEvent,
  selectedStaff: string[],
) {
  const headersList = headers()
  const host = headersList.get("host")
  const protocol = process.env.NODE_ENV === "production" ? "https" : "http"
  const baseUrl = `${protocol}://${host}`

  // Temporary verbose logging – remove once issue is resolved
  console.log("[sendStaffLinks] host, protocol, baseUrl:", { host, protocol, baseUrl })
  console.log("[sendStaffLinks] payload:", {
    limit_free,
    limit_half,
    limit_skip,
    event,
    selectedStaffCount: selectedStaff.length,
  })

  await sendOutStaffLinks(limit_free, limit_half, limit_skip, baseUrl, event, selectedStaff)
}
