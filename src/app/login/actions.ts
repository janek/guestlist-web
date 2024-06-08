"use server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

import { createClient } from "@/utils/supabase/server"

type LoginData = {
  email: string
  password: string
}

export async function login(loginData: LoginData) {
  const supabase = createClient()
  const { error } = await supabase.auth.signInWithPassword(loginData)

  if (error) {
    console.error("Login error:", error.message)
    return {
      message:
        error.message === "Invalid login credentials"
          ? "Password or email is incorrect"
          : "An unknown error occurred",
    }
  }

  console.log("Login successful, revalidating path and redirecting.")
  revalidatePath("/", "layout")
  redirect("/")
}

export async function logout() {
  const supabase = createClient()
  const { error } = await supabase.auth.signOut()

  if (error) {
    console.error("Logout error:", error.message)
    return { message: "An error occurred during logout" }
  }

  console.log("Logout successful, revalidating path and redirecting.")
  revalidatePath("/", "layout")
  redirect("/login")
}
// export async function signup(formData: FormData) {
//   const supabase = createClient();

//   // type-casting here for convenience
//   // in practice, you should validate your inputs
//   const data = {
//     email: formData.get("email") as string,
//     password: formData.get("password") as string,
//   };

//   console.log("Signup data:", data);

//   const { error } = await supabase.auth.signUp(data);

//   if (error) {
//     console.error("Signup error:", error);
//     redirect("/error");
//   }

//   console.log("Signup successful, revalidating path and redirecting.");
//   revalidatePath("/", "layout");
//   redirect("/");
// }
