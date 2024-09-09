import { Button } from "./ui/button"

interface AddEventButtonProps {
  onClick: () => void
}

export function AddEventButton({ onClick }: AddEventButtonProps) {
  return (
    <Button onClick={onClick} variant="outline" size="sm">
      Add Event
    </Button>
  )
}
