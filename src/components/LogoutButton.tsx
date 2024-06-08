"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { logout } from "@/app/login/actions"; // Ensure the path is correct

export const LogoutButton = () => {
  const handleLogout = async () => {
    await logout();
  };

  return (
    <a
      onClick={handleLogout}
      className="underline cursor-pointer not-italic text-gray-500 hover:text-gray-900"
    >
      Log out
    </a>
  );
};
