"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";

export async function login(formData: FormData) {
  const supabase = createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  console.log("Login data:", data);

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    console.error("Login error:", error);
    redirect("/error");
  }

  console.log("Login successful, revalidating path and redirecting.");
  revalidatePath("/", "layout");
  redirect("/private");
}

export async function signup(formData: FormData) {
  const supabase = createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  console.log("Signup data:", data);

  const { error } = await supabase.auth.signUp(data);

  if (error) {
    console.error("Signup error:", error);
    redirect("/error");
  }

  console.log("Signup successful, revalidating path and redirecting.");
  revalidatePath("/", "layout");
  redirect("/");
}

export async function logout() {
  const supabase = createClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error("Logout error:", error);
    redirect("/error");
  }

  console.log("Logout successful, revalidating path and redirecting.");
  revalidatePath("/", "layout");
  redirect("/login");
}
