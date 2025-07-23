import { CreateOrderModal } from "@/components/modals/create-order-modal";
import { OrderDetailsModal } from "@/components/modals/order-details-modal";
import { ApproveOrderModal } from "@/components/modals/approve-order-modal";

export default function OrdersLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <CreateOrderModal />
      <OrderDetailsModal />
      <ApproveOrderModal />
      {children}
    </>
  );
}