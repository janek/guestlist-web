"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/utils/supabase/client"
import LinksTable from "./LinksTable"
import type { Tables } from "../../lib/database.types"

type LinksClientProps = {
  initialLinks: Tables<"links">[]
  eventId: string
}

export default function LinksClient({ initialLinks, eventId }: LinksClientProps) {
  const [links, setLinks] = useState<Tables<"links">[]>(initialLinks)
  const supabase = createClient()

  // Sync local state when event changes
  useEffect(() => {
    setLinks(initialLinks)
  }, [initialLinks])

  // Listen for custom optimistic creation events
  useEffect(() => {
    const handler = (e: Event) => {
      const custom = e as CustomEvent<Tables<"links">>
      const newLink = custom.detail
      if (!newLink || newLink.event_id !== eventId) return
      // Avoid duplicates
      setLinks((prev) => {
        if (prev.some((l) => l.id === newLink.id)) return prev
        return [...prev, newLink]
      })
    }
    window.addEventListener("link-created", handler)
    return () => window.removeEventListener("link-created", handler)
  }, [eventId])

  // Realtime subscription for links table
  useEffect(() => {
    const channel = supabase
      .channel("links_client")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "links",
          filter: `event_id=eq.${eventId}`,
        },
        (payload) => {
          if (payload.eventType === "DELETE") {
            const id = payload.old?.id as string
            setLinks((prev) => prev.filter((l) => l.id !== id))
          } else if (payload.eventType === "INSERT") {
            const newLink = payload.new as Tables<"links">
            setLinks((prev) => {
              if (prev.some((l) => l.id === newLink.id)) return prev
              return [...prev, newLink]
            })
          } else if (payload.eventType === "UPDATE") {
            const updated = payload.new as Tables<"links">
            setLinks((prev) => prev.map((l) => (l.id === updated.id ? updated : l)))
          }
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase, eventId])

  return <LinksTable links={links} />
} 