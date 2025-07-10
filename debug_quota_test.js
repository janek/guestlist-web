// Simple test to debug the quota restoration issue
import { createClient } from "./src/utils/supabase/client.js";

const EVENT_ID = "b9d55ca0-5a67-40cb-992a-8621f00e36bc";

async function debugQuotaIssue() {
  const supabase = createClient();
  
  console.log("=== CREATING ROOT LINK ===");
  const { data: root, error: rootErr } = await supabase
    .from("links")
    .insert({
      event_id: EVENT_ID,
      organisation: "Debug Root",
      limit_free: 10,
      limit_half: 10,
      limit_skip: 10,
      depth: 0,
    })
    .select("*")
    .single();
    
  if (rootErr) {
    console.error("Root creation failed:", rootErr);
    return;
  }
  
  console.log("Root created:", root);
  const rootId = root.id;
  
  console.log("\n=== CREATING CHILD LINK ===");
  const { data: child, error: childErr } = await supabase
    .from("links")
    .insert({
      event_id: EVENT_ID,
      organisation: "Debug Child",
      parent_link_id: rootId,
      limit_free: 3,
      limit_half: 2,
      limit_skip: 1,
      depth: 1,
    })
    .select("*")
    .single();
    
  if (childErr) {
    console.error("Child creation failed:", childErr);
    return;
  }
  
  console.log("Child created:", child);
  const childId = child.id;
  
  // Manually reduce parent quotas (simulating split_link behavior)
  console.log("\n=== MANUALLY REDUCING PARENT QUOTAS ===");
  const { error: reduceErr } = await supabase
    .from("links")
    .update({
      limit_free: 7,  // 10 - 3
      limit_half: 8,  // 10 - 2
      limit_skip: 9,  // 10 - 1
    })
    .eq("id", rootId);
    
  if (reduceErr) {
    console.error("Quota reduction failed:", reduceErr);
    return;
  }
  
  // Check parent state
  console.log("\n=== PARENT STATE AFTER REDUCTION ===");
  const { data: parentAfterReduce } = await supabase
    .from("links")
    .select("*")
    .eq("id", rootId)
    .single();
    
  console.log("Parent after reduction:", parentAfterReduce);
  
  // Now try to restore quotas manually using the same logic as delete_link
  console.log("\n=== MANUALLY RESTORING QUOTAS ===");
  const { error: restoreErr } = await supabase
    .from("links")
    .update({
      limit_free: parentAfterReduce.limit_free + 3,
      limit_half: parentAfterReduce.limit_half + 2,
      limit_skip: parentAfterReduce.limit_skip + 1,
    })
    .eq("id", rootId);
    
  if (restoreErr) {
    console.error("Manual quota restoration failed:", restoreErr);
    return;
  }
  
  // Check final state
  console.log("\n=== FINAL PARENT STATE ===");
  const { data: finalParent } = await supabase
    .from("links")
    .select("*")
    .eq("id", rootId)
    .single();
    
  console.log("Final parent:", finalParent);
  console.log("Expected: free=10, half=10, skip=10");
  console.log("Actual: free=" + finalParent.limit_free + ", half=" + finalParent.limit_half + ", skip=" + finalParent.limit_skip);
  
  // Cleanup
  console.log("\n=== CLEANUP ===");
  await supabase.from("links").delete().eq("id", childId);
  await supabase.from("links").delete().eq("id", rootId);
  
  console.log("Test completed");
}

debugQuotaIssue().catch(console.error);