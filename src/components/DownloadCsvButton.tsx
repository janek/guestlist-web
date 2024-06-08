"use client"
import { Button } from "@/components/ui/button"

type Guest = Database["public"]["Tables"]["guests"]["Row"]

export function DownloadCsvButton({ guests }: { guests: Guest[] }) {
  const downloadGuests = async (guests: Guest[]) => {
    const csv = guests
      .map((guest) => `${guest.name},${guest.type},${guest.organisation}`)
      .join("\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "guests.csv"
    a.click()
  }

  return (
    <Button variant="outline" onClick={() => downloadGuests(guests || [])}>
      Download CSV
    </Button>
  )
}
