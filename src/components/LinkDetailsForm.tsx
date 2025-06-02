"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { DialogClose } from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { createClient } from "@/utils/supabase/client"
import { ExternalLinkIcon } from "@radix-ui/react-icons"
import type { Tables } from "../../lib/database.types"

const formSchema = z.object({
  organisation: z.string().min(2, {
    message: "The organization name must be at least 2 characters.",
  }),
  limit_free: z.number().min(0),
  limit_half: z.number().min(0),
  limit_skip: z.number().min(0),
})

type LinkDetailsFormProps = {
  link: Tables<"links">
}

export function LinkDetailsForm({ link }: LinkDetailsFormProps) {
  const supabase = createClient()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      organisation: link.organisation || "",
      limit_free: link.limit_free || 0,
      limit_half: link.limit_half || 0,
      limit_skip: link.limit_skip || 0,
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { organisation, limit_free, limit_half, limit_skip } = values
    
    // Check if any values have changed
    if (
      link.organisation === organisation &&
      link.limit_free === limit_free &&
      link.limit_half === limit_half &&
      link.limit_skip === limit_skip
    ) {
      return
    }

    const { data, error } = await supabase
      .from("links")
      .update({
        organisation: organisation,
        limit_free: limit_free,
        limit_half: limit_half,
        limit_skip: limit_skip,
      })
      .eq("id", link.id)
      .select()
    
    if (error) {
      console.error("Error updating link:", error)
    } else {
      console.log("Link updated:", data)
    }
  }

  async function handleDelete() {
    const response = await supabase.from("links").delete().eq("id", link.id)
    console.log("Delete response:", response)
  }

  function handleOpenLink() {
    window.open(link.slug, "_blank", "noopener,noreferrer")
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 max-w-xs"
      >
        <FormField
          control={form.control}
          name="organisation"
          render={({ field }) => (
            <FormItem className="text-left">
              <FormLabel>Organization</FormLabel>
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

        <div className="space-y-4">
          <FormLabel>Limits</FormLabel>
          <div className="grid grid-cols-3 gap-2">
            <FormField
              control={form.control}
              name="limit_free"
              render={({ field }) => (
                <FormItem className="text-left">
                  <FormLabel className="text-xs">Free</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      value={field.value}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="limit_half"
              render={({ field }) => (
                <FormItem className="text-left">
                  <FormLabel className="text-xs">Half</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      value={field.value}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="limit_skip"
              render={({ field }) => (
                <FormItem className="text-left">
                  <FormLabel className="text-xs">Skip</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      value={field.value}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="flex flex-col space-y-2">
          <Button 
            type="button" 
            variant="outline" 
            onClick={handleOpenLink}
            className="flex items-center gap-2"
          >
            <ExternalLinkIcon className="h-4 w-4" />
            Open Link
          </Button>
          
          <div className="flex justify-center space-x-4">
            <DialogClose asChild>
              <Button type="submit">Save</Button>
            </DialogClose>
            <DialogClose asChild>
              <Button variant="destructive" onClick={handleDelete}>
                Delete
              </Button>
            </DialogClose>
          </div>
        </div>
      </form>
    </Form>
  )
} 