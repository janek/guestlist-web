"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

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
  eventId: string
}

type GuestlistType = "free" | "half" | "skip"

export function GuestDetailsForm({
  guest,
  organisation,
  eventId,
  availableListTypes,
  editedFromLinkId,
}: GuestDetailsFormProps) {
  console.log(
    `In GDF, availableListTypes: ${JSON.stringify(
      Array.from(availableListTypes),
    )}`,
  )
  const supabase = createClient()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: guest?.name || "",
      type: (guest?.type as GuestlistType) || "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { name, type } = values
    if (guest && guest.name === name && guest.type === type) {
      return
    }

    if (guest) {
      const { data, error } = await supabase
        .from("guests")
        .update({
          name: name,
          type: type,
        })
        .eq("id", guest.id)
        .select()
      console.log(data, error)
    } else {
      const { data, error } = await supabase
        .from("guests")
        .insert([
          {
            name: name,
            organisation: organisation,
            type: type,
            event_id: eventId,
            link_id: editedFromLinkId,
          },
        ])
        .select()
      console.log(data, error)
    }
  }

  async function handleDelete() {
    if (guest) {
      const response = await supabase.from("guests").delete().eq("id", guest.id)
      console.log(response)
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 max-w-xs"
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

        <div className="flex justify-center space-x-4">
          <DialogClose asChild>
            <Button type="submit">Save</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button variant="outline" onClick={handleDelete}>
              Delete
            </Button>
          </DialogClose>
        </div>
      </form>
    </Form>
  )
}
