"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import React from "react"

import { Button } from "@/components/ui/button"
import { DialogClose } from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { toast } from "@/components/ui/use-toast"
import { createClient } from "@/utils/supabase/client"
import type { Tables } from "../../lib/database.types"
import { Switch } from "@/components/ui/switch"

const formSchema = z.object({
  name: z.string().min(2, {
    message: "The name must be at least 2 characters.",
  }),
  type: z.enum(["free", "half", "skip"], {
    required_error: "You need to select guestlist type.",
  }),
})

type GuestDetailsFormProps = {
  guest: Guest | null
  organisation: string
  editedFromLinkId: string | null
  availableListTypes: Set<ListType>
  eventId: string | null
  onOptimisticUpdate?: (guest: Guest) => void
  onOptimisticDelete?: (guestId: string) => void
}

type GuestlistType = "free" | "half" | "skip"

export function GuestDetailsForm({
  guest,
  organisation,
  eventId,
  availableListTypes,
  editedFromLinkId,
  onOptimisticUpdate,
  onOptimisticDelete,
}: GuestDetailsFormProps) {
  const supabase = createClient()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: guest?.name || "",
      type: (guest?.type as GuestlistType) || "",
    },
  })

  const [isUsed, setIsUsed] = React.useState<boolean>(guest?.used ?? false)
  const canCheckIn = editedFromLinkId === null

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { name, type } = values
    if (guest && guest.name === name && guest.type === type && guest.used === isUsed) {
      return
    }

    if (guest) {
      // Optimistic update first
      if (onOptimisticUpdate) {
        onOptimisticUpdate({
          ...guest,
          name,
          type,
          used: isUsed,
        })
      }

      const { data, error } = await supabase
        .from("guests")
        .update({
          name: name,
          type: type,
          ...(canCheckIn ? { used: isUsed } : {}),
        })
        .eq("id", guest.id)
        .select()
    } else {
      if (onOptimisticUpdate) {
        const optimisticGuest: Guest = {
          id: `temp-${Date.now()}`,
          name: name,
          organisation: organisation,
          type: type,
          event_id: eventId || "",
          link_id: editedFromLinkId,
          used: isUsed,
          created_at: new Date().toISOString(),
        }
        onOptimisticUpdate(optimisticGuest)
      }

      const { data, error } = await supabase
        .from("guests")
        .insert([
          {
            name: name,
            organisation: organisation,
            type: type,
            event_id: eventId,
            link_id: editedFromLinkId,
            ...(canCheckIn ? { used: isUsed } : {}),
          },
        ])
        .select()
    }
  }

  async function handleDelete() {
    if (guest) {
      // Check if this is a temporary ID (from optimistic add)
      const isTempId = guest.id.startsWith('temp-')
      
      // Always do optimistic delete first
      if (onOptimisticDelete) {
        onOptimisticDelete(guest.id)
      }

      // Only try database delete if it's a real ID (not temporary)
      if (!isTempId) {
        const { error } = await supabase.from("guests").delete().eq("id", guest.id)
      }
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 max-w-xs"
        autoComplete="off"
        data-1p-ignore
        data-lpignore="true"
        data-form-type="other"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="text-left">
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  value={field.value}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem className="text-left">
              <FormLabel>Type</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value}
                  className="flex flex-col space-y-1"
                >
                  {["free", "half", "skip"].map((type) => (
                    <FormItem
                      key={type}
                      className="flex items-center space-x-3 space-y-0"
                    >
                      <FormControl>
                        <RadioGroupItem
                          value={type}
                          disabled={!availableListTypes.has(type as ListType)}
                        />
                      </FormControl>
                      <FormLabel className="font-normal">{type}</FormLabel>
                    </FormItem>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Check-in switch – only in admin panel (not inside links) */}
        {canCheckIn && (
          <FormItem className="flex items-center justify-between">
            <FormLabel>Checked in</FormLabel>
            <FormControl>
              <Switch checked={isUsed} onCheckedChange={setIsUsed} />
            </FormControl>
          </FormItem>
        )}

        <div className="flex justify-center space-x-4">
          <DialogClose asChild>
            <Button type="submit">Save</Button>
          </DialogClose>
          {guest && (
            <DialogClose asChild>
              <Button 
                variant="outline" 
                onClick={(e) => {
                  handleDelete()
                }}
              >
                Delete
              </Button>
            </DialogClose>
          )}
        </div>
      </form>
    </Form>
  )
}
