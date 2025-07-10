"use client"

import {
  Table,
  TableBody,
  // TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { createClient } from "@/utils/supabase/client"
import { useRouter } from "next/navigation"
import { useEffect, useState, useMemo } from "react"
import type { Tables } from "../../lib/database.types"
import { LinkDetailsDialog } from "./LinkDetailsDialog"

type LinksTableProps = {
  links: Tables<"links">[]
}

const LinksTable = ({ links }: LinksTableProps) => {
  const supabase = createClient()
  const router = useRouter()
  const [selectedLink, setSelectedLink] = useState<Tables<"links"> | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  // Sorting state: null = default reverse chrono
  const [sortColumn, setSortColumn] = useState<"organisation" | "limits" | null>(null)

  const toggleSort = (column: "organisation" | "limits") => {
    setSortColumn((prev) => (prev === column ? null : column))
  }

  useEffect(() => {
    const channel = supabase
      .channel("realtime links")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "links",
        },
        (payload) => {
          console.log("Links Payload")
          router.refresh()
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase, router])

  const handleRowClick = (link: Tables<"links">) => {
    setSelectedLink(link)
    setDialogOpen(true)
  }

  // Derive sorted links per column selection
  const sortedLinks = useMemo(() => {
    const clone = [...links]

    if (sortColumn === "organisation") {
      clone.sort((a, b) => a.organisation.localeCompare(b.organisation))
    } else if (sortColumn === "limits") {
      const points = (l: Tables<"links">) => l.limit_skip + l.limit_half * 0.5
      clone.sort((a, b) => points(b) - points(a)) // Descending
    } else {
      // Default reverse chronological by created_at
      clone.sort((a, b) => {
        const aTime = a.created_at ? new Date(a.created_at).getTime() : 0
        const bTime = b.created_at ? new Date(b.created_at).getTime() : 0
        return bTime - aTime
      })
    }
    return clone
  }, [links, sortColumn])

  return (
    <>
      <Table>
        {/* <TableCaption>Guestlist for event {event.name} </TableCaption> */}
        <TableHeader>
          <TableRow>
            <TableHead
              className="cursor-pointer select-none"
              onClick={() => toggleSort("organisation")}
            >
              Organisation {sortColumn === "organisation" && "▲"}
            </TableHead>
            <TableHead
              className="cursor-pointer select-none"
              onClick={() => toggleSort("limits")}
            >
              Limits {sortColumn === "limits" && "▲"}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedLinks.map((link) => (
            <TableRow
              key={link.id}
              onClick={() => handleRowClick(link)}
              className="cursor-pointer"
            >
              <TableCell className="truncate whitespace-nowrap max-w-[160px]">
                {link.organisation}
              </TableCell>
              <TableCell>
                {link.limit_free}-{link.limit_half}-{link.limit_skip}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <LinkDetailsDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        link={selectedLink}
      />
    </>
  )
}

export default LinksTable
