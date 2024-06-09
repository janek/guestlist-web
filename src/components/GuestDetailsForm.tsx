"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
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
  name: z.string().min(3, {
    message: "The name must be at least 3 characters.",
  }),
  type: z.enum(["free", "half", "skip"], {
    required_error: "You need to select guestlist type.",
  }),
})

type GuestDetailsFormProps = {
  onSubmitFromParent: () => void
  guest: Tables<"guests"> | null
  organisation: string
}

export function GuestDetailsForm({
  onSubmitFromParent,
  guest,
  organisation,
}: GuestDetailsFormProps) {
  const supabase = createClient()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      type: "free",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { name, type } = values

    const { data, error } = await supabase
      .from("guests")
      .insert([{ name: name, organisation: organisation, type: type }])
      .select()
    console.log(data, error)

    onSubmitFromParent()
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8  max-w-xs"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="text-left">
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} value={field.value || guest?.name || ""} />
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
                  defaultValue={guest?.type || field.value}
                  className="flex flex-col space-y-1"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="free" />
                    </FormControl>
                    <FormLabel className="font-normal">Free</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="half" />
                    </FormControl>
                    <FormLabel className="font-normal">Half</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="skip" />
                    </FormControl>
                    <FormLabel className="font-normal">Skip</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}
