"use client"

import { createClient } from "@/utils/supabase/client"
import { useRouter } from "next/navigation"
import React from "react"

export const LogoutButton = () => {
  const supabase = createClient()
  const router = useRouter()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.replace("/login")
  }

  return (
    <button
      onClick={handleLogout}
      className="underline cursor-pointer not-italic text-gray-500 hover:text-gray-900"
      type="button"
    >
      Log out
    </button>
  )
}
