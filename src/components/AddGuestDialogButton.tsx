import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AddGuestForm } from "./AddGuestForm";

export const AddGuestDialogButton = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Add guest</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add guest</DialogTitle>
          {/* <DialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DialogDescription> */}
          <AddGuestForm />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
