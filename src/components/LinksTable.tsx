"use client";

import { useEffect } from "react";
import { Tables } from "../../lib/database.types";
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

type LinksTableProps = {
  links: Tables<"links">[];
};

const LinksTable = ({ links }: LinksTableProps) => {
  const supabase = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
  const router = useRouter();

  useEffect(() => {
    const channel = supabase
      .channel("realtime links")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "links",
        },
        (payload) => {
          console.log("Links Payload");
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
          <TableHead>Link</TableHead>
          <TableHead>Organisation</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {links.map((link) => (
          // XXX: The table should be customised to enable the whole row being a link
          <TableRow key={link.id}>
            <TableCell>
              <a className="block" href={link.url_code} target="_blank">
                {link.url_code}
              </a>
            </TableCell>
            <TableCell>
              <a className="block" href={link.url_code} target="_blank">
                {link.organisation}
              </a>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default LinksTable;
