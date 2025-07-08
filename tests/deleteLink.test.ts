// @ts-nocheck
import { expect, test } from "bun:test"
import { rpcDeleteLink } from "../src/utils/supabase/links"

// Link ID provided by user for delete test (could be non-child or child link)
const LINK_ID = "c13cd764-39fd-4884-8118-ece3eec525ff"

const HAS_ENV =
  Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
  Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

if (!HAS_ENV) {
  test("skip delete_link RPC due to missing env", () => {
    expect(true).toBe(true)
  })
  // eslint-disable-next-line no-console
  console.warn(
    "❕ Skipping delete_link RPC test – SUPABASE env vars are not set."
  )
} else {
  test("delete_link RPC deletes link in delete_guests mode", async () => {
    const { error } = await rpcDeleteLink({
      linkId: LINK_ID,
      mode: "delete_guests",
    })

    expect(error).toBeNull()
    // eslint-disable-next-line no-console
    console.log("✅ delete_link succeeded for link", LINK_ID)
  })
} 