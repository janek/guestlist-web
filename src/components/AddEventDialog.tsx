import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { useState } from "react"

interface AddEventDialogProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (eventData: { name: string, date: string }) => Promise<void>
}

export function AddEventDialog({ isOpen, onClose, onSubmit }: AddEventDialogProps) {
  const [name, setName] = useState("")
  const [date, setDate] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit({ name, date })
    setName("")
    setDate("")
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Event</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Event Name"
          />
          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <Button type="submit">Add Event</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
