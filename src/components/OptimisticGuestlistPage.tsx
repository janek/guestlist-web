"use client"

import { useState, useCallback } from "react"
import { GuestDetailsDialog } from "@/components/GuestDetailsDialog"
import GuestlistTable from "@/components/GuestlistTable"
import { ScrollArea } from "@/components/ui/scroll-area"

type OptimisticGuestlistPageProps = {
  initialGuests: Guest[]
  link: Link
  organisationName: string
  usedCounts: {
    used_free: number
    used_half: number
    used_skip: number
  }
  eventName: string
  eventDate: string
}

export function OptimisticGuestlistPage({
  initialGuests,
  link,
  organisationName,
  usedCounts,
  eventName,
  eventDate,
}: OptimisticGuestlistPageProps) {
  // Local state for optimistic updates
  const [guests, setGuests] = useState<Guest[]>(initialGuests)
  const [optimisticCounts, setOptimisticCounts] = useState(usedCounts)

  // Optimistic update handler for adding guests
  const handleOptimisticGuestAdd = useCallback((newGuest: Guest) => {
    setGuests(prevGuests => [...prevGuests, newGuest])
    
    // Update counts optimistically
    setOptimisticCounts(prevCounts => ({
      ...prevCounts,
      [`used_${newGuest.type}`]: prevCounts[`used_${newGuest.type}` as keyof typeof prevCounts] + 1
    }))
  }, [])

  // Optimistic delete handler for removing guests
  const handleOptimisticGuestDelete = useCallback((guestId: string) => {
    console.log("🔄 handleOptimisticGuestDelete called with ID:", guestId)
    setGuests(prevGuests => {
      console.log("🔄 Current guests before delete:", prevGuests.length)
      const guestToDelete = prevGuests.find(g => g.id === guestId)
      console.log("🔄 Guest found for deletion:", guestToDelete)
      
      if (!guestToDelete) {
        console.log("🔄 ERROR: Guest not found in list!")
        return prevGuests
      }
      
      // Update counts optimistically
      setOptimisticCounts(prevCounts => {
        console.log("🔄 Updating counts, removing 1 from:", guestToDelete.type)
        const newCounts = {
          ...prevCounts,
          [`used_${guestToDelete.type}`]: Math.max(0, prevCounts[`used_${guestToDelete.type}` as keyof typeof prevCounts] - 1)
        }
        console.log("🔄 New counts:", newCounts)
        return newCounts
      })
      
      // Remove the guest from the list
      const newGuestList = prevGuests.filter(g => g.id !== guestId)
      console.log("🔄 New guest list length:", newGuestList.length)
      return newGuestList
    })
  }, [])

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h4 className="scroll-m-20 text-2xl mb-2 font-semibold tracking-tight text-left">
        {eventName}
      </h4>
      {eventDate && (
        <h5 className="scroll-m-20 text-lg mb-4 font-normal tracking-tight text-left italic">
          {`${new Date(eventDate).toLocaleDateString("de-DE")}, TXL Airport`}
        </h5>
      )}
      <p className="scroll-m-20 text-md mb-4 font-normal tracking-tight text-left">
        Guestlist for {organisationName}
      </p>
      <p className="scroll-m-20 text-md mb-4 font-normal tracking-tight text-left">
        {link.limit_free > 0 && `Free: ${optimisticCounts.used_free}/${link.limit_free} used`}
        {link.limit_free > 0 && link.limit_half > 0 && ', '}
        {link.limit_half > 0 && `Half: ${optimisticCounts.used_half}/${link.limit_half} used`}
        {(link.limit_free > 0 || link.limit_half > 0) && link.limit_skip > 0 && ', '}
        {link.limit_skip > 0 && `Skip: ${optimisticCounts.used_skip}/${link.limit_skip} used`}
      </p>
      <ScrollArea className="h-[270px] w-[350px] rounded-md border p-4 mb-4">
        <GuestlistTable
          guests={guests}
          link={link}
          shouldShowOrganization={false}
          onOptimisticUpdate={handleOptimisticGuestAdd}
          onOptimisticDelete={handleOptimisticGuestDelete}
        />
      </ScrollArea>
      <GuestDetailsDialog
        organisation={organisationName}
        link={link}
        currentGuestlist={guests}
        editedFromLinkId={link.id}
        onOptimisticUpdate={handleOptimisticGuestAdd}
        onOptimisticDelete={handleOptimisticGuestDelete}
      />
    </div>
  )
} 