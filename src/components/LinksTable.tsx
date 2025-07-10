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
import { useEffect, useState } from "react"
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

  // Sort links so newest (latest created_at) appear first
  const sortedLinks = [...links].sort((a, b) => {
    const aTime = a.created_at ? new Date(a.created_at).getTime() : 0
    const bTime = b.created_at ? new Date(b.created_at).getTime() : 0
    return bTime - aTime
  })

  return (
    <>
      <Table>
        {/* <TableCaption>Guestlist for event {event.name} </TableCaption> */}
        <TableHeader>
          <TableRow>
            <TableHead>Organisation</TableHead>
            <TableHead>Limits</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedLinks.map((link) => (
            <TableRow
              key={link.id}
              onClick={() => handleRowClick(link)}
              className="cursor-pointer"
            >
              <TableCell>{link.organisation}</TableCell>
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
