"use client"
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

import { useState } from "react";

const wait = () => new Promise((resolve) => setTimeout(resolve, 1000));

export const AddGuestDialogButton = () => {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Add guest</Button>
      </DialogTrigger>
      <DialogContent className="max-w-xs">
        <DialogHeader>
          <DialogTitle className="mb-4">Add guest</DialogTitle>
          {/* <DialogDescription>ABC</DialogDescription> */}
          <AddGuestForm
            onSubmitFromParent={() => setOpen(false)}
          />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
