'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function GuestCount() {
  const [totalRegularCount, setTotalRegularCount] = useState(0)
  const [totalAdditionalCount, setTotalAdditionalCount] = useState(0)
  const [usedRegularCount, setUsedRegularCount] = useState(0)
  const [usedAdditionalCount, setUsedAdditionalCount] = useState(0)

  useEffect(() => {
    // Function to fetch and calculate counts
    const fetchAndCalculateCounts = async () => {
      const { data: guests, error } = await supabase
        .from('guests')
        .select('name, used')
        .eq('event_id', 'bf2ad656-6e72-4edc-be7d-0ce6b14de7ff')

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
        { event: '*', schema: 'public', table: 'guests', filter: `event_id=eq.bf2ad656-6e72-4edc-be7d-0ce6b14de7ff` },
        () => {
          fetchAndCalculateCounts()
        }
      )
      .subscribe()

    // Cleanup subscription on component unmount
    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return (
    <div className="container mx-auto p-4">
      <p className="text-lg">
        Total slots: <span className="font-semibold">{totalRegularCount} + {totalAdditionalCount}</span>
      </p>
      <p className="text-lg">
        Used slots: <span className="font-semibold">{usedRegularCount} + {usedAdditionalCount}</span>
      </p>
    </div>
  )
}
