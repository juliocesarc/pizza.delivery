import { ColumnDef } from "@tanstack/react-table";

export type ProductColumn = {
  id: string;
  name: string;
  isArchived: boolean;
  isFeatured: boolean;
  createdAt: string;
};

export const columns: ColumnDef<ProductColumn>[] = [
  {
    id: "name",
    header: "Nome",
    accessorKey: "name", // Acessa o campo `name`
  },
  {
    id: "isArchived",
    header: "Arquivar",
  },
  {
    id: "isFeatured",
    header: "Apresentar",
  },
  {
    id: "createdAt",
    header: "Criado em",
    accessorKey: "createdAt", // Acessa o campo `createdAt`
  },
];
