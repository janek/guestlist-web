"use client"

import { logout } from "@/app/login/actions" // Ensure the path is correct
import { Button } from "@/components/ui/button"
import React from "react"

export const LogoutButton = () => {
  const handleLogout = async () => {
    await logout()
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
