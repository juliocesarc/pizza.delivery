import { getOrdersByEstablishment } from "./__actions/actions";
import { OrderClient } from "./components/client";
import { mails } from "./components/data";
import { OrdersForm } from "./components/ordersForm";

interface OrdersPageProps {
  params: Promise<{
    establishmentId: string;
  }>
}

const OrdersPage = async ({ params }: OrdersPageProps) => {
  const { establishmentId } = await params;

  const orders = await getOrdersByEstablishment(establishmentId)

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-9 p-8 pt-6">
        <OrderClient items={mails}/>
        <OrdersForm 
          initialOrders={orders}
          establishmentId={establishmentId}
        />
      </div>
    </div>
  );
};

export default OrdersPage;