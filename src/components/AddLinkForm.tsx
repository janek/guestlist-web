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
import { createClient } from "@/utils/supabase/client"

const formSchema = z.object({
  slug: z.string().min(3, {
    message: "The link must be at least 3 characters.",
  }),
  organisation: z.string().min(2, {
    message: "The org name must be at least 2 characters.",
  }),
  limit_free: z.number().min(0).nullable(),
  limit_half: z.number().min(0).nullable(),
  limit_skip: z.number().min(0).nullable(),
})

// props are a handler to run w when the form is submitted
type AddLinkFormProps = {
  onSubmitFromParent: () => void
}

export function AddLinkForm({ onSubmitFromParent }: AddLinkFormProps) {
  const supabase = createClient()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      slug: "",
      organisation: "",
      limit_free: null,
      limit_half: null,
      limit_skip: null,
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { slug, organisation, limit_free, limit_half, limit_skip } = values

    const { data, error } = await supabase
      .from("links")
      .insert([{ 
        slug, 
        organisation, 
        limit_free: limit_free || null,
        limit_half: limit_half || null,
        limit_skip: limit_skip || null
      }])
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
          name="slug"
          render={({ field }) => (
            <FormItem className="text-left">
              <FormLabel>Slug</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>
                This will create the link, e.g. guestlist.berlin/slug
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="organisation"
          render={({ field }) => (
            <FormItem className="text-left">
              <FormLabel>Organization Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>
                For example: DJ Transparency, Sweet Collective{" "}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex space-x-4">
          <FormField
            control={form.control}
            name="limit_free"
            render={({ field }) => (
              <FormItem className="text-left">
                <FormLabel>Free Limit</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    {...field} 
                    onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : null)}
                    className="w-20"
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
                <FormLabel>Half Limit</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    {...field} 
                    onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : null)}
                    className="w-20"
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
                <FormLabel>Skip Limit</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    {...field} 
                    onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : null)}
                    className="w-20"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}
