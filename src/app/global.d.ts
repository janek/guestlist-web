import type { Database as DB } from "../../lib/database.types"

declare global {
  type Database = DB
  type Link = Database["public"]["Views"]["links_with_event_details"]["Row"]
  type Guest = Database["public"]["Tables"]["guests"]["Row"]
  type Staff = Database["public"]["Tables"]["staff"]["Row"]
  type ListType = "free" | "half" | "skip"
  type AvailableListTypes = Set<ListType>
}
