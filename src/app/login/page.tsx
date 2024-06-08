"use client";

import { login, signup } from "@/app/login/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(1, { message: "Password must be at least 1 character" }),
});

export default function LoginPage() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    const response = await login(data);
    if (response?.message) {
      setError(response.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen md:bg-gray-100">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="bg-white p-6 rounded md:shadow-md w-full max-w-sm space-y-4 sm:w-full flex flex-col"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email:</FormLabel>
                <FormControl>
                  <Input {...field} type="email" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password:</FormLabel>
                <FormControl>
                  <Input {...field} type="password" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex items-center justify-between pt-2">
            <Button type="submit" className="w-full h-10">
              Log in
            </Button>
          </div>
          <p
            className={`text-xs flex-shrink-0 ${error ? "text-red-500" : "text-gray-500"} h-3`}
          >
            {error
              ? error + ". If you need help, reach out."
              : "If you need an account, please ask us to make you one."}
          </p>
        </form>
      </Form>
    </div>
  );
}
