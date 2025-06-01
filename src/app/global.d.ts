import type { Database as DB } from "../../lib/database.types"

declare global {
  type Database = DB
  // Override limit fields from the view to be non-null since they're required in the actual links table
  // but the view's type generation makes them nullable, even though in the actual table they are not
  type Link = Omit<Database["public"]["Views"]["links_with_event_details"]["Row"], 'limit_free' | 'limit_half' | 'limit_skip'> & {
    limit_free: number
    limit_half: number  
    limit_skip: number
  }
  type Guest = Database["public"]["Tables"]["guests"]["Row"]
  type Staff = Database["public"]["Tables"]["staff"]["Row"]
  type GuestlistEvent = Database["public"]["Tables"]["events"]["Row"]
  type ListType = "free" | "half" | "skip"
  type AvailableListTypes = Set<ListType>
}
