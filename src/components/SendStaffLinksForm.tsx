"use client"

import { sendStaffLinks } from "@/app/actions/send-staff-links"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import LimitInputField from "./LimitInputField"

const formSchema = z.object({
  limit_free: z.number().min(0),
  limit_half: z.number().min(0),
  limit_skip: z.number().min(0),
})

type SendStaffLinksFormProps = {
  onSubmitFromParent: () => void
  staff?: Staff[]
  event: GuestlistEvent
}

export function SendStaffLinksForm({
  onSubmitFromParent,
  staff,
  event,
}: SendStaffLinksFormProps) {
  console.log("Event2:", event)
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      limit_free: 0,
      limit_half: 0,
      limit_skip: 0,
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { limit_free, limit_half, limit_skip } = values
    console.log("Sending staff links for event:", event)
    await sendStaffLinks(limit_free, limit_half, limit_skip, event)
    onSubmitFromParent()
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8  max-w-xs"
        autoComplete="off"
        data-1p-ignore
        data-lpignore="true"
        data-form-type="other"
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
