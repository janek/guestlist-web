// @ts-nocheck
import { expect, test } from "bun:test";
import { rpcSplitLink, rpcDeleteLink } from "../src/utils/supabase/links";
import { createClient } from "../src/utils/supabase/client";

const EVENT_ID = "b9d55ca0-5a67-40cb-992a-8621f00e36bc";

const HAS_ENV =
  Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
  Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

if (!HAS_ENV) {
  test("skip link flow tests due to missing env", () => {
    expect(true).toBe(true);
  });
  // eslint-disable-next-line no-console
  console.warn("❕ Skipping link flow tests – SUPABASE env vars are not set.");
} else {
  const supabase = createClient();

  async function getLink(id: string) {
    const { data } = await supabase
      .from("links")
      .select("*")
      .eq("id", id)
      .single();
    return data;
  }

  test("end-to-end split & delete flow", async () => {
    // 1. create root link for the event
    const { data: root, error: insErr } = await supabase
      .from("links")
      .insert({
        event_id: EVENT_ID,
        organisation: "Test Root",
        limit_free: 10,
        limit_half: 10,
        limit_skip: 10,
        depth: 0,
      })
      .select("*")
      .single();

    expect(insErr).toBeNull();
    expect(root).toBeDefined();

    const rootId = root!.id as string;
    console.log("👉 Created root", root);

    // 2. split the root link
    const { data: child, error: splitErr } = await rpcSplitLink({
      parentId: rootId,
      org: "Child Org",
      free: 3,
      half: 2,
      skip: 1,
    });

    console.log("👉 split response", { child, splitErr });
    expect(splitErr).toBeNull();
    expect(child).toBeDefined();
    expect(child!.parent_link_id).toBe(rootId);
    expect(child!.depth).toBe(1);

    // wait 2 seconds
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // 3. verify parent quotas decreased
    let parentAfterSplit = await getLink(rootId);
    expect(parentAfterSplit.limit_free).toBe(7);
    expect(parentAfterSplit.limit_half).toBe(8);
    expect(parentAfterSplit.limit_skip).toBe(9);

    console.log('child.id', child!.id, 'parent', child!.parent_link_id);
    const linkRow = await getLink(child!.id as string);
    console.log('db limits on child row', linkRow.limit_free, linkRow.limit_half, linkRow.limit_skip);

    // 4. delete the child link (guests delete mode)
    const { error: delErr } = await rpcDeleteLink({
      linkId: child!.id as string,
      mode: "delete_guests",
    });
    console.log("👉 delete response", delErr);
    expect(delErr).toBeNull();

    // 5. verify parent quotas restored
    parentAfterSplit = await getLink(rootId);
    console.log("parent after delete", parentAfterSplit);
    expect(parentAfterSplit.limit_free).toBe(10);
    expect(parentAfterSplit.limit_half).toBe(10);
    expect(parentAfterSplit.limit_skip).toBe(10);

    // 6. cleanup – delete root link
    const { error: cleanupErr } = await rpcDeleteLink({
      linkId: rootId,
      mode: "delete_guests",
    });
    expect(cleanupErr).toBeNull();
  });
}
