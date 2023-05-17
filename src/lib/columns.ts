import { type ColumnDef } from "@tanstack/react-table"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Channel = {
  thumbnail?: string
  name?: string
}

export const columns: ColumnDef<Channel>[] = [
  {
    accessorKey: "thumbnail",
    header: "Thumbnail",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
]