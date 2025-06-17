"use client"

import { useState, useCallback, useEffect } from "react"
import { createClient } from "@/utils/supabase/client"
import GuestlistTable from "./GuestlistTable"

interface FullGuestlistClientProps {
  initialGuests: Guest[]
  eventId: string
  shouldShowOrganization?: boolean
}

export default function FullGuestlistClient({ initialGuests, eventId, shouldShowOrganization = false }: FullGuestlistClientProps) {
  const [guests, setGuests] = useState<Guest[]>(initialGuests)
  const supabase = createClient()

  const handleOptimisticUpdate = useCallback((newGuest: Guest) => {
    setGuests(prev => {
      const idx = prev.findIndex(g => g.id === newGuest.id)
      if (idx !== -1) {
        // replace
        const clone = [...prev]
        clone[idx] = newGuest
        return clone
      }
      return [...prev, newGuest]
    })
  }, [])

  const handleOptimisticDelete = useCallback((guestId: string) => {
    setGuests(prev => prev.filter(g => g.id !== guestId))
  }, [])

  // Realtime subscription to guests table for this event
  useEffect(() => {
    const channel = supabase
      .channel("guests_full_list")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "guests",
          filter: `event_id=eq.${eventId}`,
        },
        (payload) => {
          if (payload.eventType === "DELETE") {
            const id = payload.old?.id as string
            setGuests((prev) => prev.filter((g) => g.id !== id))
          } else if (payload.eventType === "INSERT") {
            setGuests((prev) => {
              const exists = prev.some((g) => g.id === (payload.new as any).id)
              if (exists) {
                return prev
              }
              return [...prev, payload.new as Guest]
            })
          } else if (payload.eventType === "UPDATE") {
            setGuests((prev) =>
              prev.map((g) =>
                g.id === (payload.new as any).id ? { ...g, ...(payload.new as Guest) } : g,
              ),
            )
          }
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase, eventId])

  return (
    <GuestlistTable
      guests={guests}
      shouldShowOrganization={shouldShowOrganization}
      onOptimisticUpdate={handleOptimisticUpdate}
      onOptimisticDelete={handleOptimisticDelete}
    />
  )
} 