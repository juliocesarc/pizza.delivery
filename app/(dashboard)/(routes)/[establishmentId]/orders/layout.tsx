import { OrdersModal } from "@/components/modals/orders-modal";

export default function OrdersLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <>
      <OrdersModal />
      {children}
    </>
  );
};