"use client";

import { Heading } from "@/components/ui/heading";
import { useOrderModalStore } from "@/hooks/use-order-modal";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface OrderClientProps {
  items: any[]
}

export const OrderClient: React.FC<OrderClientProps> = ({
  items
}) => {
  const { openCreateModal } = useOrderModalStore()

  return (
    <div className="flex items-center justify-between">
      <Heading
        title={`Pedidos (${items.length})`}
        description="Gerencie os pedidos de sua loja"
      />
      <Button onClick={openCreateModal}>
        <Plus className="mr-2 h-4 w-4" /> Novo Pedido
      </Button>
    </div>
  );
};
