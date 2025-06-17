#!/usr/bin/env bun

import { createClient } from "@supabase/supabase-js"
import { randomUUID } from "node:crypto"

/**
 * Script: createUser
 * Purpose: Hard-code creation of a new Supabase user via the Admin API.
 *
 * Environment variables required:
 *   - NEXT_PUBLIC_SUPABASE_URL: The project URL (already used in the app)
 *   - SUPABASE_SERVICE_ROLE_KEY: The service-role key (must be kept secret!)
 *
 * Usage:
 *   bun run scripts/createUser.ts
 *
 * Note: Adjust the `email` constant below as needed before running.
 */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceRoleKey) {
  console.error(
    "Both NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set as env vars."
  )
  process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

// Expect: bun run create-user <email> <password>

const [email, password] = process.argv.slice(2)

if (!email || !password) {
  console.error("Usage: bun run create-user <email> <password>")
  process.exit(1)
}

async function main() {
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true, // Skip verification email
  })

  if (error) {
    console.error("Error creating user:", error)
    process.exit(1)
  }

  console.log("User created successfully:\n", JSON.stringify(data, null, 2))
  console.log("Password used:", password)
}

main() 