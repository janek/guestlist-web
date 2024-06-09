"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { createClient } from "@/utils/supabase/client"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import type { Tables } from "../../lib/database.types"
import { GuestDetailsDialog } from "./GuestDetailsDialog"

type GuestlistTableProps = {
  link: Link
  guests: Guest[]
  shouldShowOrganization: boolean
}

const GuestlistTable = ({
  link,
  guests,
  shouldShowOrganization,
}: GuestlistTableProps) => {
  const supabase = createClient()
  const router = useRouter()
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  useEffect(() => {
    const channel = supabase
      .channel("realtime guests")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "guests",
        },
        (payload) => {
          console.log("Guests Payload")
          router.refresh()
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase, router])

  const handleRowClick = (guest: Guest) => {
    setSelectedGuest(guest)
    setDialogOpen(true)
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            {shouldShowOrganization && <TableHead>Organization</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {guests.map((guest) => (
            <TableRow
              key={guest.id}
              style={{
                textDecoration: guest.used ? "line-through" : "none",
                color: guest.used ? "gray" : "black",
              }}
              onClick={() => handleRowClick(guest)}
            >
              <TableCell>{guest.name}</TableCell>
              <TableCell>{guest.type}</TableCell>
              {shouldShowOrganization && (
                <TableCell>{guest.organisation}</TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <GuestDetailsDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        editingGuest={selectedGuest} // null at first, set to the selected guest when a row is clicked
        addGuestButtonHidden={true}
        link={link}
        currentGuestlist={guests}
      />
    </>
  )
}

export default GuestlistTable
