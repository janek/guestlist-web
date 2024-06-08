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
import { useEffect } from "react"
import type { Tables } from "../../lib/database.types"

type LinksTableProps = {
  links: Tables<"links">[]
}

const LinksTable = ({ links }: LinksTableProps) => {
  const supabase = createClient()
  const router = useRouter()

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
  return (
    <Table>
      {/* <TableCaption>Guestlist for event {event.name} </TableCaption> */}
      <TableHeader>
        <TableRow>
          <TableHead>Link</TableHead>
          <TableHead>Organisation</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {links.map((link) => (
          // XXX: The table should be customised to enable the whole row being a link
          <TableRow key={link.id}>
            <TableCell>
              <a
                className="block"
                href={link.url_code}
                target="_blank"
                rel="noreferrer"
              >
                {link.url_code}
              </a>
            </TableCell>
            <TableCell>
              <a
                className="block"
                href={link.url_code}
                target="_blank"
                rel="noreferrer"
              >
                {link.organisation}
              </a>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default LinksTable
