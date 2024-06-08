"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AddLinkForm } from "./AddLinkForm";

import { useState } from "react";

export const AddLinkDialogButton = () => {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Create link</Button>
      </DialogTrigger>
      <DialogContent className="max-w-xs">
        <DialogHeader>
          <DialogTitle className="mb-4">Add guest</DialogTitle>
          {/* <DialogDescription>ABC</DialogDescription> */}
          <AddLinkForm onSubmitFromParent={() => setOpen(false)} />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
