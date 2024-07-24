"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
} from "@/components/ui/form"
import LimitInputField from "./LimitInputField"
import { sendOutStaffLinks } from "@/utils/telegram"


const formSchema = z.object({
  limit_free: z.number().min(0),
  limit_half: z.number().min(0),
  limit_skip: z.number().min(0),
})

type AddLinkFormProps = {
  onSubmitFromParent: () => void
  eventId: string
  staff?: Staff[]
}

export function SendStaffLinksForm({ onSubmitFromParent, eventId, staff }: AddLinkFormProps) {

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
    const currentUrl = window.location.origin;
    sendOutStaffLinks(limit_free, limit_half, limit_skip, eventId, currentUrl) 
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
