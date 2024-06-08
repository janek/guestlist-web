"use client";

import {
  Table,
  TableBody,
  // TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import type { Tables } from "../../lib/database.types";

type GuestlistTableProps = {
  guests: Tables<"guests">[];
  shouldShowOrganization: boolean;
};

const GuestlistTable = ({
  guests,
  shouldShowOrganization,
}: GuestlistTableProps) => {
  const supabase = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
  const router = useRouter();

  useEffect(() => {
    const channel = supabase
      .channel("realtime guests")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "guests",
        },
        (payload) => {
          console.log("Guests Payload");
          router.refresh();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, router]);
  return (
    <Table>
      {/* <TableCaption>Guestlist for event {event.name} </TableCaption> */}
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Type</TableHead>
          {shouldShowOrganization && <TableHead>Organization</TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {guests.map((guest) => (
          <TableRow
            key={guest.id}
            style={{
              textDecoration: guest.used ? "line-through" : "none",
              color: guest.used ? "gray" : "black",
            }}
          >
            <TableCell>{guest.name}</TableCell>
            <TableCell>{guest.type}</TableCell>
            {shouldShowOrganization && (
              <TableCell>{guest.organisation}</TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default GuestlistTable;
