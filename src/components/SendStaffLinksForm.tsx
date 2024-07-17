"use client"

import { useToast } from "@/components/ui/use-toast"
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
import { createClient } from "@/utils/supabase/client"
import LimitInputField from "./LimitInputField"

const formSchema = z.object({
  limit_free: z.number().min(0).nullable(),
  limit_half: z.number().min(0).nullable(),
  limit_skip: z.number().min(0).nullable(),
})

type AddLinkFormProps = {
  onSubmitFromParent: () => void
  eventId: string
}

export function SendStaffLinksForm({ onSubmitFromParent, eventId }: AddLinkFormProps) {
  const supabase = createClient()
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      limit_free: 0,
      limit_half: 0,
      limit_skip: 0,
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const {  limit_free, limit_half, limit_skip } = values

    const { data, error } = await supabase
      .from("links")
      .insert([
        {
          event_id: eventId,
          limit_free: limit_free || 0,
          limit_half: limit_half || 0,
          limit_skip: limit_skip || 0,
        },
      ])
      .select()
    if (error) {
      toast({
        variant: "destructive",
        title: "Error when creating link",
        description: `Backend says: ${error.message}`,
      })
      throw error
    }

    onSubmitFromParent()
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8  max-w-xs"
      >
       
        <div className="flex space-x-4">
          <LimitInputField
            control={form.control}
            name="limit_free"
            label="Free"
          />
          <LimitInputField
            control={form.control}
            name="limit_half"
            label="Half"
          />
          <LimitInputField
            control={form.control}
            name="limit_skip"
            label="Skip"
          />
        </div>
        <Button type="submit">Send</Button>
      </form>
    </Form>
  )
}
