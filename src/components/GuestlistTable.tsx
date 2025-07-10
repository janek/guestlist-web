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
import { useEffect, useState, useMemo } from "react"
import type { Tables } from "../../lib/database.types"
import { GuestDetailsDialog } from "./GuestDetailsDialog"

type GuestlistTableProps = {
  link?: Link
  guests: Guest[]
  shouldShowOrganization: boolean
  onOptimisticUpdate?: (guest: Guest) => void
  onOptimisticDelete?: (guestId: string) => void
}

const GuestlistTable = ({
  link,
  guests,
  shouldShowOrganization,
  onOptimisticUpdate,
  onOptimisticDelete,
}: GuestlistTableProps) => {
  const supabase = createClient()
  const router = useRouter()
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  // Currently applied sort column. null = default reverse chrono
  const [sortColumn, setSortColumn] = useState<
    "name" | "type" | "organisation" | null
  >(null)

  const toggleSort = (column: "name" | "type" | "organisation") => {
    setSortColumn((prev) => (prev === column ? null : column))
  }

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
          console.log("Guests Payload", payload)
          // If caller did not provide optimistic handlers, fall back to
          // a simple router.refresh() so UI stays in sync across tabs.
          if (!onOptimisticUpdate && !onOptimisticDelete) {
            router.refresh()
          }
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

  // Derive sorted list based on selected column (memoized for perf)
  const sortedGuests = useMemo(() => {
    const clone = [...guests]

    if (sortColumn) {
      clone.sort((a, b) => {
        const aVal = ((a as any)[sortColumn] || "").toString().toLowerCase()
        const bVal = ((b as any)[sortColumn] || "").toString().toLowerCase()
        return aVal.localeCompare(bVal)
      })
    } else {
      // Default: reverse chronological (newest first)
      clone.sort((a, b) => {
        const aTime = a.created_at ? new Date(a.created_at).getTime() : 0
        const bTime = b.created_at ? new Date(b.created_at).getTime() : 0
        return bTime - aTime
      })
    }
    return clone
  }, [guests, sortColumn])
  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead
              className="cursor-pointer select-none min-w-[150px]"
              onClick={() => toggleSort("name")}
            >
              Name {sortColumn === "name" && "▲"}
            </TableHead>
            <TableHead
              className="cursor-pointer select-none min-w-[70px]"
              onClick={() => toggleSort("type")}
            >
              Type {sortColumn === "type" && "▲"}
            </TableHead>
            {shouldShowOrganization && (
              <TableHead
                className="cursor-pointer select-none min-w-[150px]"
                onClick={() => toggleSort("organisation")}
              >
                Organization {sortColumn === "organisation" && "▲"}
              </TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedGuests.map((guest) => (
            <TableRow
              key={guest.id}
              style={{
                textDecoration: guest.used ? "line-through" : "none",
                color: guest.used ? "gray" : "black",
              }}
              onClick={() => handleRowClick(guest)}
            >
              <TableCell className="max-w-[160px] truncate whitespace-nowrap">
                {guest.name}
              </TableCell>
              <TableCell className="min-w-[70px]">{guest.type}</TableCell>
              {shouldShowOrganization && (
                <TableCell className="min-w-[100px] truncate whitespace-nowrap">
                  {guest.organisation}
                </TableCell>
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
        editedFromLinkId={link?.id ?? null}
        currentGuestlist={sortedGuests}
        onOptimisticUpdate={onOptimisticUpdate}
        onOptimisticDelete={onOptimisticDelete}
      />
    </>
  )
}

export default GuestlistTable
