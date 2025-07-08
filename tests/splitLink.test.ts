// @ts-nocheck
import { expect, test } from "bun:test"
import { rpcSplitLink } from "../src/utils/supabase/links"

// Parent link id provided by user for temporary testing
const PARENT_ID = "06c9c4a8-c484-4ccb-8462-fdbb0dc498d4"

const HAS_ENV =
  Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
  Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

if (!HAS_ENV) {
  test("skip split_link RPC due to missing env", () => {
    expect(true).toBe(true)
  })
  // eslint-disable-next-line no-console
  console.warn(
    "❕ Skipping split_link RPC test – SUPABASE env vars are not set."
  )
} else {
  test("split_link RPC creates a child link", async () => {
    const { data, error } = await rpcSplitLink({
      parentId: PARENT_ID,
      org: "Test Child",
      free: 2,
      half: 0,
      skip: 0,
    })

    expect(error).toBeNull()
    expect(data).toBeDefined()
    expect(data?.slug).toBeTruthy()
    // eslint-disable-next-line no-console
    console.log("✅ split_link returned child slug:", data?.slug)
  })
} 