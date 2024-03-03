import { Tables } from "../../lib/database.types";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type GuestlistTableProps = {
  guests: Tables<"guests">[];
};

const GuestlistTable = ({ guests }: GuestlistTableProps) => {
  return (
    <Table>
      {/* <TableCaption>Guestlist for event {event.name} </TableCaption> */}
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Organization</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {guests.map((guest) => (
          <TableRow key={guest.id}>
            <TableCell>{guest.name}</TableCell>
            <TableCell>{guest.type}</TableCell>
            <TableCell>{guest.organisation}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default GuestlistTable;
