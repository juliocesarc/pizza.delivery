"use client";

import { Heading } from "@/components/ui/heading";

import { Orders } from "./orders";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { OrdersForm } from "./ordersForm";
import { useModalStore } from "@/hooks/use-order-modal";

interface OrderClientProps {
  items: any[]
}

export const OrderClient: React.FC<OrderClientProps> = ({
 items
}) => {
  const { openModal, isModalOpen } = useModalStore()
  console.log(isModalOpen)

  return (
    <>
      <button onClick={openModal}>Abrir Detalhes do Pedido</button>
      <Heading title={`Pedidos`} />
      {/* <div className="flex justify-between"> */}
        {/* <div> */}
          <OrdersForm />
        {/* </div> */}
        {/* <ResizableHandle withHandle /> */}
        {/* <div>
          <Orders items={items} />
        </div> */}
      {/* </div>  */}
    </>
  );
};
