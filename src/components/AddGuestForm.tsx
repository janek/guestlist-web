"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "@/components/ui/use-toast";
import { createBrowserClient } from "@supabase/ssr";

const formSchema = z.object({
  name: z.string().min(3, {
    message: "The name must be at least 3 characters.",
  }),
  type: z.enum(["free", "half", "skip"], {
    required_error: "You need to select guestlist type.",
  }),
});

// props are a handler to run w when the form is submitted
type AddGuestFormProps = {
    onSubmitFromParent: () => void;
    organisationName: string;
};

export function AddGuestForm({ onSubmitFromParent, organisationName }: AddGuestFormProps) {
  const supabase = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      type: "free",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
    const { name, type } = values;

    const { data, error } = await supabase
      .from("guests")
      .insert([{ name: name, organisation: organisationName, type: type }])
      .select();
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
              {" "}
              {/* Align title to the left */}
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              {/* <FormDescription>
                This is the name as it will appear on the guestlist.
              </FormDescription> */}
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
                  defaultValue={field.value}
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
              {/* <FormDescription>
                "Free" guests pay nothing for entry, "Half" pay half, "Skip" pay the full price but can skip the line.
              </FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
