"use client";

import { login } from "@/app/login/actions";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    setLoading(true);
    setError(null);
    const response = await login(data);
    if (response?.message) {
      setError(response.message);
      setLoading(false);
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
            <Button type="submit" className="w-full h-10" disabled={loading}>
              {loading ? "Logging in..." : "Log in"}
            </Button>
          </div>
          <p
            className={`text-xs flex-shrink-0 ${error ? "text-red-500" : "text-gray-500"} h-3`}
          >
            {error
              ? error + ". If you need help, reach out."
              : "If you need an account, please contact us."}
          </p>
        </form>
      </Form>
    </div>
  );
}
