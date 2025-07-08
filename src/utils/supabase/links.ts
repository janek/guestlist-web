import { createClient as createBrowserClientWrapper } from "./client"
import { type SupabaseClient } from "@supabase/supabase-js"
import type { Database } from "../../../lib/database.types"

let cached: SupabaseClient<Database> | null = null

function getClient(): SupabaseClient<Database> {
  if (!cached) {
    cached = createBrowserClientWrapper() as SupabaseClient<Database>
  }
  return cached
}

type SplitLinkParams = {
  parentId: string
  org: string
  free: number
  half: number
  skip: number
}

export async function rpcSplitLink({
  parentId,
  org,
  free,
  half,
  skip,
}: SplitLinkParams) {
  return getClient().rpc("split_link", {
    p_parent_id: parentId,
    p_org: org,
    p_free: free,
    p_half: half,
    p_skip: skip,
  })
}

type DeleteLinkParams = {
  linkId: string
  mode: "delete_guests" | "pull_up"
}

export async function rpcDeleteLink({ linkId, mode }: DeleteLinkParams) {
  return getClient().rpc("delete_link", {
    p_link_id: linkId,
    p_mode: mode,
  })
} 