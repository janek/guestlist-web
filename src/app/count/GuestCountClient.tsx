'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'

type GuestCountClientProps = {
  eventId: string
}

export default function GuestCountClient({ eventId }: GuestCountClientProps) {
  const [totalRegularCount, setTotalRegularCount] = useState(0)
  const [totalAdditionalCount, setTotalAdditionalCount] = useState(0)
  const [usedRegularCount, setUsedRegularCount] = useState(0)
  const [usedAdditionalCount, setUsedAdditionalCount] = useState(0)

  const supabase = createClient()

  useEffect(() => {
    // Function to fetch and calculate counts
    const fetchAndCalculateCounts = async () => {
      const { data: guests, error } = await supabase
        .from('guests')
        .select('name, used')
        .eq('event_id', eventId)

      if (error) {
        console.error('Error fetching guests:', error)
        return
      }

      let trc = 0, tac = 0, urc = 0, uac = 0

      guests?.forEach(guest => {
        trc++
        const match = guest.name.match(/\+(\d+)$/)
        if (match) {
          const additionalGuests = parseInt(match[1], 10)
          tac += additionalGuests
          if (guest.used) {
            urc++
            uac += additionalGuests
          }
        } else if (guest.used) {
          urc++
        }
      })

      setTotalRegularCount(trc)
      setTotalAdditionalCount(tac)
      setUsedRegularCount(urc)
      setUsedAdditionalCount(uac)
    }

    // Initial fetch
    fetchAndCalculateCounts()

    // Set up real-time subscription
    const subscription = supabase
      .channel('guests_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'guests', filter: `event_id=eq.${eventId}` },
        () => {
          fetchAndCalculateCounts()
        }
      )
      .subscribe()

    // Cleanup subscription on component unmount
    return () => {
      subscription.unsubscribe()
    }
  }, [eventId, supabase])

  return (
    <div className="container mx-auto p-4">
      <p className="text-lg">
        Total on the list: <span className="font-semibold">{totalRegularCount} + {totalAdditionalCount}</span>
      </p>
      <p className="text-lg">
        Checked in: <span className="font-semibold">{usedRegularCount} + {usedAdditionalCount}</span>
      </p>
    </div>
  )
} 