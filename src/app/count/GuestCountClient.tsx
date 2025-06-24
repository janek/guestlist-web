"use client"

import { createClient } from "@/utils/supabase/client"
import { useEffect, useState } from "react"
import TicketsSection from "./TicketsSection"

type GuestCountClientProps = {
  eventId: string
}

type GuestBreakdown = {
  free: { total: number; checkedIn: number }
  half: { total: number; checkedIn: number }
  skip: { total: number; checkedIn: number }
}

function useAnimatedCounter(target: number, duration = 500) {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (target === 0) {
      setCurrent(0)
      return
    }

    const startTime = Date.now()
    const startValue = current

    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)

      // Easing function for smooth animation
      const easeOut = 1 - Math.pow(1 - progress, 3)
      const value = Math.round(startValue + (target - startValue) * easeOut)

      setCurrent(value)

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    requestAnimationFrame(animate)
  }, [target, duration])

  return current
}

function GradientProgress({ value }: { value: number }) {
  return (
    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-500 ease-out bg-gradient-to-r from-gray-300 via-gray-400 to-gray-500"
        style={{ width: `${value}%` }}
      />
    </div>
  )
}

export default function GuestCountClient({ eventId }: GuestCountClientProps) {
  const [totalCount, setTotalCount] = useState(0)
  const [checkedInCount, setCheckedInCount] = useState(0)
  const [breakdown, setBreakdown] = useState<GuestBreakdown>({
    free: { total: 0, checkedIn: 0 },
    half: { total: 0, checkedIn: 0 },
    skip: { total: 0, checkedIn: 0 },
  })

  const supabase = createClient()

  useEffect(() => {
    // Function to fetch and calculate counts
    const fetchAndCalculateCounts = async () => {
      const { data: guests, error } = await supabase
        .from("guests")
        .select("name, used, type")
        .eq("event_id", eventId)

      if (error) {
        console.error("Error fetching guests:", error)
        return
      }

      let total = 0,
        checkedIn = 0
      const newBreakdown: GuestBreakdown = {
        free: { total: 0, checkedIn: 0 },
        half: { total: 0, checkedIn: 0 },
        skip: { total: 0, checkedIn: 0 },
      }

      guests?.forEach((guest) => {
        // Count the main guest
        total++
        if (guest.used) {
          checkedIn++
        }

        // Count by type
        const guestType = guest.type as "free" | "half" | "skip"
        if (guestType && newBreakdown[guestType]) {
          newBreakdown[guestType].total++
          if (guest.used) {
            newBreakdown[guestType].checkedIn++
          }
        }

        // Count additional guests (e.g., +2, +3)
        const match = guest.name.match(/\+(\d+)$/)
        if (match) {
          const additionalGuests = Number.parseInt(match[1], 10)
          total += additionalGuests
          if (guestType && newBreakdown[guestType]) {
            newBreakdown[guestType].total += additionalGuests
          }
          if (guest.used) {
            checkedIn += additionalGuests
            if (guestType && newBreakdown[guestType]) {
              newBreakdown[guestType].checkedIn += additionalGuests
            }
          }
        }
      })

      setTotalCount(total)
      setCheckedInCount(checkedIn)
      setBreakdown(newBreakdown)
    }

    // Initial fetch
    fetchAndCalculateCounts()

    // Set up real-time subscription
    const subscription = supabase
      .channel("guests_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "guests",
          filter: `event_id=eq.${eventId}`,
        },
        () => {
          fetchAndCalculateCounts()
        },
      )
      .subscribe()

    // Cleanup subscription on component unmount
    return () => {
      subscription.unsubscribe()
    }
  }, [eventId, supabase])

  const guestPercentage =
    totalCount > 0 ? (checkedInCount / totalCount) * 100 : 0

  // Animated counters - only animate the "checked in" numbers, not totals
  const animatedCheckedIn = useAnimatedCounter(checkedInCount)
  const animatedPercentage = useAnimatedCounter(guestPercentage)

  // Animated breakdown counters - only checked in counts
  const animatedFreeCheckedIn = useAnimatedCounter(breakdown.free.checkedIn)
  const animatedHalfCheckedIn = useAnimatedCounter(breakdown.half.checkedIn)
  const animatedSkipCheckedIn = useAnimatedCounter(breakdown.skip.checkedIn)

  return (
    <div className="container mx-auto p-4 space-y-8 max-w-sm">
      {/* Tickets Section */}
      <TicketsSection />

      {/* Guestlist Section */}
      <div className="text-center">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">
          Guestlist checked in
        </h2>
        <div className="space-y-3 max-w-64 mx-auto">
          <GradientProgress value={animatedPercentage} />
          <div className="space-y-1">
            <p className="text-sm text-gray-600 font-medium font-mono">
              {animatedCheckedIn}/{totalCount}
            </p>
            <p className="text-xs text-gray-400 italic font-mono">
              ({animatedFreeCheckedIn}/{breakdown.free.total} free,{" "}
              {animatedHalfCheckedIn}/{breakdown.half.total} half,{" "}
              {animatedSkipCheckedIn}/{breakdown.skip.total} skip)
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
