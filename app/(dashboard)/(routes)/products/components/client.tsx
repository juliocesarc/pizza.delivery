"use client";

import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { ApiList } from "@/components/ui/api-list";

import { columns as baseColumns, ProductColumn } from "./columns";
import { useCallback, useState } from "react";
import { Switch } from "@/components/ui/switch";
import { toggleUpdate } from "../_actions";

interface ProductsClientProps {
  data: ProductColumn[];
}

export const ProductsClient: React.FC<ProductsClientProps> = ({
  data
}) => {
  const router = useRouter();
  const [products, setProducts] = useState(data);

  const handleToggle = useCallback(
    async (id: string, field: "isArchived" | "isFeatured", value: boolean) => {
      try {
        // Atualiza o estado localmente para feedback otimista
        setProducts((prev) =>
          prev.map((product) =>
            product.id === id
              ? { ...product, [field]: value } // Mantém todas as outras propriedades
              : product
          )
        );
  
        // Chamada para a server function
        await toggleUpdate(id, field, value);
      } catch (error) {
        console.error(error);
        // Reverte o estado local em caso de erro
        setProducts((prev) =>
          prev.map((product) =>
            product.id === id
              ? { ...product, [field]: !value } // Reverte a alteração
              : product
          )
        );
      }
    },
    []
  );

  const columns = baseColumns.map((column) => {
    if (column.id === "isArchived" || column.id === "isFeatured") {
      return {
        ...column,
        cell: ({ row }: { row: { original: ProductColumn } }) => {
          const field = column.id as "isArchived" | "isFeatured";
          const value = row.original[field];
  
          return (
            <Switch
              checked={value}
              onCheckedChange={(newValue) => handleToggle(row.original.id, field, newValue)}
            />
          );
        },
      };
    }
    return column;
  });

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Produtos (${products.length})`}
          description="Gerencie seus produtos"
        />
        <Button onClick={() => router.push(`/products/new`)}>
          <Plus className="mr-2 h-4 w-4" /> Adicionar novo
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="name" columns={columns} data={products} />
      <Heading title="API" description="Chamadas de API para Produtos" />
      <Separator />
      <ApiList entityName="products" entityIdName="productId" />
    </>
  );
};