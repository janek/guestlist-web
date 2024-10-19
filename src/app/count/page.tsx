import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default async function GuestCount() {
  // Fetch all guests for the specific event
  const { data: guests, error } = await supabase
    .from('guests')
    .select('name, used')
    .eq('event_id', 'bf2ad656-6e72-4edc-be7d-0ce6b14de7ff')

  if (error) {
    console.error('Error fetching guests:', error)
    return <div>Error loading guest count</div>
  }

  let totalRegularCount = 0
  let totalAdditionalCount = 0
  let usedRegularCount = 0
  let usedAdditionalCount = 0

  guests?.forEach(guest => {
    totalRegularCount++
    const match = guest.name.match(/\+(\d+)$/)
    if (match) {
      const additionalGuests = parseInt(match[1], 10)
      totalAdditionalCount += additionalGuests
      if (guest.used) {
        usedRegularCount++
        usedAdditionalCount += additionalGuests
      }
    } else if (guest.used) {
      usedRegularCount++
    }
  })

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
